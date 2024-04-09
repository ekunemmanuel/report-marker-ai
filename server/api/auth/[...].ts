import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions, User as AdapterUser } from "next-auth";
import { z } from "zod";
import { compare } from "bcrypt";
import { NuxtAuthHandler } from "#auth";
import { User } from "~/server/models/user.model";

// The #auth virtual import comes from this module. You can use it on the client
// and server side, however not every export is universal. For example do not
// use sign-in and sign-out on the server side.

const runtimeConfig = useRuntimeConfig();

// Refer to Auth.js docs for more details

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
    // newUser: "/register",
    // signOut: "/dashboard/forms",
    error: "/login",
  },
  secret: runtimeConfig.authJs.secret,
  providers: [
    // @ts-expect-error
    CredentialsProvider.default({
      name: "credentials",
      credentials: {},
      async authorize(credentials: Credentials) {
        const data = schema.safeParse(credentials);
        if (!data.success) {
          throw data.error.formErrors.fieldErrors;
        }

        const user = (
          await User.findOne({ email: data.data.email })
        )?.toObject();

        if (!user) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
          });
        }

        // If the user does not have a password, they registered with Google
        if (!user.password) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized: Please sign in with Google",
          });
        }

        const isValid = await compare(data.data.password, user.password!);

        if (!isValid) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
          });
        }

        delete (user as { password?: string }).password;

        return {
          ...user,
        };
      },
    }),

    // @ts-expect-error
    GoogleProvider.default({
      clientId: runtimeConfig.googleId,
      clientSecret: runtimeConfig.googleSecret,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        let existingUser = await User.findOne({
          email: user.email!,
        });

        token = {
          ...existingUser?.toObject(),
          ...token,
        };
      }

      console.log({ token }, "token");

      return token;
    },

    async session({ session, token, user }) {
      session.user = {
        ...session.user,
        ...token,
        ...user,
      };

      console.log({ session }, "session");

      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        //check if user is in your database
        const existingUser = (
          await User.findOne({ email: user.email! })
        )?.toObject();
        if (existingUser) {
          //if user exists and provider is google, they registered with Google
          if (existingUser.provider === "google" && existingUser.password) {
            console.log("user exists and provider is google");
            throw createError({
              statusCode: 401,
              statusMessage:
                "A user with this email already exists. Please sign in with Google.",
            });
          }
          delete (existingUser as { password?: string }).password;
          user = existingUser as AdapterUser;

          console.log({ user });
        } else {
          //if not create user
          const response = await User.create({
            email: user?.email,
            name: user?.name,
            photoURL: user?.image,
            password: "",
            provider: "google",
          });

          if (!response)
            throw createError({
              statusCode: 500,
              statusMessage: "Internal Server Error",
            });

          delete (response as { password?: string }).password;
          user = response.toObject();

          console.log({ user }, "user created");
        }
      }
      return true;
    },
  },
};

export default NuxtAuthHandler(authOptions);
// If you don't want to pass the full runtime config,
//  you can pass something like this: { public: { authJs: { baseUrl: "" } } }

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 character long"),
});

type Credentials = z.output<typeof schema>;
