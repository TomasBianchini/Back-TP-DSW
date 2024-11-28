import { Product } from './product.entity.js';

async function checkProductAvailability(product: Product, quantity: number) {
  if (!product || !product.isActive() || !product.isAvailable(quantity)) {
    return false;
  }
  return true;
}

async function filterData(products: Product[]) {
  const filteredProducts = products.map((product) => {
    const discounts = product.category?.discounts || [];
    const filteredDiscounts = discounts.filter((discount) =>
      discount.isActive()
    );
    return {
      ...product,
      category: { ...product.category, discounts: filteredDiscounts },
    };
  });
  return filteredProducts;
}

export { checkProductAvailability, filterData };
