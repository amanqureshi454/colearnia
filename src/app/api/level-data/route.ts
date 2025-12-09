// src/app/api/level-data/route.ts
export async function GET() {
  try {
    const res = await fetch(
      `https://student-service-375591904635.us-central1.run.app/api/auth/levels-data`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch from backend" }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();

    // ✅ Normalize response
    return new Response(
      JSON.stringify({
        levels: data?.data ?? [], // your backend sends levels in `data`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    console.error("🔥 Backend fetch error:", err);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
