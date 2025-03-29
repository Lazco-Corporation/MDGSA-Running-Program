import { listAll } from "./operations/classes/listAll";
import { upsertByGraduateYearAndGlobalCode } from "./operations/classes/upsert";

export const firestoreOperation = {
  classes: {
    listAll,
    upsertByGraduateYearAndGlobalCode,
  },
};
