export interface Station {
  type: string;
  id: string;
  name: string;
  location?: {
    type: string;
    latitude: number;
    longitude: number;
  };
  products?: Record<string, boolean>;
}

export interface Line {
  type: string;
  id?: string;
  name?: string;
  mode?: string;
  product?: string;
  operator?: { name: string };
}

export interface Stopover {
  stop: Station;
  arrival?: string;
  plannedArrival?: string;
  departure?: string;
  plannedDeparture?: string;
}

export interface Leg {
  tripId?: string;
  direction?: string;
  line?: Line;
  departure?: string;
  plannedDeparture?: string;
  departureDelay?: number;
  departurePlatform?: string;
  plannedDeparturePlatform?: string;
  arrival?: string;
  plannedArrival?: string;
  arrivalDelay?: number;
  arrivalPlatform?: string;
  plannedArrivalPlatform?: string;
  origin: Station;
  destination: Station;
  stopovers?: Stopover[];
  distance?: number;
  walking?: boolean;
  loadFactor?: 'low' | 'low-to-medium' | 'medium' | 'high' | 'very-high' | string;
}

export interface Ticket {
  name: string;
  priceData?: { amount: number; currency: string };
}

export interface Journey {
  type: string;
  legs: Leg[];
  refreshToken?: string;
  tickets?: Ticket[];
  price?: { amount: number; currency: string };
}

export interface JourneysResponse {
  journeys?: Journey[];
  earlierRef?: string;
  laterRef?: string;
}

export interface LocationsResponse {
  locations?: Station[];
}

export type DogMode = 'none' | 'small' | 'large';

export interface SearchParams {
  from: Station | null;
  to: Station | null;
  date: string;
  time: string;
  dogMode: DogMode;
  maxChanges?: number;       
  minTransferTime?: number; 
}

export interface PriceEstimate {
  basePrice: number;
  dogPrice: number;
  totalPrice: number;
  currency: string;
  breakdown: string;
}
