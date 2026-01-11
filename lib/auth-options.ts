import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Reuse the base URL logic or import a constant if available
const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
                        method: 'POST',
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        }),
                        headers: { "Content-Type": "application/json" }
                    });

                    const data = await res.json();

                    if (res.ok && data.success && data.user) {
                        return {
                            id: data.user._id,
                            _id: data.user._id,
                            name: data.user.name,
                            email: data.user.email,
                            role: data.user.role,
                            token: data.admin_token 
                        };
                    }

                    console.error("NextAuth Authorize Error:", data.error || "Login failed");
                    return null;
                } catch (error) {
                    console.error("NextAuth Fetch Error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token._id = user._id;
                token.role = user.role;
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user._id = token._id;
                session.user.role = token.role;
                session.user.token = token.token;
            }
            return session;
        }
    },
    pages: {
        signIn: '/mahisadminpanel/login',
        error: '/auth/error',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
