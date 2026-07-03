export interface CustomerProfile {
  customerId: string;

  gender: string;

  address: string;
  city: string;
  state: string;
  country: string;

  partnerName: string;
  partnerEmail: string;
  partnerPhone: string;
  partnerOccupation: string;

  weddingDate: string;
  weddingVenue: string;
  guestCount: number;
  weddingTheme: string;
}