import { Category } from "./category";
import { Country } from "./country";
import { Currency } from "./currency";
import { Seller } from "./seller";

export interface References {
  country? : Array<Country>;
  seller?: Array<Seller>
  category?: Array<Category>
  currency?: Array<Currency>
}
