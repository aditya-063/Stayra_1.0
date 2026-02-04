import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/db";
import { HotelService } from "@/services/hotel.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { location, checkIn, checkOut, guests, rooms } = body;

        // 1. Record search (Optional - don't fail the request if DB is down/missing)
        let searchId: string | null = null;
        try {
            const search = await prisma.search.create({
                data: {
                    location,
                    checkIn: new Date(checkIn),
                    checkOut: new Date(checkOut),
                    guests: Number(guests),
                    rooms: Number(rooms),
                },
            });
            searchId = search.id;
        } catch (dbError) {
            console.warn("Database recording failed (ignoring):", dbError);
        }

        // 2. Fetch from OTAs (Aggregator)
        let rawHotels = await HotelService.fetchHotelsFromOTAs(location);

        // 3. Process & Map results (Make DB saving non-fatal)
        const finalHotels = await Promise.all(
            rawHotels.map(async (hotelData) => {
                let savedHotel = null;
                if (searchId) {
                    try {
                        savedHotel = await prisma.hotel.create({
                            data: {
                                searchId: searchId,
                                externalId: hotelData.externalId,
                                name: hotelData.name,
                                location: hotelData.location,
                                starRating: hotelData.starRating,
                                description: hotelData.description,
                                imageUrl: hotelData.imageUrl,
                                prices: {
                                    create: hotelData.prices.map((p) => ({
                                        ota: p.ota,
                                        basePrice: p.basePrice,
                                        tax: p.tax,
                                        totalPrice: p.totalPrice,
                                        currency: p.currency,
                                        deepLink: p.deepLink,
                                        roomType: p.roomType,
                                    })),
                                },
                            },
                            include: { prices: true },
                        });
                    } catch (err) {
                        console.warn(`Failed to save hotel ${hotelData.name} to DB:`, err);
                    }
                }

                // Return standardized object for ranking
                return {
                    id: savedHotel?.id || hotelData.externalId,
                    name: hotelData.name,
                    location: hotelData.location,
                    starRating: hotelData.starRating,
                    description: hotelData.description,
                    imageUrl: hotelData.imageUrl,
                    topPrices: hotelData.prices.sort((a, b) => a.totalPrice - b.totalPrice),
                    cheapestPrice: hotelData.prices[0]?.totalPrice,
                };
            })
        );

        // 4. Final Ranking
        const rankedHotels = finalHotels.sort((a, b) => (a.cheapestPrice || Infinity) - (b.cheapestPrice || Infinity));

        return NextResponse.json({
            searchId: searchId,
            hotels: rankedHotels,
        });
    } catch (error) {
        console.error("Critical Search API Error:", error);
        // Even on critical error, try to return something if possible or a clear 500
        return NextResponse.json({ error: "Search failed", details: String(error) }, { status: 500 });
    }
}
