export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  //auth-service-375591904635.us-central1.run.app/api/auth/schools
  const backendUrl = `https://auth-service-375591904635.us-central1.run.app/api/auth/schools${
    city ? `?city=${encodeURIComponent(city)}` : ""
  }`;
  const res = await fetch(backendUrl);
  const data = await res.json();

  return Response.json(data);
}
