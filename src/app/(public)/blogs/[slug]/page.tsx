"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePublicContent } from "../../PublicContentProvider";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  LayoutGridIcon,
} from "lucide-react";

// Define proper types for article content blocks
// Using string type to allow flexibility with redux data
interface ContentBlock {
  type: string;
  text?: string;
  title?: string;
  url?: string;
  caption?: string;
  items?: string[];
  blockSetId?: string; // Groups blocks together as a "block set"
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

interface BlogArticle {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  author: string;
  authorBio: string;
  date: string;
  content: ArticleContent;
}

// Default article for fallback
const defaultArticle: BlogArticle = {
  id: "1",
  imageUrl: "/Riddhi Interior Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
  category: "Trends",
  title: "Top Interior Design Trends for 2025",
  description: "Discover the biggest interior design trends for 2025—from natural textures and bold color accents to smart homes and sustainable materials.",
  author: "Riddhi Sharma",
  authorBio: "Interior Design Expert",
  date: "May 15, 2025",
  content: {
    hero: {
      title: "Top Interior Design Trends for 2025",
      subtitle: "Discover the biggest interior design trends for 2025",
      imageUrl: "/Riddhi Interior Design/Blogs/top_interior_design_trends_for_the_year.jpeg"
    },
    meta: {
      readTime: "5 min read"
    },
    body: [
      {
        type: "paragraph" as const,
        text: "As we step into 2025, interior design continues to evolve with a focus on sustainability, technology, and comfort. This year promises exciting trends that blend aesthetics with functionality."
      }
    ],
    features: [
      "Sustainable materials and eco-friendly designs",
      "Smart home integration",
      "Biophilic design elements",
      "Bold color accents"
    ],
    tips: [
      "Start with a neutral base and add bold accents",
      "Incorporate natural elements like plants and wood",
      "Invest in quality furniture pieces",
      "Layer lighting for ambiance"
    ]
  }
};

const defaultArticles = [defaultArticle];

const BlogDetail: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const { blog: reduxContent } = usePublicContent();
  
  // Get articles from redux content or use defaults
  const articles: BlogArticle[] = reduxContent?.articles || defaultArticles;
  
  // Find the article by id (slug)
  const article = articles.find((a) => a.id === slug) || 
                  articles.find((a) => a.id === "1") || 
                  defaultArticle;
  
  // For related blogs - exclude current article
  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  // Get unique categories from articles
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  console.log("BlogDetail - slug:", slug, "article:", article?.title);

