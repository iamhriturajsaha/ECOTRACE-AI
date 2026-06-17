import { NextAuthOptions } from "next-auth";
import { Adapter, AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

/**
 * Custom adapter that permanently fixes the OAuthAccountNotLinked error.
 * 
 * Root cause: NextAuth's OAuth callback calls getUserByEmail(). If it finds 
 * an existing user (from Credentials signup), it throws OAuthAccountNotLinked.
 * The allowDangerousEmailAccountLinking flag is unreliable across versions.
 * 
 * Fix: We intercept getUserByEmail to return null during OAuth flow, so NextAuth
 * thinks the user is brand new. Then we intercept createUser to return the 
 * existing user instead of creating a duplicate. NextAuth then calls linkAccount
 * which cleanly creates the Account record linking Google → existing user.
 */
function LinkingPrismaAdapter(): Adapter {
  const base = PrismaAdapter(prisma);

  return {
    ...base,

    // Return null so NextAuth never sees the "conflicting" user.
    // This prevents the OAuthAccountNotLinked error entirely.
    getUserByEmail: async (email: string) => {
      // We intentionally return null here.
      // NextAuth will proceed to the "create new user" branch,
      // where our createUser override handles the merge.
      return null;
    },

    // When NextAuth tries to "create" the OAuth user, check if one already
    // exists with the same email. If so, return it to merge the accounts.
    createUser: async (data: any) => {
      if (data.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email },
        });
        if (existingUser) {
          // Merge Google profile data into existing account
          const updated = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: existingUser.name || data.name,
              image: existingUser.image || data.image,
              emailVerified: data.emailVerified || existingUser.emailVerified,
            },
          });
          return updated as AdapterUser;
        }
      }
      return base.createUser!(data);
    },
  };
}

export const authOptions: NextAuthOptions = {
  adapter: LinkingPrismaAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // For credentials login, user.id is set directly.
        // For OAuth login, the adapter returns the merged/created user,
        // so user.id correctly points to the existing account.
        token.id = user.id;
      }

      // If signing in via OAuth, look up the real user ID from the database
      // to ensure the token always has the correct ID.
      if (account && account.provider !== "credentials" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: false,
};
