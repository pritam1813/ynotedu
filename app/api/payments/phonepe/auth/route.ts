import { NextRequest, NextResponse } from "next/server";

const PHONEPE_API_ENDPOINT =
    process.env.PHONEPE_ENV === "production"
        ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

export async function POST(request: NextRequest) {
    try {
        const requestBodyJson = {
            "client_version": "1",
            "grant_type": "client_credentials",
            "client_id": process.env.PHONEPE_CLIENT_ID!,
            "client_secret": process.env.PHONEPE_CLIENT_SECRET!,
        };

        const phonePeTokenResponse = await fetch(PHONEPE_API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(requestBodyJson),
        });

        const result = await phonePeTokenResponse.json();

        console.log("PhonePe Auth Response:", result);

        if (!phonePeTokenResponse.ok || result.error) {
            console.error("PhonePe auth failed:", result);
            return NextResponse.json(
                { success: false, error: result.error_description || "Failed to get auth token" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            accessToken: result.access_token,
            expiresAt: result.expires_at,
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}