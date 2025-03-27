import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   // Protect all routes starting with `/admin`
//   if (
//     isAdminRoute(req) &&
//     (await auth()).sessionClaims?.metadata?.role !== "admin"
//   ) {
//     const url = new URL("/", req.url);
//     return NextResponse.redirect(url);
//   }
// });

// Updated route pattern to match both dashboard and all dshb-* routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/dshb-(.*)dashboard(.*)",
  "/dshb-(.*)courses(.*)",
  "/dshb-(.*)settings(.*)",
  "/dshb-(.*)survey(.*)",
  "/dshb-(.*)reviews(.*)",
  "/dshb-(.*)quiz(.*)",
  "/dshb-(.*)participants(.*)",
  "/dshb-(.*)messages(.*)",
  "/dshb-(.*)listing(.*)",
  "/dshb-(.*)grades(.*)",
  "/dshb-(.*)forums(.*)",
  "/dshb-(.*)dictionary(.*)",
  "/dshb-(.*)calendar(.*)",
  "/dshb-(.*)bookmarks(.*)",
  "/dshb-(.*)assignment(.*)",
  "/dshb-(.*)administration(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
// export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
