// data/roContent.ts

export interface ROContentItem {
  id: number;
  slug: string;
  title: string;
  backgroundImage?: string; // <- new optional field
  button: {
    text: string;
    link: string;
  };
  sections: {
    heading: string;
    paragraphs: string[];
    highlightedLink: {
      url: string;
      text: string;
    };
    image: {
      src: string;
      alt: string;
    };
  }[];
}

export const roContent: ROContentItem[] = [
  {
    id: 1,
    slug: "full-home-interiors",
    title: "Full Home Interiors",
    backgroundImage: "/Riddhi Interior Design/masonry-3.jpg",
    button: {
      text: "Get a Free Consultation",
      link: "/contact-us",
    },
    sections: [
      {
        heading: "End-to-End Home Interior Solutions",
        paragraphs: [
          "Transform your entire home with Riddhi Interiors complete design and execution services.",
          "From concept to creation, we bring luxurious comfort and functionality to every corner.",
        ],
        highlightedLink: {
          url: "",
          text: "Visit Our Office at Tilak Road, Dehradun",
        },
        image: {
          src: "/Riddhi Interior Design/carousel-1.jpg",
          alt: "Full Home Interior by Riddhi",
        },
      },
      {
        heading: "Why Choose Riddhi Interiors?",
        paragraphs: [
          "We focus on creating timeless spaces that blend your personal style with modern trends.",
          "Our in-house team ensures quality, transparency, and on-time project delivery.",
        ],
        highlightedLink: {
          url: "/about-us",
          text: "Know More About Us",
        },
        image: {
          src: "/Riddhi Interior Design/carousel-1.jpg",
          alt: "Interior Design Team Discussion",
        },
      },
    ],
  },
  {
    id: 2,
    slug: "luxury-interiors",
    title: "Luxury Interiors",
    backgroundImage: "/Riddhi Interior Design/masonry-2.jpg",
    button: {
      text: "Book a Design Expert",
      link: "/contact-us",
    },
    sections: [
      {
        heading: "Redefining Luxury Living",
        paragraphs: [
          "From plush textures to bespoke furniture, our luxury interiors are tailored to perfection.",
          "We infuse elegance in every detail, making your home a reflection of sophistication.",
        ],
        highlightedLink: {
          url: "/our-projects",
          text: "View Our Luxury Projects",
        },
        image: {
          src: "/Riddhi Interior Design/carousel2.jpg",
          alt: "Luxury Living Room Design",
        },
      },
      {
        heading: "Our Signature Touch",
        paragraphs: [
          "We bring together global materials, curated designs, and exquisite craftsmanship.",
          "Every space we design narrates a unique story — your story.",
        ],
        highlightedLink: {
          url: "https://g.page/r/CR6TUrVHWmaYEAE/review",
          text: "What Our Clients Say",
        },
        image: {
          src: "/Riddhi Interior Design/carousel2.jpg",
          alt: "Luxury Bedroom Design",
        },
      },
    ],
  },
  {
    id: 3,
    slug: "modular-interiors",
    title: "Modular Interiors",
    backgroundImage: "/Riddhi Interior Design/masonry-6.jpg",
    button: {
      text: "Explore Modular Options",
      link: "/contact-us",
    },
    sections: [
      {
        heading: "Smart & Sleek Modular Designs",
        paragraphs: [
          "Riddhi Interiors delivers tailor-made modular kitchens and wardrobes for urban lifestyles.",
          "Built with precision and top-grade materials, our modular units are both stylish and functional.",
        ],
        highlightedLink: {
          url: "/our-projects#modular",
          text: "See Modular Projects",
        },
        image: {
          src: "/Riddhi Interior Design/carousel2.jpg",
          alt: "Modular Kitchen Design",
        },
      },
      {
        heading: "Why Choose Modular Interiors?",
        paragraphs: [
          "Modular designs save space, improve organization, and add contemporary charm to your home.",
          "Our solutions are custom-built to your needs with options for finishes, layouts, and accessories.",
        ],
        highlightedLink: {
          url: "/contact-us",
          text: "Schedule a Site Visit",
        },
        image: {
          src: "/Riddhi Interior Design/carousel-1.jpg",
          alt: "Modular Wardrobe Design",
        },
      },
    ],
  },
  {
    id: 4,
    slug: "renovations",
    title: "Renovations",
    backgroundImage: "/Riddhi Interior Design/full-home.jpg",
    button: {
      text: "Start Your Renovation",
      link: "/contact-us",
    },
    sections: [
      {
        heading: "Give Your Space a Fresh Makeover",
        paragraphs: [
          "Whether it's a single room or the entire home, we specialize in seamless, aesthetic renovations.",
          "Our renovation services revive old spaces with updated layouts, materials, and energy-efficient upgrades.",
        ],
        highlightedLink: {
          url: "/services/renovation",
          text: "Explore Renovation Services",
        },
        image: {
          src: "/Riddhi Interior Design/renovations.jpg",
          alt: "Living Room Renovation by Riddhi",
        },
      },
      {
        heading: "Stress-Free Renovation Process",
        paragraphs: [
          "From planning and budgeting to execution, we handle everything end-to-end.",
          "Expect timely delivery, transparent pricing, and results that exceed expectations.",
        ],
        highlightedLink: {
          url: "/testimonials",
          text: "Hear From Happy Clients",
        },
        image: {
          src: "/Riddhi Interior Design/renovations.jpg",
          alt: "Before and After Renovation",
        },
      },
    ],
  },
];
