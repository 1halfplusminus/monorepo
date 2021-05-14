import json from './openapi.json';
import { writeFileSync } from 'fs';

// eslint-disable-next-line prefer-const
let fixed: typeof json & { servers?: { url: string }[] } = json;
delete fixed.host;
delete fixed.basePath;
delete fixed.consumes;
delete fixed.produces;
delete fixed.schemes;
fixed.servers = [{ url: 'https://disease.sh/' }, { url: 'http://disease.sh/' }];
for (const key in json.paths) {
  if (Object.prototype.hasOwnProperty.call(json.paths, key)) {
    console.log(json.paths[key].get);
    for (
      let index = 0;
      index < json.paths[key].get?.parameters?.length;
      index++
    ) {
      const element = json.paths[key].get.parameters[index];
      element.schema = {
        type: element.type,
        enum: element.enum,
        default: element.default,
      };
      delete element.type;
      delete element.enum;
      delete element.default;
      fixed.paths[key].get.parameters[index] = element;
    }
  }
}
writeFileSync('./openapi-fixed.json', JSON.stringify(fixed));
