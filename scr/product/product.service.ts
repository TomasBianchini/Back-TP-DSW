import { Product } from './product.entity.js';

async function checkProductAvailability(product: Product, quantity: number) {
  if (!product || !product.isActive() || !product.isAvailable(quantity)) {
    return false;
  }
  return true;
}

export { checkProductAvailability };
