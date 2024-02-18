import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";

export const orm = await MikroORM.init({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: "hc4gmo",
  type: "mongo",
  clientUrl: "mongodb+srv://tomassbianchini:VFJnJvLw3ymyqNak@cluster0.ohsbkl9.mongodb.net/",
  highlighter: new MongoHighlighter(),
  debug: true,
  allowGlobalContext: true,
  // schemaGenerator: {
  //   //never in production
  //   disableForeignKeys: true,
  //   createForeignKeyConstraints: true,
  //   ignoreSchema: [],
  // },
});


export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  /*   
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema();
};








