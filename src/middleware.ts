import { NextRequest, NextResponse } from "next/server";

const prebuiltOperations = {
  generateMainHostRedirect({
    request,
    ignoreHosts = [/localhost:\d{4}/, /127.0.0.1:\d{4}/],
    mainHost,
  }: {
    request: NextRequest;
    ignoreHosts?: (string | RegExp)[];
    mainHost: string;
  }) {
    const host = request.nextUrl.host;

    const shouldIgnore = [
      ...ignoreHosts,
      mainHost,
      process.env.NEXT_PUBLIC_VERCEL_URL || undefined,
      (process.env.HOST &&
        process.env.PORT &&
        `${process.env.HOST}:${process.env.PORT}`) ||
        undefined,
    ]
      .filter((host) => host !== undefined && host !== null)
      .some((pattern) => {
        const regex =
          typeof pattern === "string" ? new RegExp(pattern) : pattern;
        return regex.test(host);
      });

    if (!shouldIgnore) {
      const path = request.nextUrl.pathname;
      const search = request.nextUrl.search;
      const redirectUrl = new URL(`https://${mainHost}${path}${search}`);

      return {
        shouldRedirect: true,
        response: NextResponse.redirect(redirectUrl),
      };
    }

    return {
      shouldRedirect: false,
      response: NextResponse.next(),
    };
  },
  redirectToMaintainingPath({
    request,
    ignoreHosts = [/localhost:\d{4}/, /127.0.0.1:\d{4}/],
    maintainingPath = "/maintaining",
  }: {
    request: NextRequest;
    ignoreHosts?: (string | RegExp)[];
    maintainingPath: string;
  }) {
    const host = request.nextUrl.host;

    const shouldIgnore = [
      ...ignoreHosts,
      process.env.NEXT_PUBLIC_VERCEL_URL || undefined,
      (process.env.HOST &&
        process.env.PORT &&
        `${process.env.HOST}:${process.env.PORT}`) ||
        undefined,
    ]
      .filter((host) => host !== undefined && host !== null)
      .some((pattern) => {
        const regex =
          typeof pattern === "string" ? new RegExp(pattern) : pattern;
        return regex.test(host);
      });

    if (!shouldIgnore && request.nextUrl.pathname !== maintainingPath) {
      const redirectUrl = new URL("/maintaining", request.url);

      return {
        shouldRedirect: true,
        response: NextResponse.redirect(redirectUrl),
      };
    }

    return {
      shouldRedirect: false,
      response: NextResponse.next(),
    };
  },
};

export function middleware(request: NextRequest) {
  const { shouldRedirect, response } =
    prebuiltOperations.generateMainHostRedirect({
      request,
      mainHost: "run.mingdao.edu.tw",
    });

  if (shouldRedirect) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|banners|icons|images|logos).*)",
  ],
};
