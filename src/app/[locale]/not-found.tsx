import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p>Page not found</p>
      <Link href="/">Go home</Link>
    </div>
  );
}
