import { getByGraduateYearAndGlobalCode } from "./operations/class/get";
import { listAll } from "./operations/class/list";
import { upsertByGraduateYearAndGlobalCode } from "./operations/class/upsert";
import { createByResourceTypeAndResourceId } from "./operations/log/create";
import { listByResourceTypeAndResourceId } from "./operations/log/list";

export const firestoreOperation = {
  class: {
    list: {
      all: listAll,
    },
    upsert: {
      byGraduateYearAndGlobalCode: upsertByGraduateYearAndGlobalCode,
    },
    get: {
      byGraduateYearAndGlobalCode: getByGraduateYearAndGlobalCode,
    },
  },
  log: {
    create: {
      byResourceTypeAndResourceId: createByResourceTypeAndResourceId,
    },
    list: {
      byResourceTypeAndResourceId: listByResourceTypeAndResourceId,
    },
  },
};
