import { InventoryItem, InventoryStatus } from '@/types/db';

export const getStatus = (item: InventoryItem): InventoryStatus => {
  if (item.current_stock <= 0) return '要購入';
  if (item.current_stock <= item.minimum_stock) return '不足';
  return '正常';
};
