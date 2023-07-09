/** @format */

export const ErrorReferece = (err: string) => {
  switch (err) {
    case "P2002":
      return "Email already exists";

    case "P2025":
      return "Record to update not found.";

    default:
      return "Unknown error";
  }
};
