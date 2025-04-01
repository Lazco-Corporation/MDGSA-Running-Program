import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { mdApi } from "@/modules/mdApi";
import { getGraduateClassInfo } from "@/modules/getGraduateClassInfo";
import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import {
  ExtendedNextAuthToken,
  ExtendedNextAuthSession,
} from "@/app/api/auth/[...nextauth]/types";

export const nextAuthOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ||
    (() => {
      throw new Error("Error loading env: NEXTAUTH_SECRET is not defined");
    })(),
  providers: [
    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        (() => {
          throw new Error("Error loading env: GOOGLE_CLIENT_ID is not defined");
        })(),
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        (() => {
          throw new Error(
            "Error loading env: GOOGLE_CLIENT_SECRET is not defined",
          );
        })(),
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        return false;
      }

      const bannedStudentIds = ["11v176", "11v342", "11v496"];

      if (bannedStudentIds.includes(profile.email.split("@")[0])) {
        return false;
      }

      return true;
    },

    async jwt({ token, account, profile }) {
      const email = profile?.email;
      if (!email) {
        return token;
      }

      const extendedToken = token as ExtendedNextAuthToken;

      if (account) {
        extendedToken.accessToken = account.access_token;

        const userData = await mdApi.receiveUserData
          .email({ email })
          .catch((error) => {
            if (
              error instanceof ClientError &&
              error.code === HttpStatus.NOT_FOUND
            ) {
              return undefined;
            }
            throw error;
          });
        extendedToken.userAttributes = userData;
        extendedToken.belongsToMingdao = Boolean(userData);

        if (userData) {
          try {
            const classInfo = getGraduateClassInfo(userData);
            extendedToken.isGraduateClass = Boolean(classInfo);
          } catch (error) {
            if (
              error instanceof ClientError &&
              error.code === HttpStatus.FORBIDDEN
            ) {
              extendedToken.isGraduateClass = false;
            }

            throw error;
          }
        }
      }

      return extendedToken;
    },

    async session({ session, token }) {
      const extendedSession = session as ExtendedNextAuthSession;
      const extendedToken = token as ExtendedNextAuthToken;

      const { accessToken, isGraduateClass, belongsToMingdao, userAttributes } =
        extendedToken;
      extendedSession.accessToken = accessToken;
      extendedSession.isGraduateClass = isGraduateClass;
      extendedSession.belongsToMingdao = belongsToMingdao;
      extendedSession.userAttributes = userAttributes;

      return extendedSession;
    },
  },
};
