
const { PrismaClient } = require('@prisma/client')
const { config } = require('dotenv')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:c:/Users/adity/OneDrive/Desktop/Main Project/Booking_Hotels/frontend/prisma/dev.db"
        }
    }
})

const mockHotels = [
    {
        canonicalName: "The Royal Atlantis",
        normalizedName: "the royal atlantis",
        slug: "the-royal-atlantis-dubai",
        address: "Crescent Rd, The Palm Jumeirah",
        city: "Dubai",
        country: "UAE",
        starRating: 5,
        propertyType: "Resort",
        description: "Experience the ultimate in luxury at The Royal Atlantis. Featuring a 90-meter sky pool, private beaches, and celebrity chef restaurants, this iconic landmark redefines opulence on the Palm Jumeirah.",
        primaryImageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3270&auto=format&fit=crop",
        reviewScore: 4.8,
        reviewCount: 1240,
        amenities: ["Infinity Pool", "Private Beach", "Spa", "Butler Service"],
        roomOptions: [
            {
                type: "King Room Ocean View",
                prices: [
                    { ota: "Booking.com", totalPrice: 45000, currency: "INR", deepLink: "#", roomType: "King Ocean" },
                    { ota: "Agoda", totalPrice: 42500, currency: "INR", deepLink: "#", roomType: "King Ocean View" },
                    { ota: "Expedia", totalPrice: 46000, currency: "INR", deepLink: "#", roomType: "Ocean King" }
                ]
            },
            {
                type: "Palm Suite",
                prices: [
                    { ota: "Booking.com", totalPrice: 85000, currency: "INR", deepLink: "#", roomType: "Suite" },
                    { ota: "Agoda", totalPrice: 82000, currency: "INR", deepLink: "#", roomType: "Suite Palm" }
                ]
            }
        ]
    },
    {
        canonicalName: "Taj Mahal Palace",
        normalizedName: "taj mahal palace",
        slug: "taj-mahal-palace-mumbai",
        address: "Apollo Bunder",
        city: "Mumbai",
        country: "India",
        starRating: 5,
        propertyType: "Heritage",
        description: "A defining structure of Mumbai's skyline, The Taj Mahal Palace is more than just a hotel; it is a legend. Hosting kings, dignitaries, and celebrities since 1903.",
        primaryImageUrl: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=3270&auto=format&fit=crop",
        reviewScore: 4.9,
        reviewCount: 3500,
        amenities: ["Heritage Walk", "Sea View", "Butler Service", "Pool"],
        roomOptions: [
            {
                type: "Palace Wing King",
                prices: [
                    { ota: "Booking.com", totalPrice: 28000, currency: "INR", deepLink: "#", roomType: "King" },
                    { ota: "Agoda", totalPrice: 26500, currency: "INR", deepLink: "#", roomType: "King Palace" }
                ]
            }
        ]
    },
    {
        canonicalName: "Ritz Paris",
        normalizedName: "ritz paris",
        slug: "ritz-paris",
        address: "15 Place Vendôme",
        city: "Paris",
        country: "France",
        starRating: 5,
        propertyType: "Luxury",
        description: "The quintessence of French art de vivre. The Ritz Paris is a place where dreams come to life, offering a unique experience in the heart of the City of Light.",
        primaryImageUrl: "https://images.unsplash.com/photo-1590073242678-cfe2f1610738?q=80&w=3435&auto=format&fit=crop",
        reviewScore: 4.9,
        reviewCount: 980,
        amenities: ["Michelin Dining", "Spa", "Garden", "Historic Bar"],
        roomOptions: [
            {
                type: "Superior Room",
                prices: [
                    { ota: "Booking.com", totalPrice: 120000, currency: "INR", deepLink: "#", roomType: "Superior" },
                    { ota: "Hotels.com", totalPrice: 118000, currency: "INR", deepLink: "#", roomType: "Sup" }
                ]
            }
        ]
    },
    {
        canonicalName: "Marina Bay Sands",
        normalizedName: "marina bay sands",
        slug: "marina-bay-sands-singapore",
        address: "10 Bayfront Ave",
        city: "Singapore",
        country: "Singapore",
        starRating: 5,
        propertyType: "Resort",
        description: "Home to the world's largest rooftop infinity pool, award-winning dining, and a wide range of shopping and entertainment options.",
        primaryImageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=3471&auto=format&fit=crop",
        reviewScore: 4.7,
        reviewCount: 5200,
        amenities: ["Infinity Pool", "Casino", "SkyPark", "Shopping Mall"],
        roomOptions: [
            {
                type: "Deluxe King",
                prices: [
                    { ota: "Booking.com", totalPrice: 48000, currency: "INR", deepLink: "#", roomType: "Deluxe" },
                    { ota: "Agoda", totalPrice: 47500, currency: "INR", deepLink: "#", roomType: "Deluxe King" },
                    { ota: "Trip.com", totalPrice: 46800, currency: "INR", deepLink: "#", roomType: "King Deluxe" }
                ]
            }
        ]
    }
];

async function main() {
    console.log('Seeding database...')

    // Clean up existing data
    await prisma.otaRoomAlias.deleteMany()
    await prisma.roomRate.deleteMany()
    await prisma.roomType.deleteMany()
    await prisma.hotelImage.deleteMany()
    await prisma.hotelAmenity.deleteMany()
    await prisma.amenityMaster.deleteMany()
    await prisma.hotel.deleteMany()

    // Create Amenities Master
    const uniqueAmenities = Array.from(new Set(mockHotels.flatMap(h => h.amenities)))
    const amenityMap = new Map()

    for (let i = 0; i < uniqueAmenities.length; i++) {
        const name = uniqueAmenities[i]
        const created = await prisma.amenityMaster.create({
            data: { id: i + 1, name }
        })
        amenityMap.set(name, created.id)
    }

    // Create Hotels
    for (const hotelData of mockHotels) {
        const hotel = await prisma.hotel.create({
            data: {
                canonicalName: hotelData.canonicalName,
                normalizedName: hotelData.normalizedName,
                slug: hotelData.slug,
                address: hotelData.address,
                city: hotelData.city,
                country: hotelData.country,
                starRating: hotelData.starRating,
                propertyType: hotelData.propertyType,
                description: hotelData.description,
                primaryImageUrl: hotelData.primaryImageUrl,
                reviewScore: hotelData.reviewScore,
                reviewCount: hotelData.reviewCount,
            }
        })

        // Link Amenities
        for (const amenityName of hotelData.amenities) {
            const amenityId = amenityMap.get(amenityName)
            if (amenityId) {
                await prisma.hotelAmenity.create({
                    data: {
                        hotelId: hotel.id,
                        amenityId: amenityId
                    }
                })
            }
        }

        // Link Images ( Primary )
        await prisma.hotelImage.create({
            data: {
                hotelId: hotel.id,
                imageUrl: hotelData.primaryImageUrl,
                isPrimary: true
            }
        })

        // Create Room Types & Rates
        for (const roomData of hotelData.roomOptions) {
            const roomType = await prisma.roomType.create({
                data: {
                    hotelId: hotel.id,
                    canonicalName: roomData.type,
                }
            })

            for (const price of roomData.prices) {
                await prisma.roomRate.create({
                    data: {
                        roomTypeId: roomType.id,
                        otaName: price.ota,
                        checkin: new Date(), // Mock date
                        checkout: new Date(Date.now() + 86400000), // Mock date + 1 day
                        basePrice: price.totalPrice,
                        currency: price.currency,
                        bookingUrl: price.deepLink
                    }
                })
            }
        }
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
