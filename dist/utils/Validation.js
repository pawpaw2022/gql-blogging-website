/** @format */
import validator from "validator";
export const validateUser = (email, password, firstName) => {
    if (!validator.isLength(firstName, { min: 3 }))
        return {
            error: {
                message: "Name must be 3 characters long",
            },
        };
    return validateCredentials(email, password);
};
export const validateCredentials = (email, password) => {
    if (!validator.isEmail(email))
        return {
            error: {
                message: "Email is invalid",
            },
        };
    if (!validator.isLength(password, { min: 8 }))
        return {
            error: {
                message: "Password must be 8 characters long",
            },
        };
    return null;
};
export const validatePost = (title, content) => {
    if (title && title.trim() === "")
        return {
            error: {
                message: "Title is required",
            },
        };
    if (content && content.trim() === "")
        return {
            error: {
                message: "Content is required",
            },
        };
    return null;
};
