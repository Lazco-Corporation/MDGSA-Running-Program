import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { graduateClasses } from "@/modules/graduateClasses";
import { HttpStatus } from "@/modules/http/statusCodes";
import { mdApi } from "@/modules/mdApi";

export async function GET() {
  try {
    const userData = await mdApi.receiveUserData.email({
      email: "",
    });

    if (userData?.userIdentity === "stu") {
      const className = userData.className;

      const classInfo = graduateClasses[2025].all.find(
        (classInfo) => classInfo.name === className,
      );
      if (classInfo) {
        return NextResponse.json({
          userData,
          classInfo,
        });
      } else {
        throw new ClientError(
          { errorMessage: "Not graduate class" },
          HttpStatus.FORBIDDEN,
        );
      }
    } else if (userData?.userIdentity === "teach") {
      const className = userData.className;

      const classInfo = graduateClasses[2025].all.find(
        (classInfo) => classInfo.name === className,
      );
      if (classInfo) {
        return NextResponse.json({
          userData,
          classInfo,
        });
      } else {
        throw new ClientError(
          { errorMessage: "Not teacher of graduate class" },
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new ClientError(
        { errorMessage: "Only student or teacher can access" },
        HttpStatus.FORBIDDEN,
      );
    }
  } catch (error) {
    if (error instanceof ClientError) {
      return NextResponse.json(error.payload, { status: error.code || 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
