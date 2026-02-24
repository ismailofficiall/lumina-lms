export { default } from 'next-auth/middleware';

/**
 * Routes that require a valid session.
 * Anyone without a session is redirected to /login automatically.
 */
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/courses/:path*',
        '/schedule/:path*',
        '/resources/:path*',
        '/settings/:path*',
    ],
};
