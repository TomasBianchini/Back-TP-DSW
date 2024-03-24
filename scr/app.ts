import "reflect-metadata";
import express from "express";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import cors from "cors";
import routes from "./routes.js";

//swagger
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./shared/swagger.js";

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

//Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));
app.use("/api", routes);

await syncSchema(); //never in production
app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

app.listen(3000, () => {
  console.log("Server runnning on http://localhost:3000/");
});
