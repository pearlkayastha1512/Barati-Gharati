export interface WeddingStory {
  id: number;

  title: string;

  location: string;

  coverImage: string;

  featured: boolean;
}

export const stories: WeddingStory[] = [
  {
    id: 1,
    title: "Royal Palace Wedding",
    location: "Jaipur",
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
    featured: true,
  },
  {
    id: 2,
    title: "Luxury Reception",
    location: "Delhi",
    coverImage:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200",
    featured: true,
  },
  {
    id: 3,
    title: "Destination Wedding",
    location: "Kerala",
    coverImage:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200",
    featured: true,
  },
  {
    id: 4,
    title: "Beach Wedding",
    location: "Goa",
    coverImage:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200",
    featured: true,
  },
  {
    id: 5,
    title: "Traditional Ceremony",
    location: "Lucknow",
    coverImage:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200",
    featured: true,
  },
  {
    id: 6,
    title: "Grand Celebration",
    location: "Udaipur",
    coverImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200",
    featured: true,
  },
];