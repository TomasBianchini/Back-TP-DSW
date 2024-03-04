import "reflect-metadata";
import express from "express";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import cors from "cors";
import { categoryRouter } from "./category/category.routes.js";
import { discountRouter } from "./category/discount.routes.js";
import { payment_typeRouter } from "./payment_type/payment_type.routes.js";
import { userRouter } from "./users/user.routes.js";
import { productRouter } from "./product/product.routes.js";
import { sellerRouter } from "./users/seller.routes.js";
import { loginRouter } from "./users/login.routes.js";
import { reviewRouter } from "./product/review.routes.js";
import { orderRouter } from "./cart/order.routes.js";
import { cartRouter } from "./cart/cart.routes.js";
import { shippingRouter } from "./shipping/shipping.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/category", categoryRouter);
app.use("/discount", discountRouter);
app.use("/payment_type", payment_typeRouter);
app.use("/user", userRouter);
app.use("/seller", sellerRouter);
app.use("/product", productRouter);
app.use("/login", loginRouter);
app.use("/review", reviewRouter);
app.use("/order", orderRouter);
app.use("/cart", cartRouter);
app.use("/shipping", shippingRouter);

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

await syncSchema(); //never in production
app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

app.listen(3000, () => {
  console.log("Server runnning on http://localhost:3000/");
});
