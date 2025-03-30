import { NextResponse } from "next/server";

import { firestoreOperation } from "@/modules/database/firestore";
import { requestHandler } from "@/modules/requestHandler";
import { TotalLapsResponse } from "./types";

export const GET = requestHandler.withoutAuth(async () => {
  const allClasses = await firestoreOperation.class.list.all();

  const totalLaps = allClasses.reduce((total, classInfo) => {
    return total + classInfo.laps;
  }, 0);

  return NextResponse.json({
    totalLaps: totalLaps,
  } as TotalLapsResponse);
});