  // If no article found
  if (!article) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-lime-800 mb-4">Blog not found</h2>
        <Link href="/blogs" className="text-lime-600 hover:text-lime-800">
          ← Back to blogs
        </Link>
      </div>
    );
  }

  // Group blocks by blockSetId - blocks with same blockSetId form a "block set"
  const groupBlocksBySet = (blocks: ContentBlock[]) => {
    const standaloneBlocks: ContentBlock[] = [];
    const blockSets: { [key: string]: ContentBlock[] } = {};
    
    blocks.forEach((block) => {
      if (block.blockSetId) {
        if (!blockSets[block.blockSetId]) {
          blockSets[block.blockSetId] = [];
        }
        blockSets[block.blockSetId].push(block);
      } else {
        standaloneBlocks.push(block);
      }
    });
    
    return { standaloneBlocks, blockSets };
  };

  // Render a single block
  const renderSingleBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "paragraph":
        if (block.text) {
          return (
            <p key={index} className="mb-6 text-gray-700 leading-relaxed">
              {block.text}
            </p>
          );
        }
        break;
      case "heading":
        if (block.title) {
          return (
            <h3 key={index} className="text-2xl font-bold text-lime-900 mt-8 mb-4">
              {block.title}
            </h3>
          );
        }
        break;
      case "list":
        if (block.items && block.items.length > 0) {
          return (
            <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
              {block.items.map((item: string, i: number) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          );
        }
        break;
      case "image":
        if (block.url) {
          return (
            <figure key={index} className="my-8">
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden">
                <Image
                  src={block.url}
                  alt={block.caption || "Blog image"}
                  fill
                  className="object-cover"
                />
              </div>
              {block.caption && (
                <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        break;
      case "quote":
        if (block.text) {
          return (
            <blockquote key={index} className="my-8 border-l-4 border-lime-500 pl-6 py-2 bg-lime-50 rounded-r-lg">
              <p className="text-lg italic text-gray-700">&quot;{block.text}&quot;</p>
              {block.title && (
                <cite className="block text-sm text-gray-500 mt-2 not-italic">
                  — {block.title}
                </cite>
              )}
            </blockquote>
          );
        }
        break;
    }
    return null;
  };

  // Render a block set with alternating layout (image left/right)
  const renderBlockSet = (setId: string, blocks: ContentBlock[], setIndex: number) => {
    // Get the image block and text content from the set
    const imageBlock = blocks.find(b => b.type === "image");
    const paragraphBlock = blocks.find(b => b.type === "paragraph");
    const headingBlock = blocks.find(b => b.type === "heading");
    const listBlock = blocks.find(b => b.type === "list");
    const quoteBlock = blocks.find(b => b.type === "quote");

    // Alternate layout: even sets (0, 2, 4...) = image on left, odd sets (1, 3, 5...) = image on right
    const isImageLeft = setIndex % 2 === 0;

    // If there's an image, render with alternating layout
    if (imageBlock && imageBlock.url) {
      return (
        <div key={setId} className="my-12 flex flex-col md:flex-row gap-8">
          {/* Image Side - left on even sets, right on odd sets */}
          <div className={`relative h-64 md:h-80 rounded-xl overflow-hidden w-full md:w-1/2 ${isImageLeft ? 'md:order-1' : 'md:order-2'}`}>
            <Image
              src={imageBlock.url}
              alt={imageBlock.caption || "Blog image"}
              fill
              className="object-cover"
            />
            {imageBlock.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm text-center">{imageBlock.caption}</p>
              </div>
            )}
          </div>
          
          {/* Text Content Side - right on even sets, left on odd sets */}
          <div className={`flex flex-col justify-center w-full md:w-1/2 ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
            {headingBlock?.title && (
              <h3 className="text-2xl font-bold text-lime-900 mb-4">
                {headingBlock.title}
              </h3>
            )}
            {paragraphBlock?.text && (
              <p className="text-gray-700 leading-relaxed mb-4">
                {paragraphBlock.text}
              </p>
            )}
            {listBlock?.items && listBlock.items.length > 0 && (
              <ul className="list-disc pl-6 space-y-2">
                {listBlock.items.map((item: string, i: number) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            )}
            {quoteBlock?.text && (
              <blockquote className="border-l-4 border-lime-500 pl-4 py-2 bg-lime-50 rounded-r-lg mt-4">
                <p className="italic text-gray-700">&quot;{quoteBlock.text}&quot;</p>
              </blockquote>
            )}
          </div>
        </div>
      );
    }

    // If no image, render blocks linearly
    return (
      <div key={setId} className="my-6">
        {blocks.map((block, idx) => renderSingleBlock(block, idx))}
      </div>
    );
  };

  // Build body content for display
  const renderBodyContent = () => {
    const body = article.content?.body || [];
    
    if (body.length === 0) {
      // Fallback: render description as paragraph
      return (
        <p className="mb-6 text-gray-700 leading-relaxed">
          {article.description || "No content available."}
        </p>
      );
    }

    const { standaloneBlocks, blockSets } = groupBlocksBySet(body);
    const setIds = Object.keys(blockSets);

    return (
      <>
        {/* Render standalone blocks */}
        {standaloneBlocks.map((block, index) => renderSingleBlock(block, index))}
        
        {/* Render block sets with alternating layout */}
        {setIds.map((setId, setIndex) => renderBlockSet(setId, blockSets[setId], setIndex))}
      </>
    );
  };

  return (
    <div className="relative max-w-7xl mx-auto py-2 px-4">
      <div className="absolute top-7 left-10 z-20">
        <Link
          href="/blogs"
          className="text-lime-700 hover:text-lime-900 font-medium flex items-center group"
        >
          <svg
            className="w-8 h-8 bg-lime-50 p-2 rounded-full mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
      </div>

      {/* Featured Image with Overlay */}
      <div className="relative w-full h-125 rounded-xl overflow-hidden shadow-xl mb-12">
        <Image
          src={article.content?.hero?.imageUrl || article.imageUrl}
          alt={article.content?.hero?.title || article.title}
          fill
          className="object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-lime-900/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.h1
            className="text-3xl md:text-5xl font-serif font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {article.content?.hero?.title || article.title}
          </motion.h1>
          {(article.content?.hero?.subtitle || article.description) && (
            <motion.p
              className="text-xl text-lime-100 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {article.content?.hero?.subtitle || article.description}
            </motion.p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg rounded-xl overflow-hidden border border-lime-100">
            <CardContent className="p-6 md:p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 mb-8 pb-4 border-b border-lime-100">
                <div className="flex items-center text-lime-700">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{article.author}</span>
                </div>
                <div className="flex items-center text-lime-700">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{article.date}</span>
                </div>
                <div className="flex items-center text-lime-700">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{article.content?.meta?.readTime || "5 min read"}</span>
                </div>
                <div className="flex items-center text-lime-700">
                  <LayoutGridIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{article.category}</span>
                </div>
              </div>

              {/* Blog Content */}
              <motion.div
                className="prose prose-lg max-w-none text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                {renderBodyContent()}
              </motion.div>

              {/* Key Features */}
              {article.content?.features && article.content.features.length > 0 && (
                <motion.div
                  className="mt-12 bg-lime-50 rounded-xl p-6 border border-lime-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-lime-900 mb-4">
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {article.content.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-lime-600 mt-0.5 mr-2 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Design Tips */}
              {article.content?.tips && article.content.tips.length > 0 && (
                <motion.div
                  className="mt-8 bg-linear-to-r from-lime-50 to-lime-100 rounded-xl p-6 border border-lime-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-lime-900 mb-4">
                    Design Tips from Our Experts
                  </h3>
                  <ul className="space-y-3">
                    {article.content.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-lime-500 rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">
                          <span className="text-white text-sm font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Author Info */}
          <Card className="shadow-lg rounded-xl overflow-hidden border border-lime-100 mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-lime-900 mb-4">
                About the Author
              </h3>
              <div className="flex items-start">
                <div className="w-16 h-16 rounded-full bg-lime-200 flex items-center justify-center border-2 border-lime-500">
                  <span className="text-lime-700 font-bold text-2xl">
                    {article.author?.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">{article.author}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {article.authorBio || "Interior Design Specialist at Riddhi Interiors with over 10 years of experience creating beautiful living spaces."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="shadow-lg rounded-xl overflow-hidden border border-lime-100 mb-8">
            <CardHeader className="bg-lime-50 p-4">
              <CardTitle className="text-lg font-bold text-lime-900">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {categories.map((category: string, index: number) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="flex items-center justify-between py-2 text-gray-700 hover:text-lime-700 transition-colors"
                    >
                      <span>{category}</span>
                      <span className="bg-lime-100 text-lime-800 text-xs font-medium px-2 py-1 rounded-full">
                        {articles.filter((a) => a.category === category).length}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Related Blogs */}
          <Card className="shadow-lg rounded-xl overflow-hidden border border-lime-100">
            <CardHeader className="bg-lime-50 p-4">
              <CardTitle className="text-lg font-bold text-lime-900">
                You May Also Like
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map((relatedBlog) => (
                    <Link
                      key={relatedBlog.id}
                      href={`/blogs/${relatedBlog.id}`}
                      className="group block"
                    >
                      <div className="flex items-start">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={relatedBlog.imageUrl}
                            alt={relatedBlog.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-gray-800 group-hover:text-lime-700 transition-colors">
                            {relatedBlog.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            <span>{relatedBlog.date}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No related articles found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Newsletter CTA */}
      <motion.div
        className="mt-16 bg-linear-to-r from-lime-700 to-lime-900 rounded-2xl p-8 text-white text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <h3 className="text-2xl font-serif font-bold mb-4">
          Stay Inspired with Our Design Journal
        </h3>
        <p className="text-lime-100 max-w-2xl mx-auto mb-6">
          Subscribe to our newsletter for exclusive design tips, trend reports,
          and special offers delivered to your inbox.
        </p>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email address"
            className="grow px-5 py-3 rounded-full bg-white/20 text-white placeholder-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <button className="bg-lime-500 hover:bg-lime-400 text-lime-900 font-bold py-3 px-6 rounded-full transition-colors shadow-lg">
            Subscribe
          </button>
        </div>
        <p className="text-lime-200 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </motion.div>
    </div>
  );
};

export default BlogDetail;
