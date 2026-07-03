export interface GalleryItem {
  id: number;

  image: string;

  title: string;

  location: string;

  guests: number;

  vendors: number;

  celebrationDays: number;

  budget: string;

  story: string[];

  highlights: {
    venue: string;
    photographer: string;
    decor: string;
    budget: string;
  };
}

export const gallery: GalleryItem[] = [
  {
    id: 1,
    image: "/gallery/gallery1.jpg",
    title: "Royal Palace Wedding",
    location: "Jaipur",

    guests: 250,
    vendors: 12,
    celebrationDays: 3,
    budget: "₹25 Lakhs",

    story: [
      "Royal Palace Jaipur hosted a breathtaking royal wedding filled with timeless traditions and elegant celebrations.",

      "The couple exchanged vows amidst luxurious décor, live music and unforgettable moments with family and friends.",

      "Every detail, from catering to photography, was carefully planned to create a magical wedding experience."
    ],

    highlights: {
      venue: "Royal Palace Jaipur",
      photographer: "Bliss Photography",
      decor: "Dream Decor Studio",
      budget: "₹25 Lakhs",
    },
  },

  {
    id: 2,
    image: "/gallery/gallery2.jpg",
    title: "Beach Wedding",
    location: "Goa",

    guests: 180,
    vendors: 10,
    celebrationDays: 2,
    budget: "₹18 Lakhs",

    story: [
      "A beautiful beachside wedding with sunset vows overlooking the Arabian Sea.",

      "Minimal décor, tropical flowers and live music created a relaxed yet luxurious atmosphere.",

      "Guests enjoyed unforgettable celebrations by the beach throughout the weekend."
    ],

    highlights: {
      venue: "Goa Beach Resort",
      photographer: "Ocean Lens Studio",
      decor: "Coastal Decor",
      budget: "₹18 Lakhs",
    },
  },

  {
    id: 3,
    image: "/gallery/gallery3.jpg",
    title: "Luxury Reception",
    location: "Delhi",

    guests: 400,
    vendors: 18,
    celebrationDays: 1,
    budget: "₹35 Lakhs",

    story: [
      "A grand luxury reception featuring premium catering and spectacular stage décor.",

      "The evening included celebrity performances and elegant floral arrangements.",

      "Guests enjoyed an unforgettable fine-dining experience and live entertainment."
    ],

    highlights: {
      venue: "The Grand Palace",
      photographer: "Elite Moments",
      decor: "Luxury Events",
      budget: "₹35 Lakhs",
    },
  },

  {
    id: 4,
    image: "/gallery/gallery4.jpg",
    title: "Floral Mandap",
    location: "Udaipur",

    guests: 220,
    vendors: 14,
    celebrationDays: 2,
    budget: "₹22 Lakhs",

    story: [
      "An elegant lakeside wedding featuring a handcrafted floral mandap.",

      "Fresh flowers and royal Rajasthani architecture created a dreamy atmosphere.",

      "The celebration blended traditional rituals with modern elegance."
    ],

    highlights: {
      venue: "Lake Palace",
      photographer: "Wedding Frames",
      decor: "Bloom Decor",
      budget: "₹22 Lakhs",
    },
  },

  {
    id: 5,
    image: "/gallery/gallery5.jpg",
    title: "Destination Wedding",
    location: "Kerala",

    guests: 160,
    vendors: 11,
    celebrationDays: 3,
    budget: "₹28 Lakhs",

    story: [
      "A serene destination wedding surrounded by Kerala's lush greenery and backwaters.",

      "Traditional South Indian rituals blended beautifully with luxury hospitality.",

      "Guests experienced a perfect mix of culture, nature and celebration."
    ],

    highlights: {
      venue: "Backwater Resort",
      photographer: "Lens Craft",
      decor: "Green Leaf Decor",
      budget: "₹28 Lakhs",
    },
  },

  {
    id: 6,
    image: "/gallery/gallery6.jpg",
    title: "Golden Ceremony",
    location: "Mumbai",

    guests: 300,
    vendors: 16,
    celebrationDays: 2,
    budget: "₹30 Lakhs",

    story: [
      "A glamorous Mumbai celebration featuring golden décor and luxury hospitality.",

      "The ceremony showcased elegant lighting, premium entertainment and designer styling.",

      "Friends and family celebrated an unforgettable evening filled with joy and music."
    ],

    highlights: {
      venue: "Golden Banquets",
      photographer: "Pixel Weddings",
      decor: "Golden Themes",
      budget: "₹30 Lakhs",
    },
  },
];