# イベント在庫管理Webアプリ

## 1. 推奨技術スタック
- **Next.js 14 (App Router) + TypeScript**: 無料デプロイ(Vercel)との相性が良く、保守性が高い。
- **Supabase (PostgreSQL + Auth + Storage)**: DB/認証/画像保存を無料枠で統合管理。
- **Tailwind CSS + Lucide Icons**: iOS風の余白多めUIを高速実装。
- **React Hook Form + Zod**: 将来的な入力項目拡張とバリデーション強化に対応しやすい。

## 2. システム構成図
```text
[Mobile/Web Browser]
   │
   ▼
[Next.js on Vercel]
   ├─ Supabase Auth (Google OAuth)
   ├─ Supabase Postgres (在庫/イベント)
   ├─ Supabase Storage (画像)
   └─ 外部イベント管理アプリ (URL+Queryで連携)
```

## 3. DB設計
`supabase/migrations/20260521_init.sql` を参照。

主要テーブル:
- `inventory_items`
- `inventory_categories`
- `events`
- `event_inventory_relations`
- 一覧表示用View: `inventory_items_view`

## 4. 画面構成
- `/login`: Googleログイン
- `/dashboard`: 在庫一覧/検索/カテゴリ絞り込み/不足のみ表示/購入申請導線
- `/items/new`: 在庫追加
- `/items/[id]/edit`: 在庫編集

## 5. フォルダ構成
```text
app/
  (auth)/login/
  dashboard/
  items/new/
  items/[id]/edit/
components/
lib/
supabase/migrations/
types/
```

## 6. 実装手順
1. `npm install`
2. `.env.example` を `.env.local` にコピーして値を設定
3. SupabaseでGoogle OAuth有効化
4. SQL Editorで `supabase/migrations/20260521_init.sql` 実行
5. `npm run dev`

## 7. 必要コード
- Supabaseクライアント: `lib/supabase.ts`
- 在庫状態計算: `lib/inventory.ts`
- 一覧UI: `components/inventory-table.tsx`
- CRUDフォーム: `components/item-form.tsx`

## 8. デプロイ方法
1. GitHubへpush
2. Vercelにimport
3. 環境変数 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_EVENT_APP_URL` を設定
4. Deploy

## 9. 将来的な拡張案
- Push通知（Supabase Edge Functions + FCM/APNs）
- 在庫履歴テーブル追加（入出庫監査ログ）
- イベント管理アプリとの双方向連携（Webhook）
- 権限管理（管理者/閲覧者）
- PWA化してオフライン参照
