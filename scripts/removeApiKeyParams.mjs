import openapiSpec from './openapi.json' with {type: 'json'};
import fs from 'fs/promises';

async function removeApiKeyParams() {
  try {
    let removedCount = 0;
    if (openapiSpec.paths) {
      for (const path in openapiSpec.paths) {
        if (!openapiSpec.paths[path]) {
          continue;
        }
        for (const method in openapiSpec.paths[path]) {
          const operation = openapiSpec.paths[path][method];
          if (typeof operation !== 'object' || !operation.parameters) {
            continue;
          }
          if (Array.isArray(operation.parameters)) {
            const originalLength = operation.parameters.length;
            operation.parameters = operation.parameters.filter(param => {
              return !(param.name === 'api_key' && param.in === 'query');
            });
            const removed = originalLength - operation.parameters.length;
            if (removed > 0) {
              removedCount += removed;
              console.log(`Removed ${removed} api_key parameter(s) from ${method.toUpperCase()} ${path}`);
            }
          }
        }
      }
    }
    await fs.writeFile(
      './scripts/openapi.json',
      JSON.stringify(openapiSpec, null, 2),
      'utf-8'
    );
    console.log(`Successfully removed ${removedCount} api_key parameter(s) from all endpoints`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
removeApiKeyParams();

