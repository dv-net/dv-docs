import spec from './openapi.json' with {type: 'json'};
import regions from './regions.json' with {type: 'json'};
import fs from 'fs/promises';

async function init() {
  try {
    await generateEnTranslations();
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

async function updateEnTranslations(enTranslation) {
  const filePath = './src/en/t.json';

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    jsonData.jsonTitles = enTranslation;

    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 4));
  } catch (error) {
    console.error('Error updating translations:', error);
  }
}

async function generateEnTranslations() {
  const enTranslation = {};

  if (spec.paths) {
    for (const path in spec.paths) {
      if (!spec.paths[path]) {
        continue;
      }

      for (const apiMethod in spec.paths[path]) {
        if (!spec.paths[path][apiMethod]) {
          continue;
        }

        if (spec.paths[path][apiMethod].summary) {
          enTranslation[spec.paths[path][apiMethod].summary] = spec.paths[path][apiMethod].summary;
        }
        if (spec.paths[path][apiMethod].description) {
          enTranslation[spec.paths[path][apiMethod].description] = spec.paths[path][apiMethod].description;
        }

        console.log(`Added ${spec.paths[path][apiMethod].description} key for en translations`)
      }
    }
  }

  await updateEnTranslations(enTranslation);

  regions.forEach(async (region) => {
    if (region.slug !== 'en') {
      try {
        await fs.access(`./src/${region.slug}/t.json`);
        console.log(`File /src/${region.slug}/t.json already exists, skipping...`);
      } catch {
        await fs.copyFile(`./src/en/t.json`, `./src/${region.slug}/t.json`);
        console.log(`File /src/${region.slug}/t.json created`);
      }
    }
  });
}

init();
