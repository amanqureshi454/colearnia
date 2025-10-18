export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  const backendUrl = `${
    process.env.NEXT_PUBLIC_DASHBOARD_URL
  }/auth/api/auth/schools${city ? `?city=${encodeURIComponent(city)}` : ""}`;
  const res = await fetch(backendUrl);
  const data = await res.json();

  return Response.json(data);
}
