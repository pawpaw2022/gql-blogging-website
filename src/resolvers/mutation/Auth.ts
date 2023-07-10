/** @format */

import { Context } from "vm";
import { validateCredentials, validateUser } from "../../utils/Validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HASHKEY } from "../../utils/hashKey";

interface UserArgs {
  name: string;
  credentials: Credentials;
  bio: string;
  id: string; // for update
}

interface Credentials {
  email: string;
  password: string;
}

export const UserAuth = {
  // create user
  signup: async (_: any, args: UserArgs, { prisma }: Context) => {
    const { name, bio, credentials } = args;
    const { email, password } = credentials;

    const error = validateUser(email, password, name);
    if (error) return error;

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          name,
          password: hashedPassword,
          email,
        },
      });

      await prisma.profile.create({
        data: {
          bio,
          userId: user.id,
        },
      });

      // generate token
      const token = jwt.sign({ userId: user.id, email }, HASHKEY, {
        expiresIn: "1d", // expires in 1 day
      });

      return {
        token,
      };
    } catch (e) {
      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },

  // login user
  signin: async (_: any, args: UserArgs, { prisma }: Context) => {
    const { credentials } = args;
    const { email, password } = credentials;

    const error = validateCredentials(email, password);
    if (error) return error;

    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      return {
        error: {
          message: "Invalid credentials",
        },
      };

    // check if password is correct
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched)
      return {
        error: {
          message: "Invalid credentials",
        },
      };

    return {
      token: jwt.sign({ userId: user.id, email }, HASHKEY, {
        expiresIn: "1d", // expires in 1 day
      }),
    };
  },
};
