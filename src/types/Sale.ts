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

export interface Customer {
  id: number;
  name: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
}