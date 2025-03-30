import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { shouldRedirect, response } = generateMainHostRedirect({
    request,
    mainHost: "run.mingdao.edu.tw",
  });
  if (shouldRedirect) {
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function generateMainHostRedirect({
  request,
  ignoreHosts = [/localhost:3\d{3}/, /127.0.0.1:3\d{3}/],
  mainHost,
}: {
  request: NextRequest;
  ignoreHosts?: (string | RegExp)[];
  mainHost: string;
}) {
  const host = request.nextUrl.host;
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  const shouldIgnore = [...ignoreHosts, mainHost].some((pattern) => {
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    return regex.test(host);
  });

  if (!shouldIgnore) {
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
}
