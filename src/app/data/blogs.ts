// /data/blogs.ts

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  // Full blog details:
  content: string;
  subheading?: string;
  additionalImages?: string[];
}

export const blogs: Blog[] = [
  {
    id: "how-to-choose-best-ro-system",
    title: "How to Choose the Best RO System for Your Home",
    excerpt:
      "Learn how to pick the right RO water purifier based on your family size, budget, and local water quality in this quick guide.",
    image: "/RO/ro1.png",
    subheading: "Your Comprehensive Guide",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta, arcu at facilisis condimentum, lacus libero faucibus leo, at porttitor turpis ante sit amet ipsum. In hac habitasse platea dictumst. Vivamus vel malesuada odio. [More content here...]",
    additionalImages: ["/blogs/ro-guide-1.jpg", "/blogs/ro-guide-2.jpg"],
  },
  {
    id: "why-regular-ro-maintenance",
    title: "Why Regular RO Maintenance is a Must",
    excerpt:
      "Neglecting RO maintenance can harm your health and cost more in the long run. Here's why an AMC plan is worth it.",
    image: "/RO/ro1.png",
    subheading: "Keep Your Water Purifier at Peak Performance",
    content:
      "Curabitur semper, nulla at congue tincidunt, nisi sapien dictum nisl, id condimentum arcu lectus at quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et nisi ipsum. [More content here...]",
    additionalImages: ["/blogs/ro-maintenance-1.jpg"],
  },
  {
    id: "top-5-ro-systems-noida-extension-2024",
    title: "Top 5 RO Systems in Noida Extension (2024)",
    excerpt:
      "We've compared the best RO purifiers in Noida Extension based on performance, service quality, and customer reviews.",
    image: "/RO/ro1.png",
    subheading: "A Comprehensive Comparison",
    content:
      "Fusce sed elit nec purus elementum fringilla. Integer finibus, massa ut cursus venenatis, nisl elit porta massa, sit amet molestie sem enim sed urna. [More content here...]",
    additionalImages: ["/blogs/top-ro-1.jpg", "/blogs/top-ro-2.jpg"],
  },
  {
    id: "signs-your-ro-filter-needs-replacement",
    title: "Signs Your RO Filter Needs Replacement",
    excerpt:
      "Is your water tasting odd or flow slowing down? These could be signs your RO filter needs urgent attention.",
    image: "/RO/ro1.png",
    subheading: "Time for a Filter Change",
    content:
      "Suspendisse potenti. Aliquam erat volutpat. Ut nec mauris euismod, placerat ligula a, cursus sem. Integer vel consequat magna. [More content here...]",
    additionalImages: ["/blogs/filter-replacement-1.jpg"],
  },
  {
    id: "how-safe-is-your-drinking-water",
    title: "How Safe is Your Drinking Water?",
    excerpt:
      "TDS, bacteria, and heavy metals can lurk in tap water. Know the threats and how RO systems protect you.",
    image: "/RO/ro1.png",
    subheading: "Understanding Water Quality",
    content:
      "Nullam aliquam, tortor at convallis faucibus, neque urna volutpat ipsum, vitae tincidunt nunc quam et nulla. In tincidunt, libero nec fermentum pharetra, mi nisi porta nisl, a euismod purus eros in mauris. [More content here...]",
    additionalImages: [
      "/blogs/water-safety-1.jpg",
      "/blogs/water-safety-2.jpg",
    ],
  },
];
