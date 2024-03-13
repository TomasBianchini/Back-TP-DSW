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
import { Router } from "express";

export const router = Router();

router.use("/category", categoryRouter);
router.use("/discount", discountRouter);
router.use("/payment_type", payment_typeRouter);
router.use("/user", userRouter);
router.use("/seller", sellerRouter);
router.use("/product", productRouter);
router.use("/login", loginRouter);
router.use("/review", reviewRouter);
router.use("/order", orderRouter);
router.use("/cart", cartRouter);
router.use("/shipping", shippingRouter);

export default router;
