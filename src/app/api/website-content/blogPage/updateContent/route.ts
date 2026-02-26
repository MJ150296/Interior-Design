import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import BlogPageModel from "@/app/model/website-content/BlogPage.model";
import { requireRoles } from "@/app/api/_utils/requireRoles";
import { revalidatePublicContent } from "@/app/lib/revalidatePublicContent";

// Define interfaces for the content structure
interface ContentBlock {
  type: string;
  text?: string;
  title?: string;
  url?: string;
  caption?: string;
  items?: string[];
}

interface ArticleContent {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  meta: {
    readTime: string;
  };
  body: ContentBlock[];
  features: string[];
  tips: string[];
}

interface Article {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  author: string;
  authorBio?: string;
  date: string;
  content?: ArticleContent;
}

interface Featured {
  title: string;
  postIds: string[];
}

interface Hero {
  backgroundImageUrl: string;
  preTitle: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}

interface Newsletter {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  privacyText: string;
}


// Helper to ensure articles have required fields
function sanitizeArticles(articles: Article[] = []): Article[] {
  return articles.map((article, index) => {
    // Validate required fields for articles
    if (!article.imageUrl) {
      throw new Error(`Article at index ${index}: Image is required`);
    }
    if (!article.title) {
      throw new Error(`Article at index ${index}: Title is required`);
    }
    if (!article.author) {
      throw new Error(`Article at index ${index}: Author is required`);
    }
    
    return {
      id: article.id || `article-${index}-${Date.now()}`,
      imageUrl: article.imageUrl,
      category: article.category || "Uncategorized",
      title: article.title,
      description: article.description || "",
      author: article.author,
      authorBio: article.authorBio || "", // Optional
      date: article.date || "",
      content: {
        hero: {
          title: article.content?.hero?.title || article.title || "",
          subtitle: article.content?.hero?.subtitle || "",
          imageUrl: article.content?.hero?.imageUrl || article.imageUrl || "",
        },
        meta: {
          readTime: article.content?.meta?.readTime || "5 min read",
        },
        body: article.content?.body || [],
        features: article.content?.features || [],
        tips: article.content?.tips || [],
      },
    };
  });
}

// Helper to ensure featured post has required fields
function sanitizeFeaturedPost(featured: Featured): Featured {
  // Now using postIds array - no validation needed for required fields
  return {
    title: featured?.title || "Featured Inspiration",
    postIds: Array.isArray(featured?.postIds) ? featured.postIds : [],
  };
}

// Helper to ensure hero has required fields
function sanitizeHero(hero: Hero): Hero {
  return {
    backgroundImageUrl: hero?.backgroundImageUrl || "",
    preTitle: hero?.preTitle || "",
    title: hero?.title || "Blog",
    subtitle: hero?.subtitle || "",
    searchPlaceholder: hero?.searchPlaceholder || "Search...",
  };
}

// Helper to ensure newsletter has required fields
function sanitizeNewsletter(newsletter: Newsletter): Newsletter {
  return {
    title: newsletter?.title || "Subscribe",
    description: newsletter?.description || "",
    placeholder: newsletter?.placeholder || "Your email",
    buttonText: newsletter?.buttonText || "Subscribe",
    privacyText: newsletter?.privacyText || "Privacy policy",
  };
}

export async function PUT(request: Request) {
  const guard = await requireRoles(["SuperAdmin", "clientAdmin"]);
  if (!guard.ok) {
    return guard.response;
  }

  try {
    await dbConnect();

    const content = await request.json();

    // Sanitize and prepare data to match MongoDB schema requirements
    const sanitizedContent = {
      hero: sanitizeHero(content.hero),
      featured: sanitizeFeaturedPost(content.featured),
      categories: content.categories || ["All"],
      articles: sanitizeArticles(content.articles),
      newsletter: sanitizeNewsletter(content.newsletter),
    };

    console.log("Saving sanitized content:", JSON.stringify(sanitizedContent, null, 2));

    // Update or create the blog page content
    // Using runValidators: false since we do our own validation in sanitize functions
    const updatedContent = await BlogPageModel.findOneAndUpdate(
      {},
      sanitizedContent,
      { new: true, upsert: true, runValidators: false }
    );

    revalidatePublicContent();
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Error updating blog page content:", error);
    return NextResponse.json(
      { error: "Failed to update blog page content" },
      { status: 500 }
    );
  }
}
