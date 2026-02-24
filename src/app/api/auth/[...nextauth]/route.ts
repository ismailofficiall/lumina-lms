import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findStudent } from '@/lib/auth-users';
import { tryRegisterSession, removeSession } from '@/lib/session-store';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Lumina',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const student = findStudent(credentials.email, credentials.password);
                if (!student) return null;

                // ── Device-limit check ──────────────────────────────
                // We generate a random token per login attempt so each
                // device login gets its own slot in the tracker.
                const sessionToken = `${student.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
                const { allowed } = tryRegisterSession(student.id, sessionToken);

                if (!allowed) {
                    // Throwing here surfaces as "OAuthSignin" error on the client
                    throw new Error('DEVICE_LIMIT');
                }

                return {
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    // Store token in user object so it flows into JWT
                    sessionToken,
                };
            },
        }),
    ],

    pages: {
        signIn: '/login',
        error: '/login',
    },

    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 8,   // 8 hours
    },

    callbacks: {
        /** Persist the per-device sessionToken into the JWT */
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.sessionToken = (user as { sessionToken?: string }).sessionToken;
            }
            return token;
        },

        /** Expose id on session.user */
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.id as string;
            }
            return session;
        },
    },

    events: {
        /** Free the session slot when the user explicitly signs out */
        async signOut({ token }) {
            if (token?.id && token?.sessionToken) {
                removeSession(token.id as string, token.sessionToken as string);
            }
        },
    },

    secret: process.env.NEXTAUTH_SECRET ?? 'lumina-dev-secret-change-in-production',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
