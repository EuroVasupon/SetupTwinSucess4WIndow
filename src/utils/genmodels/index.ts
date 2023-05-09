import HandlePort from '../handlePort';
import Connection from './DBCConector';
import tranformer from './createStructure';
import fileWriter from './fileWriter';
import {
  outputPath,
  dbConfig,
  dbTables,
  outputPathChat,
  dbConfigChat,
  dbTablesChat
} from './config';

interface IDBConfig {
  host: string;
  port: string | number | undefined;
  username: string;
  password: string;
  schema: string;
}

const genModel = async (
  dbConfig: IDBConfig,
  dbTables: string[],
  outputPath: string
): Promise<void> => {
  const db = new Connection(
    dbConfig.host,
    dbConfig.username,
    dbConfig.password,
    dbConfig.schema,
    HandlePort(dbConfig.port)
  );

  db.dbConnect();
  console.log('Start converting database schema to model...');
  console.log(`--- Schema: ${dbConfig.schema} ---`);
  console.log(`--- Target: ${dbTables.length} tables ---`);
  console.log(`--- Output Path: "${outputPath}" ---`);

  for (const element of dbTables) {
    try {
      const elem = element.toLowerCase();
      const result = (await db.getSchema(elem)) as any[];
      const model = tranformer(result, elem);
      fileWriter.writeFile(outputPath, model, elem);
    } catch (e) {
      console.log(e);
    }
  }
  db.dbDisConnect();
};

const main = async (): Promise<void> => {
  const configs = [
    {
      outputPath,
      dbConfig,
      dbTables
    },
    {
      outputPath: outputPathChat,
      dbConfig: dbConfigChat,
      dbTables: dbTablesChat
    }
  ];

  for (const item of configs) {
    await genModel(item.dbConfig, item.dbTables, item.outputPath);
  }
};

main();
