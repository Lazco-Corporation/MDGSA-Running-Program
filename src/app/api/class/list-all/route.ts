import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { Class } from "@/modules/database/firestore/types/Class";
import { firestoreOperation } from "@/modules/database/firestore";
import { ClassInfo, graduateClasses } from "@/modules/graduateClasses";

export type ListAllClassesResponse = {
  allClasses: { name: ClassInfo["name"]; laps: Class["laps"] }[];
};

export async function GET() {
  try {
    const allClasses = await firestoreOperation.classes.listAll();

    const formattedAllClasses = allClasses.map((classInfo) => ({
      name:
        graduateClasses[2025].all.find(
          (fullClassInfo) => fullClassInfo.globalCode === classInfo.globalCode,
        )?.name || "",
      laps: classInfo.laps,
    }));

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
