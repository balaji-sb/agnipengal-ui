import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Custom middleware logic if needed
    // The "authorized" callback in `withAuth` config handles the check
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Protect functionality under /mahisadminpanel, excluding /login
        if (path.startsWith("/mahisadminpanel") && !path.startsWith("/mahisadminpanel/login")) {
             // Check if user is authenticated and is an admin (optional role check)
             return !!token;
        }
        
        // Allow other paths
        return true;
      },
    },
    pages: {
        signIn: "/mahisadminpanel/login",
    }
  }
);

export const config = {
  matcher: [
    "/mahisadminpanel/:path*",
    // Add other protected routes if necessary
  ],
};
