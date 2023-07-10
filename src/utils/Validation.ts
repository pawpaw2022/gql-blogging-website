/** @format */

import validator from "validator";

export const validateUser = (email: string, password: string, name: string) => {
  if (email && !validator.isEmail(email))
    return {
      error: {
        message: "Email is invalid",
      },
    };

  if (password && !validator.isLength(password, { min: 8 }))
    return {
      error: {
        message: "Password must be 8 characters long",
      },
    };

  if (name && !validator.isLength(name, { min: 3 }))
    return {
      error: {
        message: "Name must be 3 characters long",
      },
    };

  return null;
};

export const validatePost = (title: string, content: string) => {
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

export const validateProfile = (bio: string) => {
  if (bio && bio.trim() === "")
    return {
      error: {
        message: "Bio is required",
      },
    };

  return null;
};
