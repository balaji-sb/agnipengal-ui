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
             console.log("Debug: Credentials", credentials);
            if (!credentials?.email || !credentials?.password) {
                throw new Error("Missing credentials");
            }

            try {
                console.log("Debug: authorize called");
                console.log("Debug: API_BASE_URL:", API_BASE_URL);
                console.log("Debug: Credentials email:", credentials?.email);

                const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
                    method: "POST",
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    }),
                    headers: { "Content-Type": "application/json" }
                });

                console.log("Debug: Backend response status:", res.status);
                // ✅ read raw text first
                const text = await res.text();

                let data;
                try {
                    data = JSON.parse(text);
                    console.log("Debug: Backend response data:", data); // Log parsed data
                } catch {
                    console.error("Backend returned non-JSON:", text);
                    throw new Error("Server error: invalid response");
                }

                if (!res.ok || !data.success) {
                    console.error("NextAuth Authorize Error:", data.error || "Login failed"); // Log specific error
                    throw new Error(data.error || "Invalid credentials");
                }

                return {
                    id: data.user._id,
                    _id: data.user._id,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role,
                    token: data.admin_token
                };

            } catch (error: any) {
                console.error("NextAuth Fetch Error:", error.message);
                throw new Error(error.message || "Login failed");
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
    debug: true, // Enable debug logs
    secret: process.env.NEXTAUTH_SECRET,
};
