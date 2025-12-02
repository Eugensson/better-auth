import { nextCookies } from "better-auth/next-js";
import { admin, customSession, magicLink } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { betterAuth, type BetterAuthOptions } from "better-auth";

import prisma from "@/lib/prisma";
import { ac, roles } from "@/lib/permissions";
import { UserRole } from "@/generated/prisma/enums";
import { hashPassword, verifyPassword } from "@/lib/argon2";
import { getValidDomains, normalizeName } from "@/lib/utils";
import { sendEmailAction } from "@/actions/send-email.action";

const options = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: "Reset your password",
        meta: {
          description: "Please click the link below to reset your password.",
          link: String(url),
        },
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/auth/verify");

      await sendEmailAction({
        to: user.email,
        subject: "Verify your email address",
        meta: {
          description:
            "Please verify your email address to complete the registration process.",
          link: String(link),
        },
      });
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1];

        const VALID_DOMAINS = getValidDomains();
        if (!VALID_DOMAINS.includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid email domain. Please use a valid email address.",
          });
        }

        return {
          context: {
            ...ctx,
            body: { ...ctx.body, name: normalizeName(ctx.body.name) },
          },
        };
      }

      if (ctx.path === "/sign-in/magic-link") {
        return {
          context: {
            ...ctx,
            body: { ...ctx.body, name: normalizeName(ctx.body.name) },
          },
        };
      }

      if (ctx.path === "/update-user") {
        return {
          context: {
            ...ctx,
            body: { ...ctx.body, name: normalizeName(ctx.body.name) },
          },
        };
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];

          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: UserRole.ADMIN } };
          }

          return { data: user };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: [UserRole.USER, UserRole.ADMIN],
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles,
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmailAction({
          to: email,
          subject: "Magic Link Login",
          meta: {
            description: "Please click the link below to sign in.",
            link: String(url),
          },
        });
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          role: user.role,
        },
      };
    }, options),
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
