export interface CartFilter {
  user?: string;
  state?: "Complete" | "Pending" | "Canceled";
  shipmethod?: "Standard" | "Express" | "Next Day" | "Pickup";
}
