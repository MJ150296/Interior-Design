import type { Metadata } from "next";
import { signIn } from "@/app/auth";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Sign In",
  description: "Secure sign-in for authorized users.",
  path: "/signin",
  noIndex: true,
});

export default function Page() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("credentials", formData);
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
}
