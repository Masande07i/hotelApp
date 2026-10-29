export interface Accommodation {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    star_rating: number | null;
    created_at: Date;
    updated_at: Date;
}