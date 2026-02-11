export type Project = {
  id: number;
  title: string;
  location: string;
  category: string;
  imageUrl: string;
  hoverTitle: string;
  hoverDescription: string;
  exploreLink: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type HeroContent = {
  backgroundImageUrl: string;
  title: string;
  subtitle: string;
  preTitle: string;
};

export type QuoteContent = {
  text: string;
  author: string;
};

export type CtaContent = {
  title: string;
  description: string;
};

export type PortfolioContent = {
  hero: HeroContent;
  quotes: QuoteContent[];
  residentialProjects: Project[];
  commercialProjects: Project[];
  stats: Stat[];
  cta: CtaContent;
};
