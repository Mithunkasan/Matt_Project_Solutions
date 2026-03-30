// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   callbacks: {
//     authorized: ({ token }) => !!token,
//   },
// });

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/api/projects/:path*",
//     "/api/classes/:path*",
//   ],
// };







// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   callbacks: {
//     authorized: ({ token }) => !!token,
//   },
// });

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/api/projects/:path*",
//     "/api/classes/:path*",
//   ],
// };



import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // You can add additional logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if token exists
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/home/:path*",
    "/browse/:path*",
    "/api/projects/:path*",
    "/api/classes/:path*",
  ],
};