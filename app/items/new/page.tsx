import { ItemForm } from '@/components/item-form';

export default function NewItemPage() {
  return <main className="mx-auto max-w-2xl p-4 sm:p-6"><ItemForm mode="create" /></main>;
}
