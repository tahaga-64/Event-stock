export type InventoryStatus = '正常' | '不足' | '要購入';

export type InventoryItem = {
  id: string;
  name: string;
  current_stock: number;
  minimum_stock: number;
  category_name: string;
  used_events_count: number;
  updated_at: string;
  memo: string | null;
  image_url: string | null;
};

export type InventoryItemInput = {
  id?: string;
  name: string;
  current_stock: number;
  minimum_stock: number;
  category_name: string;
  used_events_count: number;
  memo: string;
};
