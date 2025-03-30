import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { graduateClasses } from "@/modules/graduateClasses";
import { GraduateQuantityResponse } from "./types";

export async function GET() {
  try {
    const graduateClassesCollection =
      graduateClasses[
        Number(
          process.env.CURRENT_GRADUATE_YEAR,
        ) as keyof typeof graduateClasses
      ];

    const allClasses = [
      ...graduateClassesCollection.internationalClasses,
      ...graduateClassesCollection.juniorHighClasses,
      ...graduateClassesCollection.seniorHighClasses,
      ...graduateClassesCollection.technicalHighClasses,
    ];

    return NextResponse.json({
      graduateClassesQuantity: allClasses.length,
    } as GraduateQuantityResponse);
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
