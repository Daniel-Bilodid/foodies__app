export default function MealsPost({ params }) {
  return (
    <main>
      <h1>Meals Post </h1>
      <p>{params.slug}</p>
    </main>
  );
}
