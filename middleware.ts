import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth",
        error: "/auth",
    }
});

export const config = {
    matcher: [
        "/profile/:path*",
        "/reports/:path*",
        "/load-doc",
    ]
}