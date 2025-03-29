import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreService } from "../../firestoreService";
import { Class, ClassSchema } from "../../types/Class";

export async function listAll(): Promise<Class[]> {
  try {
    const classesSnapshot = await firestoreService.collection("classes").get();

    if (classesSnapshot.empty) {
      return [];
    }

    const classes = classesSnapshot.docs.map((doc) => {
      const data = doc.data();

      const classData = {
        id: doc.id,
        graduateYear: data.graduateYear || 0,
        globalCode: data.globalCode || "",
        laps: data.laps || 0,
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
      };

      return ClassSchema.parse(classData);
    });

    return classes;
  } catch (_error) {
    throw new ClientError(
      {
        errorMessage: "Failed to fetch classes",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
