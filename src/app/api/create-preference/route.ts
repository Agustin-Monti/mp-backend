// /app/api/create-preference/route.ts
import { NextResponse } from "next/server";

const MP_API = "https://api.mercadopago.com/checkout/preferences";

// 🔹 POST: crear preferencia
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = body.title ?? "Pack Canary";
    const price = Number(body.price ?? 1);
    const quantity = Number(body.quantity ?? 1);
    const external_reference = body.external_reference ?? null;

    if (!price || price <= 0) {
      const res = NextResponse.json({ error: "Precio inválido" }, { status: 400 });
      setCorsHeaders(res);
      return res;
    }

    const mpBody = {
      items: [
        {
          title,
          quantity,
          unit_price: price,
        },
      ],
      external_reference,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}api/mp/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}api/mp/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}api/mp/pending`,
      },
      auto_return: "approved",
    };

    const resp = await fetch(MP_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mpBody),
    });

    const data = await resp.json();

    const res = NextResponse.json({ init_point: data.init_point, preference_id: data.id });

    setCorsHeaders(res);
    return res;

  } catch (err) {
    console.error(err);
    const res = NextResponse.json({ error: "Error interno" }, { status: 500 });
    setCorsHeaders(res);
    return res;
  }
}

// 🔹 OPTIONS: preflight
export async function OPTIONS(request: Request) {
  const res = NextResponse.json({});
  setCorsHeaders(res);
  return res;
}

// 🔹 Función para agregar headers CORS
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // para pruebas en local/ngrok
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
