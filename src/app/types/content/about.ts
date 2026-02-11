export type StatItem = {
  value: string;
  label: string;
};

export type CoreValueItem = {
  title: string;
  description: string;
  icon: string;
};

export type TeamMember = {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  tags: string[];
};

export type SocialLink = {
  platform: string;
  imageURL: string;
  url: string;
};

export type HeroSection = {
  title: string;
  subtitle: string;
  upperTitle: string;
  backgroundImageUrl: string;
};

export type StorySection = {
  title: string;
  subtitle: string;
  content: string;
  content2: string;
  quote: string;
  imageUrl: string;
  cities: string;
};

export type ConnectSection = {
  socialLinks: SocialLink[];
  address: string;
  hours: string;
  phone: string;
};

export type AboutContent = {
  hero: HeroSection;
  stats: StatItem[];
  story: StorySection;
  coreValues: CoreValueItem[];
  teamMembers: TeamMember[];
  connect: ConnectSection;
};
