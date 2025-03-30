import NextAuth from "next-auth";

import { nextAuthOptions } from "@/modules/nextAuth/option";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
