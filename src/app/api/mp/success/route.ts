import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  console.log("MP success query:", query);

  // Determinamos el status
  const status = query['status'] ?? 'failure';

  // Redirigimos al deep link
  const deepLink = `shipy://auth-callback?status=${status}`;

  return NextResponse.redirect(deepLink);
}
