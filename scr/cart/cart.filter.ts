export interface CartFilter {
  user?: string;
  state?: "Complete" | "Pending" | "Canceled";
}
