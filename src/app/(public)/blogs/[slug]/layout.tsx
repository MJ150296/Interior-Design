import type { Metadata } from "next";
import { getPublicContentBundle } from "@/app/lib/publicContent.server";
import { buildPublicMetadata } from "@/lib/seo";

type BlogLayoutProps = {
  children: React.ReactNode;
};

type BlogMetadataProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogMetadataProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch blog content from database
  const content = await getPublicContentBundle();
  const blogContent = content.blog;
  
  // Find article by id (slug)
  const article = blogContent?.articles?.find((item) => item.id === slug);

  if (!article) {
    return buildPublicMetadata({
      title: "Blog Not Found",
      description: "The requested blog article does not exist.",
      path: `/blogs/${slug}`,
      noIndex: true,
    });
  }

  return buildPublicMetadata({
    title: article.title,
    description: article.description,
    path: `/blogs/${article.id}`,
    image: article.imageUrl,
    keywords: [
      "interior design blog",
      "Riddhi Interiors",
      article.category,
      article.author,
    ],
    type: "article",
  });
}

export default function BlogSlugLayout({
  children,
}: BlogLayoutProps) {
  return children;
}
