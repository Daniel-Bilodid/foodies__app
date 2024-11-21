import Link from "next/link";

export default function Meals() {
  return (
    <main>
      <h1>Your Meals!</h1>

      <p>
        <Link href="/meals/post-1">Post 1</Link>
      </p>
    </main>
  );
}
