export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: number;
  customer: string;
  totalPrice: number;
  paymentMethod: string;
  products: Product[];
}