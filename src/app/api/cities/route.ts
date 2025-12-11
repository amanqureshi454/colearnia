export async function GET() {
  try {
    const res = await fetch(
      `https://auth-service-375591904635.us-central1.run.app/api/auth/cities`
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
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("🔥 Backend fetch error:", err);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
