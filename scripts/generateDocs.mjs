import spec from './openapi.json' with {type: 'json'};
import regions from './regions.json' with {type: 'json'};
import fs from 'fs/promises';

async function init() {
  try {
    await generateOpenApi();
    await generateFiles();
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

const translateDescription = async (obj, slug) => {
  if (!obj || slug === 'en') {
    return obj;
  }

  let file
  try {
    file = await fs.readFile(`./src/${slug}/t.json`)
  } catch (e) {
    return obj
  }

  const t = JSON.parse(file)?.jsonTitles

  if (obj.paths) {
    for (const path in obj.paths) {
      if (!obj.paths[path]) {
        continue;
      }

      for (const apiMethod in obj.paths[path]) {
        if (!obj.paths[path][apiMethod]) {
          continue;
        }

        if (obj.paths[path][apiMethod].summary && t[obj.paths[path][apiMethod].summary]) {
          obj.paths[path][apiMethod].summary = t[obj.paths[path][apiMethod].summary];
        }
        if (obj.paths[path][apiMethod].description && t[obj.paths[path][apiMethod].description]) {
          obj.paths[path][apiMethod].description = t[obj.paths[path][apiMethod].description];
        }
      }
    }
  }

  return obj;
}

async function generateOpenApi() {
  for (const region of regions) {
    const copySpec = JSON.parse(JSON.stringify(spec))
    const {slug} = region;
    const path = `./src/${slug}`;
    await fs.mkdir(path, {recursive: true});

    const regionsByExchanges = await fetch('https://criptoya.com/api/exchanges')
      .then(response => response.json())

    const regionExchanges = regionsByExchanges[region.slug.toLowerCase()] || [];

    const specString = JSON.stringify(await translateDescription(copySpec, slug))
      .replace('"REPLACE_COTIZACION_EXCHANGE_ENUMS"', regionExchanges.map(exchange => `"${exchange}"`).join(','))
      .replace('"REPLACE_COTIZACION_EXCHANGE_EXAMPLE"', `"${regionExchanges[0] || ''}"`);

    await fs.writeFile(`${path}/openapi.json`, JSON.stringify(JSON.parse(specString), null, 4));
  }
}

async function generateFiles() {
  for (const region of regions) {
    const {slug} = region;
    const path = `./src/${slug}/operations`;

    // generate operations
    await fs.mkdir(path, {recursive: true});
    const operationContent = await fs.readFile(`./scripts/templates/operations/[operationId].md`, 'utf8');
    await fs.writeFile(`${path}/[operationId].md`, operationContent.replace('REPLACE_REGION', slug));

    const pathsContent = await fs.readFile(`./scripts/templates/operations/[operationId].paths.js`, 'utf8');
    await fs.writeFile(`${path}/[operationId].paths.js`, pathsContent.replace('REPLACE_REGION', slug));

    // generate docs files when add new lang
    if (region.slug !== 'en') {
      try {
        await fs.access(`./src/${slug}/index.md`);
        console.log(`File ./src/${slug}/index.md already exists, skipping...`);
      } catch {
        await fs.copyFile(`./src/en/index.md`, `./src/${slug}/index.md`);
        await fs.copyFile(`./src/en/t.json`, `./src/${slug}/t.json`);
        await fs.cp(`./src/en/installation`, `./src/${slug}/installation`, {recursive: true});
        await fs.cp(`./src/en/integration`, `./src/${slug}/integration`, {recursive: true});
      }
    }
  }
}

init();
