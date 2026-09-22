import { NextResponse } from "next/server";

export function validationError(error: string) {
  return NextResponse.json(
    { success: false, code: "VALIDATION_ERROR", error },
    { status: 400 },
  );
}

export function conflictError(code: string, error: string) {
  return NextResponse.json(
    { success: false, code, error },
    { status: 409 },
  );
}

export function logInternalError(context: string, error: unknown) {
  const errorType = error instanceof Error ? error.name : typeof error;
  console.error(`[api] ${context}`, { errorType });
}

export function internalServerError(context: string, error: unknown) {
  logInternalError(context, error);
  return NextResponse.json(
    {
      success: false,
      code: "INTERNAL_ERROR",
      error: "Terjadi kesalahan pada server",
    },
    { status: 500 },
  );
}
