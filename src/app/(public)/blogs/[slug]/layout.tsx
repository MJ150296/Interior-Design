import type { Metadata } from "next";
import { blogs } from "@/app/data/blogs";
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
  const blog = blogs.find((item) => item.id === slug);

  if (!blog) {
    return buildPublicMetadata({
      title: "Blog Not Found",
      description: "The requested blog article does not exist.",
      path: `/blogs/${slug}`,
      noIndex: true,
    });
  }

  return buildPublicMetadata({
    title: blog.title,
    description: blog.excerpt,
    path: `/blogs/${blog.id}`,
    image: blog.image,
    keywords: [
      "interior design blog",
      "Riddhi Interiors",
      blog.category,
      blog.author,
    ],
    type: "article",
  });
}

export default function BlogSlugLayout({
  children,
}: BlogLayoutProps) {
  return children;
}
