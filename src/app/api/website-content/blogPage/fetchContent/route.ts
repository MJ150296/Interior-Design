import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import BlogPageModel from "@/app/model/website-content/BlogPage.model";

// Default values based on your Redux slice structure
const defaultBlogContent = {
  hero: {
    backgroundImageUrl: "/default-blog-hero.jpg",
    preTitle: "Our Blog",
    title: "Latest News & Articles",
    subtitle: "Discover the latest interior design trends and tips",
    searchPlaceholder: "Search articles...",
  },
  featured: {
    title: "Featured Post",
    post: {
      id: 1,
      imageUrl: "/default-featured-post.jpg",
      category: "Interior Design",
      title: "Welcome to Our Blog",
      description: "Discover the latest interior design trends and tips from our experts",
      author: "Admin",
      date: new Date().toISOString().split("T")[0],
    },
  },
  categories: ["All", "Interior Design", "Home Decor", "Furniture", "Trends"],
  articles: [
    {
      id: 1,
      imageUrl: "/default-article-1.jpg",
      category: "Interior Design",
      title: "10 Tips for Small Space Living",
      description: "Make the most of your small space with these expert tips",
      author: "Jane Smith",
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: 2,
      imageUrl: "/default-article-2.jpg",
      category: "Home Decor",
      title: "Choosing the Right Color Palette",
      description: "How to select colors that transform your space",
      author: "John Doe",
      date: new Date().toISOString().split("T")[0],
    },
  ],
  newsletter: {
    title: "Subscribe to Our Newsletter",
    description: "Get the latest interior design tips and trends delivered to your inbox",
    placeholder: "Enter your email address",
    buttonText: "Subscribe",
    privacyText: "We respect your privacy and will never share your information",
  },
};

export async function GET() {
  try {
    await dbConnect();

    // Try to find existing blog page content
    let blogContent = await BlogPageModel.findOne();

    // If no content exists, return default content
    if (!blogContent) {
      return NextResponse.json(defaultBlogContent);
    }

    // Transform the data to match the expected structure
    const transformedContent = {
      hero: {
        backgroundImageUrl:
          blogContent.hero?.backgroundImageUrl ||
          defaultBlogContent.hero.backgroundImageUrl,
        preTitle:
          blogContent.hero?.preTitle || defaultBlogContent.hero.preTitle,
        title: blogContent.hero?.title || defaultBlogContent.hero.title,
        subtitle:
          blogContent.hero?.subtitle || defaultBlogContent.hero.subtitle,
        searchPlaceholder:
          blogContent.hero?.searchPlaceholder ||
          defaultBlogContent.hero.searchPlaceholder,
      },
      featured: {
        title:
          blogContent.featured?.title || defaultBlogContent.featured.title,
        post: {
          id: blogContent.featured?.post?.id || defaultBlogContent.featured.post.id,
          imageUrl:
            blogContent.featured?.post?.imageUrl ||
            defaultBlogContent.featured.post.imageUrl,
          category:
            blogContent.featured?.post?.category ||
            defaultBlogContent.featured.post.category,
          title:
            blogContent.featured?.post?.title ||
            defaultBlogContent.featured.post.title,
          description:
            blogContent.featured?.post?.description ||
            defaultBlogContent.featured.post.description,
          author:
            blogContent.featured?.post?.author ||
            defaultBlogContent.featured.post.author,
          date:
            blogContent.featured?.post?.date ||
            defaultBlogContent.featured.post.date,
        },
      },
      categories: blogContent.categories || defaultBlogContent.categories,
      articles: blogContent.articles || defaultBlogContent.articles,
      newsletter: {
        title:
          blogContent.newsletter?.title || defaultBlogContent.newsletter.title,
        description:
          blogContent.newsletter?.description ||
          defaultBlogContent.newsletter.description,
        placeholder:
          blogContent.newsletter?.placeholder ||
          defaultBlogContent.newsletter.placeholder,
        buttonText:
          blogContent.newsletter?.buttonText ||
          defaultBlogContent.newsletter.buttonText,
        privacyText:
          blogContent.newsletter?.privacyText ||
          defaultBlogContent.newsletter.privacyText,
      },
    };

    return NextResponse.json(transformedContent);
  } catch (error) {
    console.error("Error fetching blog page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog page content" },
      { status: 500 }
    );
  }
}