import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getDb } from "@/db/client";

export async function GET(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get("secret");
    const configuredSecret = process.env.SETUP_SECRET;

    if (!configuredSecret) {
        return NextResponse.json(
            { error: "SETUP_SECRET environment variable is not configured" },
            { status: 500 }
        );
    }

    if (secret !== configuredSecret) {
        return NextResponse.json(
            { error: "Invalid secret" },
            { status: 401 }
        );
    }

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return NextResponse.json(
            { error: "You must be logged in to claim the admin role" },
            { status: 401 }
        );
    }

    // Bypass auth policies by updating the database directly
    const db = await getDb();
    await db.collection("user").updateOne(
        { id: session.user.id },
        { $set: { role: "admin" } }
    );

    return NextResponse.json({ 
        success: true, 
        message: `Successfully upgraded user ${session.user.email} to admin!` 
    });
}
