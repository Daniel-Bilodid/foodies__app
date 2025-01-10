import fs from "node:fs";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  let existingMeal = db
    .prepare("SELECT slug FROM meals WHERE slug = ?")
    .get(meal.slug);
  let counter = 1;

  while (existingMeal) {
    meal.slug = slugify(`${meal.title}-${counter}`, { lower: true });
    existingMeal = db
      .prepare("SELECT slug FROM meals WHERE slug = ?")
      .get(meal.slug);
    counter++;
  }
  const file = meal.image;
  const fileName = `${meal.slug}.${file.name.split(".").pop()}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const buffer = Buffer.from(await file.arrayBuffer());

  stream.write(buffer, (error) => {
    if (error) {
      throw new Error("Saving image failed!");
    }
  });

  meal.image = `/images/${fileName}`;

  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
    `
  ).run(meal);
}
