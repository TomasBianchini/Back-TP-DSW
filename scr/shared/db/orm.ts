import { MikroORM } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { config } from 'dotenv';

config();
const MONGO_URI = process.env.MONGO_URI;

const MONGO_DB = process.env.MONGO_DB;

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: MONGO_DB,
  type: 'mongo',
  clientUrl: MONGO_URI,
  highlighter: new MongoHighlighter(),
  debug: true,
  allowGlobalContext: true,
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  /*   
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema();
};
