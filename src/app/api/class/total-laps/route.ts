import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { firestoreOperation } from "@/modules/database/firestore";
import { HttpStatus } from "@/modules/http/statusCodes";

export async function GET() {
  try {
    const allClasses = await firestoreOperation.classes.listAll();

    const totalLaps = allClasses.reduce((total, classInfo) => {
      return total + classInfo.laps;
    }, 0);

    return NextResponse.json({
      totalLaps: totalLaps,
    });
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
