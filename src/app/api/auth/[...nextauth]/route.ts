import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
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
    async signIn({ account, profile }) {
      return true;
    },
    async jwt({ token, account }) {
      const _token = token;
      if (account) {
        _token.accessToken = account?.access_token;
      }

      return _token;
    },
    async session({ session, token }) {
      const _session: any = session;
      const _token: any = token;
      _session.accessToken = _token.accessToken;
      return _session;
    },
  },
});

export { handler as GET, handler as POST };
