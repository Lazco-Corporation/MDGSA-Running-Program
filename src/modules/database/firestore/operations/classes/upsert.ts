import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { graduateClasses } from "@/modules/graduateClasses";
import { firestoreService } from "../../firestoreService";
import { Class, ClassSchema } from "../../types/Class";

export async function upsertByGraduateYearAndGlobalCode({
  graduateYear,
  globalCode,
  classData,
}: {
  graduateYear: number;
  globalCode: string;
  classData: Partial<
    Omit<
      Class,
      "id" | "createdAt" | "updatedAt" | "graduateYear" | "globalCode"
    >
  >;
}): Promise<Class> {
  try {
    const validGraduateYears = Object.keys(graduateClasses);
    const validGraduateClassesGlobalCodes = graduateClasses[
      graduateYear as keyof typeof graduateClasses
    ].all.map((classInfo) => classInfo.globalCode);

    if (!validGraduateYears.includes(graduateYear.toString())) {
      throw new Error("Invalid graduate year");
    }

    if (!validGraduateClassesGlobalCodes.includes(globalCode)) {
      throw new Error("Invalid global code");
    }

    const querySnapshot = await firestoreService
      .collection("classes")
      .where("graduateYear", "==", graduateYear)
      .where("globalCode", "==", globalCode)
      .limit(1)
      .get();

    const now = Date.now();

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const existingData = querySnapshot.docs[0].data();

      const updatedData = {
        ...classData,
        graduateYear,
        globalCode,
        updatedAt: now,
      };

      await docRef.update(updatedData);

      const updatedClass = {
        id: docRef.id,
        graduateYear,
        globalCode,
        laps: classData.laps ?? existingData.laps ?? 1,
        createdAt: existingData.createdAt || now,
        updatedAt: now,
      };

      return ClassSchema.parse(updatedClass);
    } else {
      const newClassData = {
        ...classData,
        graduateYear,
        globalCode,
        laps: classData.laps ?? 1,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await firestoreService
        .collection("classes")
        .add(newClassData);

      const newClass = {
        id: docRef.id,
        ...newClassData,
      };

      return ClassSchema.parse(newClass);
    }
  } catch (_error) {
    throw new ClientError(
      {
        errorMessage: "Failed to upsert class",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
