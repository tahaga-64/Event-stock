# イベント在庫管理Webアプリ

イベント運営向けの在庫管理Webアプリです。モバイルファーストで不足在庫を素早く把握し、外部イベント管理アプリへ購入申請を遷移できます。

## 1. 推奨技術スタック
- **Next.js 14 (App Router) + TypeScript**
  - Vercel無料プランと相性がよく、デプロイが非常に簡単。
- **Supabase (PostgreSQL + Auth + Storage)**
  - DB・Google認証・画像保存を無料枠で一体運用できる。
- **Tailwind CSS + Lucide Icons**
  - iOS風の余白多めUIを短期間で実装しやすい。
- **将来拡張性**
  - App Router構成でAPI Route / Server Components / Middleware拡張がしやすい。

## 2. システム構成図
```text
[スマホ/PCブラウザ]
   │
   ▼
[Vercel: Next.js]
   ├─ Middleware: 認証チェック
   ├─ Dashboard / CRUD画面
   ├─ API Route (/api/health)
   └─ OAuth Callback (/auth/callback)
           │
           ▼
      [Supabase]
      ├─ Auth (Google OAuth)
      ├─ Postgres (在庫・イベント)
      └─ Storage (画像)

不足アイテム → [既存イベント管理アプリ]（URL + クエリ）
```

## 3. DB設計
マイグレーション: `supabase/migrations/20260521_init.sql`

- `inventory_items`: 在庫本体
- `inventory_categories`: カテゴリ
- `events`: イベント
- `event_inventory_relations`: イベントと在庫の紐付け
- `inventory_items_view`: 一覧最適化ビュー（カテゴリ名・使用イベント数を集約）

## 4. 画面構成
- `/login`: Googleログイン
- `/dashboard`: 在庫一覧・不足警告・購入申請導線
- `/items/new`: 在庫追加
- `/items/[id]/edit`: 在庫編集

## 5. フォルダ構成
```text
app/
  (auth)/login/page.tsx
  auth/callback/route.ts
  dashboard/page.tsx
  items/new/page.tsx
  items/[id]/edit/page.tsx
  api/health/route.ts
components/
lib/
supabase/migrations/
types/
middleware.ts
```

## 6. 実装手順
1. 依存インストール: `npm install`
2. `.env.example` を `.env.local` にコピー
3. Supabaseプロジェクトを作成
4. SQL Editorで `supabase/migrations/20260521_init.sql` を実行
5. Supabase Auth > Providers > Google を有効化
6. `npm run dev`

## 7. 必要コード
- Supabaseクライアント: `lib/supabase.ts`
- 在庫状態算出: `lib/inventory.ts`
- 在庫一覧UI: `components/inventory-table.tsx`
- CRUDフォーム: `components/item-form.tsx`
- 認証制御: `middleware.ts`, `app/auth/callback/route.ts`

## 8. デプロイ方法（Vercel）
1. GitHubへpush
2. Vercelで「Add New Project」→ このリポジトリをImport
3. Environment Variables を設定
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_EVENT_APP_URL`
4. Supabase側のAuth URLを設定
   - Site URL: `https://<your-project>.vercel.app`
   - Redirect URL:
     - `https://<your-project>.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback`（ローカル開発用）
5. VercelでDeploy
6. デプロイ後に `/api/health` を開いて疎通確認

## 9. 将来的な拡張案
- Push通知（Supabase Edge Functions + FCM/APNs）
- 在庫履歴テーブル（入出庫ログ）
- Webhookによるイベント管理アプリ双方向連携
- 権限管理（管理者/閲覧者）
- PWA化（オフライン参照）
