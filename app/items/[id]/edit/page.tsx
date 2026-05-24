import { notFound } from 'next/navigation';
import { ItemForm } from '@/components/item-form';
import { getSupabaseServer } from '@/lib/supabase-server';
import type { InventoryItemInput } from '@/types/db';

export const dynamic = 'force-dynamic';

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServer();
  const { data } = await supabase.from('inventory_items').select('*').eq('id', params.id).single();
  if (!data) return notFound();

  const initial: InventoryItemInput = {
    id: data.id,
    name: data.name,
    current_stock: data.current_stock,
    minimum_stock: data.minimum_stock,
    category_name: data.category_name,
    used_events_count: data.used_events_count ?? 0,
    memo: data.memo ?? ''
  };

  return <main className="mx-auto max-w-2xl p-4 sm:p-6"><ItemForm mode="edit" initial={initial} /></main>;
}
