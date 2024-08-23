import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/site", "/api/uploadthing"]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  // Rewrite for domains
  const url = request.nextUrl;
  const searchParams = url.searchParams.toString();
  let hostname = request.headers.get("host");

  const pathWithSearchParams = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // If subdomain exists
  const customSubDomain = hostname
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, request.url)
    );
  }

  // Redirect for sign-in and sign-up
  if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
    return NextResponse.redirect(new URL(`/agency/sign-in`, request.url));
  }

  // Rewrite for root or site path
  if (
    url.pathname === "/" ||
    (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL("/site", request.url));
  }

  // Handle agency or subaccount paths
  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  ) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, request.url));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", "/(.*)"],
};
