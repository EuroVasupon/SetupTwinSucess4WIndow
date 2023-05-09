import { camelCase } from 'camel-case';
import fs from 'fs';
import beautify from 'js-beautify';
import replace from 'replace-in-file';

const writeFile = (outputPath: string, data: any, tableName: string): void => {
  const fileName = camelCase(tableName);

  const nameValiable = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  const nameInterface = 'I' + nameValiable;

  const stringFile =
    `import { DataTypes } from "sequelize"; \n import sequelize from '../config/db'; \n import { ${nameInterface} } from "./types";\n const ${nameValiable} = sequelize.define<${nameInterface}>( '${fileName}' , ` +
    JSON.stringify(data.attributes) +
    ',' +
    JSON.stringify(data.tableDetail) +
    `); \n \n export default ${nameValiable};`;
  data = beautify(stringFile, {
    indent_size: 2,
    jslint_happy: true
  });
  fs.writeFileSync(`${outputPath + fileName}.ts`, data, 'utf8');
  try {
    replace.sync({
      files: `${outputPath + fileName}.ts`,
      from: /["][$]|[$]["]/g,
      to: ''
    });
    replace.sync({
      files: `${outputPath + fileName}.ts`,
      from: /["]/g,
      // eslint-disable-next-line quotes
      to: "'"
    });
    logSuccess(fileName);
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

const logSuccess = (fileName: string): void => {
  const dash = 30 - fileName.length;
  let str = `Create -- ${fileName}.ts `;
  for (let i = 0; i < dash; i++) {
    str += '-';
  }
  str += ' successfully !!';
  console.log(str);
};

export default { writeFile };
