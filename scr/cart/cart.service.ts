import { Cart } from './cart.entity';

async function calculateTotal(cart: Cart): Promise<number> {
  let total: number = 0;
  for (const order of cart.orders) {
    total += order.subtotal;
  }
  return total;
}

export { calculateTotal };
