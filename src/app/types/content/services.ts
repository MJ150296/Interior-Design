// Plain data version of a service (without Mongoose Document methods)
export interface ServiceData {
  slug: string;
  title: string;
  backgroundImage?: string;
  button: { text: string; link: string };
  sections: Array<{
    heading: string;
    paragraphs: string[];
    highlightedLink: { url: string; text: string };
    image: { src: string; alt: string };
  }>;
  createdAt?: Date; // optional, as they may come from the server
  updatedAt?: Date;
}

export interface ServiceContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
  };
  services: ServiceData[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}
