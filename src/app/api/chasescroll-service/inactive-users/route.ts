import { IChaseScrollReturnType } from "@/types/ChaseScrollReturnType";
import { IChasescrollUser } from "@/types/Users";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.CHASESCROLL_BASE_URL || "https://test-api.chasescroll.com/";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const firstName = searchParams.get("firstName");
        const lastName = searchParams.get("lastName");
        const email = searchParams.get("email");

        const url = new URL(`${BASE_URL}/user/inactive-users`);
        if (firstName) url.searchParams.append("firstName", firstName);
        if (lastName) url.searchParams.append("lastName", lastName);
        if (email) url.searchParams.append("email", email);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const json = await response.json();
            console.log(json);
            return NextResponse.json({ error: `Failed to fetch inactive users: ${json.error_description || response.statusText}` }, { status: response.status });
        }

        const data = await response.json() as IChaseScrollReturnType<IChasescrollUser[]>;
        console.log("Inactive users fetched successfully:", data);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching inactive users:", error);
        return NextResponse.json({ error:`Failed to fetch inactive users ${error}` }, { status: 500 });
    }
}