export interface Product {
  toLowerCase(): unknown;
  id: string;
  name: string;
  price: number;
  priceArr: Array<string>;
  parcelamento: Array<number>;
  color: string;
  image: string;
  size: Array<string>;
  date: string;
}

