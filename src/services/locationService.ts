export async function getCities() {
  const res = await fetch("/api/cities");

  if (!res.ok) throw new Error("Failed to fetch cities");

  const result = await res.json();

  return result.data.cities; // ✅ THIS is what your component expects
}

export async function getSchools(city: string) {
  const res = await fetch(`/api/schools?city=${encodeURIComponent(city)}`);

  if (!res.ok) throw new Error("Failed to fetch schools");

  const result = await res.json();

  return result.data.schools; // ✅ extract the array
}

export async function getLevels() {
  const res = await fetch("/api/level-data");

  if (!res.ok) throw new Error("Failed to fetch levels");

  const result = await res.json();

  // normalize response
  if (result?.levels) {
    return result.levels; // return the array directly
  }

  return [];
}
