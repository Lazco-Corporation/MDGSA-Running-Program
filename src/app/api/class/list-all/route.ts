import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreOperation } from "@/modules/database/firestore";
import { graduateClasses } from "@/modules/graduateClasses";
import { ListAllClassesResponse } from "./types";

export async function GET() {
  try {
    const allClasses = await firestoreOperation.classes.listAll();

    const formattedAllClasses = allClasses
      .map((classInfo) => ({
        name:
          graduateClasses[2025].all.find(
            (fullClassInfo) =>
              fullClassInfo.globalCode === classInfo.globalCode,
          )?.name || "",
        graduateYear: classInfo.graduateYear,
        globalCode: classInfo.globalCode,
        laps: classInfo.laps,
        createdAt: classInfo.createdAt,
        updatedAt: classInfo.updatedAt,
      }))
      .sort((a, b) => b.laps - a.laps);

    return NextResponse.json({
      allClasses: formattedAllClasses,
    } as ListAllClassesResponse);
  } catch (error) {
    if (error instanceof ClientError) {
      return NextResponse.json(error.payload, { status: error.code || 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
