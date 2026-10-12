export interface Accommodation {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    star_rating: number | null;
    created_at: Date;
    updated_at: Date;
}
