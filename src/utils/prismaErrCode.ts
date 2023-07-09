/** @format */

export const ErrorReferece = (err: string) => {
  switch (err) {
    case "P2002":
      return "Email already exists";

    default:
      return "Unknown error";
  }
};
