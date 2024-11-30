import { Product } from './product.entity.js';

async function filterData(products: Product[]) {
  const filteredProducts = products.map((product) => {
    const discounts = product.category?.discounts || [];
    const activeDiscounts = discounts.filter((discount) => discount.isActive());
    return {
      ...product,
      category: { ...product.category, discounts: activeDiscounts },
    };
  });
  return filteredProducts;
}

export { filterData };
