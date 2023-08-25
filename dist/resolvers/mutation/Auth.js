/** @format */
import { validateCredentials, validateUser } from "../../utils/Validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const UserAuth = {
    // create user
    signup: async (_, args, { prisma }) => {
        const { firstName, lastName, bio, credentials } = args;
        const { email, password } = credentials;
        const error = validateUser(email, password, firstName);
        if (error)
            return error;
        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // capitalize first letter of first name
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        // capitalize first letter of last name
        const capitalizedLastName = lastName &&
            lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
        try {
            const user = await prisma.user.create({
                data: {
                    firstName: capitalizedFirstName,
                    lastName: capitalizedLastName,
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
            const token = jwt.sign({ userId: user.id, email }, process.env.HASHKEY, {
                expiresIn: "1d", // expires in 1 day
            });
            return {
                token,
            };
        }
        catch (e) {
            if (e.code === "P2002") {
                return {
                    error: {
                        message: "Email has already been registered.",
                    },
                };
            }
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
    // login user
    signin: async (_, args, { prisma }) => {
        const { credentials } = args;
        const { email, password } = credentials;
        const error = validateCredentials(email, password);
        if (error)
            return error;
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
            token: jwt.sign({ userId: user.id, email }, process.env.HASHKEY, {
                expiresIn: "1d", // expires in 1 day
            }),
        };
    },
};
