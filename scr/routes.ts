import { categoryRouter } from './category/category.routes.js';
import { discountRouter } from './category/discount.routes.js';
import { payment_typeRouter } from './payment_type/payment_type.routes.js';
import { userRouter } from './users/user.routes.js';
import { productRouter } from './product/product.routes.js';
import { sellerRouter } from './users/seller.routes.js';
import { loginRouter } from './users/login.routes.js';
import { reviewRouter } from './product/review.routes.js';
import { orderRouter } from './cart/routes/order.routes.js';
import { cartRouter } from './cart/routes/cart.routes.js';
import { shippingRouter } from './shipping/shipping.routes.js';
import { Router } from 'express';

export const router = Router();

router.use('/categories', categoryRouter);
router.use('/discounts', discountRouter);
router.use('/payment-types', payment_typeRouter);
router.use('/users', userRouter);
router.use('/sellers', sellerRouter);
router.use('/products', productRouter);
router.use('/login', loginRouter);
router.use('/reviews', reviewRouter);
router.use('/orders', orderRouter);
router.use('/carts', cartRouter);
router.use('/shippings', shippingRouter);

export default router;
