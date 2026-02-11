import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export type AppRole = "SuperAdmin" | "clientAdmin" | "Designer" | "Client";

type GuardFailure = {
  ok: false;
  response: NextResponse;
};

type GuardSuccess = {
  ok: true;
  role: AppRole;
};

export async function requireRoles(
  allowedRoles: AppRole[]
): Promise<GuardFailure | GuardSuccess> {
  const session = await auth();
  const role = session?.user?.role as AppRole | undefined;

  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!role || !allowedRoles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, role };
}
