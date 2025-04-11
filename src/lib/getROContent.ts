// app/lib/getROContent.ts
import { roContent, ROContentItem } from "@/app/data/roContent";

export async function getROContentBySlug(
  slug: string
): Promise<ROContentItem | undefined> {
  // Simulate an async call here
  return roContent.find((item) => item.slug === slug);
}
