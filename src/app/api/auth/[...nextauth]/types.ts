import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

import { GoogleUserCheckResponse } from "@/modules/mdApi/methods/googleUserCheck";

type CustomExtendedData = {
  accessToken?: string;
  isGraduateClass: boolean;
  belongsToMingdao: boolean;
  userAttributes?: GoogleUserCheckResponse;
  isBanned: boolean;
};
export type ExtendedNextAuthToken = JWT & CustomExtendedData;
export type ExtendedNextAuthSession = Session & CustomExtendedData;
