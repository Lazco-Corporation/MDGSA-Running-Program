import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { defaultCache } from "@/modules/cache";
import { firestoreService } from "../../firestoreService";
import { Class, ClassSchema } from "../../types/Class";

const CACHE_KEY = "firestoreOperation:class:listAll";

export async function listAll(): Promise<Class[]> {
  const cachedClasses = defaultCache.get<Class[]>(CACHE_KEY);
  if (cachedClasses) {
    return cachedClasses;
  }

  try {
    const classesSnapshot = await firestoreService.collection("classes").get();

    if (classesSnapshot.empty) {
      defaultCache.set(CACHE_KEY, []);
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

    defaultCache.set(CACHE_KEY, classes);

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
