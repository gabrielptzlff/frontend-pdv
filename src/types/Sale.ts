import { Customer } from "./Customer";
import { PaymentMethod } from "./PaymentMethod";
import { Product } from "./Product";

export interface Sale {
  id: number;
  customer: Customer[];
  totalPrice: number;
  paymentMethod: PaymentMethod[];
  products: Product[];
}

export interface insertSale {
  id: number;
  customerId: number;
  paymentMethodId: number;
  totalPrice: number;
  products: Product[];
}
