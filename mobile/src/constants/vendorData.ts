export type Vendor = {
  id: string;
  backendId?: string;
  userId?: string;
  name: string;
  category: string;
  rating: string;
  reviews: string;
  location: string;
  price: string;
  image: string;
  featured?: boolean;
   priceValue: number;
  city?: string;
  description?: string;
  images?: string[];
  packages?: { id: string | number; name: string; price: number }[];
};

export const CATEGORIES = [
  "Venue",
  "Photographer",
  "Videographer",
  "Decorator",
  "Makeup Artist",
  "Mehendi Artist",
  "Caterer",
  "Cake Designer",
  "DJ",
  "Live Band",
  "Entertainment",
  "Wedding Planner",
  "Transportation",
  "Accommodation",
  "Invitation Designer",
  "Bridal Wear",
  "Groom Wear",
  "Jewellery",
  "Florist",
  "Pandit / Priest",
  "Event Planner",
  "Birthday Planner",
  "Kids Party Planner",
  "Balloon Decorator",
  "Theme Decorator",
  "Kids Entertainer",
  "Magician",
  "Anchor / Emcee",
  "Choreographer",
  "Party Supplies",
  "Return Gifts",
  "Gift Hampers",
  "Sound and Lighting",
  "Photo Booth",
  "Event Security",
];

// TODO: replace with a real API call — getCities() or derive from getAllVendors()
export const CITIES = [ "All Cities",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Jaipur",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Chandigarh",
  "Lucknow",
  "Goa",];

// TODO: remove once getFeaturedVendors() / getAllVendors() is wired up
export const DUMMY_VENDORS: Vendor[] = [
  {
    id: "1",
    name: "Royal Palace Jaipur",
    category: "Venue",
    rating: "4.9",
    reviews: "250",
    location: "Jaipur",
    price: "₹2,50,000",
    priceValue: 250000,
    image: "https://picsum.photos/400/300?1",
  },
  {
    id: "2",
    name: "Imperial Palace Delhi",
    category: "Venue",
    rating: "4.8",
    reviews: "210",
    location: "Delhi",
    price: "₹75,000",
    priceValue: 75000,
    image: "https://picsum.photos/400/300?2",
  },
  {
    id: "3",
    name: "Bliss Photography",
    category: "Photography",
    rating: "4.8",
    reviews: "180",
    location: "Delhi",
    price: "₹75,000",
    priceValue: 75000,
    image: "https://picsum.photos/400/300?3",
    featured: true,
  },
  {
    id: "4",
    name: "Dream Decor Studio",
    category: "Decorator",
    rating: "4.7",
    reviews: "145",
    location: "Mumbai",
    price: "₹1,20,000",
    priceValue: 180000,
    image: "https://picsum.photos/400/300?4",
  },
  {
    id: "5",
    name: "Flavors Catering",
    category: "Caterer",
    rating: "4.9",
    reviews: "320",
    location: "Bengaluru",
    price: "₹1,80,000",
    priceValue: 40000,
    image: "https://picsum.photos/400/300?5",
    featured: true,
  },
  {
    id: "6",
    name: "Melody Beats",
    category: "DJ",
    rating: "4.6",
    reviews: "130",
    location: "Pune",
    price: "₹40,000",
    priceValue: 50000,
    image: "https://picsum.photos/400/300?6",
  },
];
