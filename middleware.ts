import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
  "/",
  '/api/webhooks/clerk', // Add any additional routes here
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // Protect the route if it matches the defined criteria
  }
});