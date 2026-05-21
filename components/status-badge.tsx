import { getStatus } from '@/lib/inventory';
import { InventoryItem } from '@/types/db';

export function StatusBadge({ item }: { item: InventoryItem }) {
  const status = getStatus(item);
  const color = status === '正常' ? 'bg-emerald-100 text-emerald-700' : status === '不足' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{status}</span>;
}
