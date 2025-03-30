import { NextResponse } from "next/server";

import { firestoreOperation } from "@/modules/database/firestore";
import { graduateClasses } from "@/modules/graduateClasses";
import { requestHandler } from "@/modules/requestHandler";
import { ListAllClassesResponse } from "./types";

export const GET = requestHandler.withoutAuth(async () => {
  const allClasses = await firestoreOperation.class.list.all();

  const formattedAllClasses = allClasses
    .map((classInfo) => ({
      name:
        graduateClasses[
          Number(
            process.env.CURRENT_GRADUATE_YEAR,
          ) as keyof typeof graduateClasses
        ].all.find(
          (fullClassInfo) => fullClassInfo.globalCode === classInfo.globalCode,
        )?.name || "",
      graduateYear: classInfo.graduateYear,
      globalCode: classInfo.globalCode,
      laps: classInfo.laps,
      createdAt: classInfo.createdAt,
      updatedAt: classInfo.updatedAt,
    }))
    .sort((a, b) => {
      if (a.laps !== b.laps) {
        return b.laps - a.laps;
      }
      return b.updatedAt - a.updatedAt;
    });

  return NextResponse.json({
    allClasses: formattedAllClasses,
  } as ListAllClassesResponse);
});
