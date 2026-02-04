import axios from 'axios';

export interface RoomOption {
    type: string;
    prices: {
        ota: string;
        totalPrice: number;
        currency: string;
        deepLink: string;
    }[];
}

export interface NormalizedHotelPrice {
    ota: string;
    basePrice: number;
    tax: number;
    totalPrice: number;
    currency: string;
    deepLink: string;
    roomType: string;
}

export interface NormalizedHotel {
    externalId: string;
    name: string;
    location: string;
    starRating: number;
    description: string;
    imageUrl: string;
    amenities: string[];
    prices: NormalizedHotelPrice[];
    roomOptions: RoomOption[]; // New field for the detailed table
}

export class HotelService {
    private static RAPID_API_KEY = process.env.RAPID_API_KEY || '';
    private static BOOKING_HOST = 'booking-com15.p.rapidapi.com';

    static async fetchHotelsFromOTAs(location: string): Promise<NormalizedHotel[]> {
        try {
            if (this.RAPID_API_KEY) {
                const bookingData = await this.fetchBookingHotels(location);
                if (bookingData.length > 0) return bookingData;
            }
            return this.getStayraSimulatedData(location);
        } catch (error) {
            return this.getStayraSimulatedData(location);
        }
    }

    private static async fetchBookingHotels(location: string): Promise<NormalizedHotel[]> {
        // Note: In a real production scenario, we would map specific room types from the API.
        // For this implementation, we use the booking data and extrapolate the "Stayra Comparison" logic.
        return []; // Placeholder for actual API logic if key is present
    }

    /**
     * High-Fidelity Simulator for Stayra UX
     * Generates multiple room types and specific amenities for testing the comparison table.
     */
    private static getStayraSimulatedData(location: string): NormalizedHotel[] {
        const propertyTypes = [
            {
                name: 'The Grand Palace',
                img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                amenities: ['Wi-Fi', 'Infinity Pool', 'Spa', 'Breakfast']
            },
            {
                name: 'Ocean Residency',
                img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
                amenities: ['Wi-Fi', 'Private Beach', 'Fitness Center']
            },
            {
                name: 'Skyline Luxury Hub',
                img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
                amenities: ['Wi-Fi', 'Rooftop Bar', 'Parking']
            }
        ];

        return propertyTypes.map((p, i) => {
            const base = 5000 + (Math.random() * 10000);

            // Generate Room Matrix
            const roomTypes = ['Deluxe Room', 'Superior Room', 'Executive Suite'];
            const otas = ['Booking.com', 'Agoda', 'Expedia', 'MakeMyTrip'];

            const roomOptions = roomTypes.map(room => ({
                type: room,
                prices: otas.map(ota => ({
                    ota,
                    totalPrice: this.calculateOtaPrice(base, room, ota),
                    currency: 'INR',
                    deepLink: `https://${ota.toLowerCase().replace('.com', '')}.com/redirect`
                })).sort((a, b) => a.totalPrice - b.totalPrice)
            }));

            // Flatten for the "cheapest deal" preview
            const flatPrices = roomOptions[0].prices.map(p => ({
                ...p,
                basePrice: p.totalPrice * 0.85,
                tax: p.totalPrice * 0.15,
                roomType: roomOptions[0].type
            }));

            return {
                externalId: `stayra_${i}`,
                name: `${p.name} - ${location}`,
                location: `${location}, Premium Sector`,
                starRating: 5,
                description: 'An exquisitely designed property featuring panoramic views and world-class amenities catered to the modern traveler.',
                imageUrl: `${p.img}?auto=format&fit=crop&q=80&w=1200`,
                amenities: p.amenities,
                prices: flatPrices,
                roomOptions: roomOptions
            };
        });
    }

    private static calculateOtaPrice(base: number, room: string, ota: string): number {
        let multiplier = 1;
        if (room === 'Superior Room') multiplier = 1.3;
        if (room === 'Executive Suite') multiplier = 2.1;

        // OTA Specific variations
        const otaOffsets: Record<string, number> = {
            'Booking.com': 1.0,
            'Agoda': 0.96,
            'Expedia': 1.02,
            'MakeMyTrip': 0.99
        };

        return Math.floor(base * multiplier * (otaOffsets[ota] || 1));
    }
}
