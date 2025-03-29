import { getByGraduateYearAndGlobalCode } from "./operations/class/get";
import { listAll } from "./operations/class/listAll";
import { upsertByGraduateYearAndGlobalCode } from "./operations/class/upsert";

export const firestoreOperation = {
  class: {
    listAll,
    upsertByGraduateYearAndGlobalCode,
    getByGraduateYearAndGlobalCode,
  },
};
