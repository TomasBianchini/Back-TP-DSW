export interface ProductFilter {
  category?: string;
  state?: "Active" | "Archived";
  seller?: string;
  stock?: number;
}
