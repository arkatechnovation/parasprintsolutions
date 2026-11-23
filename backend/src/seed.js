import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { models, Category, SiteSetting, CalculatorSetting } from './models/index.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
export async function seed() {
  const data = JSON.parse(
    await fs.readFile(new URL('../data/catalog.json', import.meta.url), 'utf8'),
  );
  const mapping = {
    categories: 'Category',
    products: 'Product',
    industries: 'Industry',
    pages: 'Page',
    blogs: 'Blog',
    caseStudies: 'CaseStudy',
    clients: 'Client',
    testimonials: 'Testimonial',
    gallery: 'Gallery',
    machines: 'Machine',
  };
  for (const [key, name] of Object.entries(mapping)) {
    for (const item of data[key]) {
      if (name === 'Product') {
        const category = await Category.findOne({ slug: item.categorySlug });
        item.category = category?._id;
      }
      await models[name].updateOne(
        { slug: item.slug },
        { $setOnInsert: item },
        { upsert: true, runValidators: true },
      );
    }
  }
  for (const [key, value] of Object.entries(data.settings))
    await SiteSetting.updateOne(
      { key },
      { $setOnInsert: { key, value, public: true } },
      { upsert: true },
    );
  await CalculatorSetting.updateOne(
    { key: 'default' },
    { $setOnInsert: data.calculator },
    { upsert: true, runValidators: true },
  );
  await Promise.all(Object.values(models).map((Model) => Model.createIndexes()));
  console.log('Content seed checked; existing database content preserved.');
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    await connectDatabase();
    await seed();
  } finally {
    await disconnectDatabase();
  }
}
