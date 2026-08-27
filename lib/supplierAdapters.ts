export type SupplierSearchRequest = {
  category: "flight" | "hotel" | "cruise" | "package" | "activity";
  destination: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
};

export type SupplierSearchResult = {
  provider: string;
  title: string;
  summary: string;
  bookingUrl?: string;
  price?: { amount: number; currency: string };
  disclaimer?: string;
};

export interface SupplierAdapter {
  id: string;
  displayName: string;
  configured(): boolean;
  search(request: SupplierSearchRequest): Promise<SupplierSearchResult[]>;
}

export const supplierAdapters: SupplierAdapter[] = [];
