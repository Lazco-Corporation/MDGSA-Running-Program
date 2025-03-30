import { NextResponse } from "next/server";

import { graduateClasses } from "@/modules/graduateClasses";
import { requestHandler } from "@/modules/requestHandler";
import { GraduateQuantityResponse } from "./types";

export const GET = requestHandler.withoutAuth(async () => {
  const graduateClassesCollection =
    graduateClasses[
      Number(process.env.CURRENT_GRADUATE_YEAR) as keyof typeof graduateClasses
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
});
