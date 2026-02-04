import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId");
    const ota = searchParams.get("ota");
    const url = searchParams.get("url");

    if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

    try {
        // Log click
        if (hotelId && ota) {
            await prisma.click.create({
                data: {
                    hotelId,
                    ota,
                    affiliateLink: url,
                    ip: req.headers.get("x-forwarded-for") || "unknown",
                    device: req.headers.get("user-agent"),
                },
            });
        }

        return NextResponse.redirect(url);
    } catch (error) {
        console.error("Redirect API Error:", error);
        return NextResponse.redirect(url); // Redirect anyway even if logging fails
    }
}
