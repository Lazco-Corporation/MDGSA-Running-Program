import { NextResponse } from "next/server";

import { mdApi } from "@/modules/mdApi";
import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreOperation } from "@/modules/database/firestore";
import {
  LogResourceId,
  LogResourceType,
} from "@/modules/database/firestore/operations/log/create";
import { recordLogEntry } from "@/modules/recordLogEntry";
import { getGraduateClassInfo } from "@/modules/getGraduateClassInfo";
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

    const userClassInfo = getGraduateClassInfo(userData);

    const previousClassData = await firestoreOperation.class.get
      .byGraduateYearAndGlobalCode({
        graduateYear: Number(process.env.CURRENT_GRADUATE_YEAR),
        globalCode: userClassInfo.globalCode,
      })
      .catch(() => ({}));

    const classData =
      await firestoreOperation.class.upsert.byGraduateYearAndGlobalCode({
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
