import { notFound } from 'next/navigation';
import { ItemForm } from '@/components/item-form';
import { getSupabaseServer } from '@/lib/supabase';

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServer();
  const { data } = await supabase.from('inventory_items').select('*').eq('id', params.id).single();
  if (!data) return notFound();
  return <main className="mx-auto max-w-2xl p-4"><ItemForm mode="edit" initial={data} /></main>;
}
