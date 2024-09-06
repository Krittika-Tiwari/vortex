import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes using createRouteMatcher
const isPublicRoute = createRouteMatcher([
  '/site(.*)',  
  '/(.*)',          // Matches '/site' and any subpaths
  '/api/uploadthing(.*)', // Matches '/api/uploadthing' and any subpaths
  '/agency/sign-in(.*)',  // Matches '/agency/sign-in' and any subpaths
  '/agency/sign-up(.*)'   // Matches '/agency/sign-up' and any subpaths
]);

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl;
  const searchParams = url.searchParams.toString();
  const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // Check if the route is public
  if (!isPublicRoute(request)) {
    // Protect the route if it's not public
    auth().protect();
  }

  // Extract hostname from headers
  const hostname = request.headers.get('host') || '';

  // If subdomain exists, rewrite URL to include subdomain
  const customSubDomain = hostname.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)[0].replace(/\.$/, '');

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, request.url)
    );
  }

  // Redirect to agency sign-in if the path is '/sign-in' or '/sign-up'
  if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    return NextResponse.redirect(new URL('/agency/sign-in', request.url));
  }

  // Rewrite path to '/site' for certain conditions
  if (
    url.pathname === '/' ||
    (url.pathname === '/site' && url.hostname === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL('/site', request.url));
  }

  // Rewrite paths for agency or subaccount routes
  if (
    url.pathname.startsWith('/agency') ||
    url.pathname.startsWith('/subaccount')
  ) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, request.url));
  }

  // Proceed with the default Clerk behavior
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Match all routes except static files and Next.js internals
    '/',                     // Root path
    '/(api|trpc)(.*)',       // API and TRPC routes
  ],
};
