import { revalidatePath, revalidateTag } from "next/cache";

export function revalidatePublicContent() {
  revalidateTag("public-content");
  revalidatePath("/", "layout");
}
