import { getStatus } from '@/lib/inventory';
import type { InventoryItem } from '@/types/db';

const baseItem: InventoryItem = {
  id: 'test-id',
  name: 'テストアイテム',
  current_stock: 10,
  minimum_stock: 5,
  category_name: '電源',
  used_events_count: 2,
  updated_at: '2026-05-24T00:00:00Z',
  memo: null,
  image_url: null,
};

describe('getStatus', () => {
  test('在庫が0のとき「要購入」を返す', () => {
    expect(getStatus({ ...baseItem, current_stock: 0 })).toBe('要購入');
  });

  test('在庫が最低必要在庫以下のとき「不足」を返す', () => {
    expect(getStatus({ ...baseItem, current_stock: 5, minimum_stock: 5 })).toBe('不足');
    expect(getStatus({ ...baseItem, current_stock: 3, minimum_stock: 5 })).toBe('不足');
  });

  test('在庫が最低必要在庫を上回るとき「正常」を返す', () => {
    expect(getStatus({ ...baseItem, current_stock: 10, minimum_stock: 5 })).toBe('正常');
  });
});
