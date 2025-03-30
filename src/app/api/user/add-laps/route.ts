import { NextResponse } from "next/server";

import { graduateClasses } from "@/modules/graduateClasses";
import { mdApi } from "@/modules/mdApi";
import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { GoogleUserCheckResponse } from "@/modules/mdApi/methods/googleUserCheck";
import { firestoreOperation } from "@/modules/database/firestore";
import { administrationTeam } from "@/modules/graduateClasses/classes/administrationTeam";
import {
  LogResourceId,
  LogResourceType,
} from "@/modules/database/firestore/operations/log/addLogEntry";
import { recordLogEntry } from "@/modules/recordLogEntry";
import { AddLapsRequestSchema, AddLapsResponse } from "./types";

export async function POST(request: Request) {
  const requestStartTime = Date.now();
  let userEmailForLogging: string | undefined;

  try {
    const body = await request.json().catch(() => ({}));

    const parsedResult = AddLapsRequestSchema.safeParse(body);
    if (!parsedResult.success) {
      throw new ClientError(
        {
          errorObject: parsedResult.error.flatten().fieldErrors,
          errorMessage: "Request body does not match expected schema",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { email, laps, headcount } = parsedResult.data;
    userEmailForLogging = email;

    const userData = await mdApi.receiveUserData.email({
      email,
    });

    const userClassInfo = getUserClassInfo(userData);

    const previousClassData = await firestoreOperation.class
      .getByGraduateYearAndGlobalCode({
        graduateYear: Number(process.env.CURRENT_GRADUATE_YEAR),
        globalCode: userClassInfo.globalCode,
      })
      .catch(() => ({}));

    const classData =
      await firestoreOperation.class.upsertByGraduateYearAndGlobalCode({
        graduateYear: Number(process.env.CURRENT_GRADUATE_YEAR),
        globalCode: userClassInfo.globalCode,
        classData: {
          laps:
            ("laps" in previousClassData ? previousClassData.laps : 0) +
            laps * headcount,
        },
      });

    recordLogEntry({
      resourceType: LogResourceType.BACKEND,
      resourceId: LogResourceId.USER_ADD_LAPS,
      logData: {
        action: "update",
        userEmail: email,
        metadata: {
          processingTimeMs: Date.now() - requestStartTime,
          headcount,
          addedLaps: laps * headcount,
          totalLaps: classData.laps,
        },
        status: "success",
      },
    });

    return NextResponse.json({
      classData,
    } as AddLapsResponse);
  } catch (error) {
    recordLogEntry({
      resourceType: LogResourceType.BACKEND,
      resourceId: LogResourceId.USER_ADD_LAPS,
      logData: {
        action: "error",
        userEmail: userEmailForLogging,
        metadata: {
          processingTimeMs: Date.now() - requestStartTime,
        },
        status: "failure",
        errorDetails: {
          clientError: error instanceof ClientError ? error : undefined,
          otherError: error,
        },
      },
    });

    if (error instanceof ClientError) {
      return NextResponse.json(error.payload, { status: error.code || 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}

function getUserClassInfo(userData: GoogleUserCheckResponse) {
  if (userData?.userIdentity === "stu") {
    const className = userData.className;

    const classInfo = graduateClasses[
      Number(process.env.CURRENT_GRADUATE_YEAR) as keyof typeof graduateClasses
    ].all.find((classInfo) => classInfo.name === className);
    if (classInfo) {
      return classInfo;
    } else {
      throw new ClientError(
        { errorMessage: "Not graduate class" },
        HttpStatus.FORBIDDEN,
      );
    }
  } else if (userData?.userIdentity === "teach") {
    const className = userData.className;

    const classInfo = graduateClasses[
      Number(process.env.CURRENT_GRADUATE_YEAR) as keyof typeof graduateClasses
    ].all.find((classInfo) => classInfo.name === className);
    if (classInfo) {
      return classInfo;
    } else {
      return administrationTeam;
    }
  } else {
    throw new ClientError(
      { errorMessage: "Only student or teacher can access" },
      HttpStatus.FORBIDDEN,
    );
  }
}
