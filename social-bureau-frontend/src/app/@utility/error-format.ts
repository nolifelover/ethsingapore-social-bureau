import { HttpErrorResponse } from "@angular/common/http";
import { isArray } from "lodash";

export const errorFormat = (error: unknown) => {
  if (error instanceof TypeError) {
    return {
      code: undefined,
      message: error.message,
      stack: error.stack,
    };
  } else if (error instanceof HttpErrorResponse) {
    const message = isArray(error?.error?.message)
      ? error?.error?.message.join(" ")
      : "";

    return {
      code: error.status,
      message: message || error?.message || "",
      stack: undefined,
    };
  } else if (typeof error === "string") {
    return {
      code: undefined,
      message: error,
      stack: undefined,
    };
  } else {
    return {
      code: undefined,
      message: "unknown error instance",
      stack: undefined,
    };
  }
};
