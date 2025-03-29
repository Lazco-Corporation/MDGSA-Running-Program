import { ClientError } from "@/modules/clientError";
import { graduateClasses } from "@/modules/graduateClasses";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreService } from "../../firestoreService";
import { ClassSchema } from "../../types/Class";

export async function getByGraduateYearAndGlobalCode({
  graduateYear,
  globalCode,
}: {
  graduateYear: number;
  globalCode: string;
}) {
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

    if (querySnapshot.empty) {
      throw new ClientError(
        {
          errorMessage: "Class not found",
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      const docRef = querySnapshot.docs[0].ref;
      const existingData = querySnapshot.docs[0].data();

      const updatedClass = {
        id: docRef.id,
        ...existingData,
      };

      return ClassSchema.parse(updatedClass);
    }
  } catch (_error) {
    throw new ClientError(
      {
        errorMessage: "Failed to get class",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
