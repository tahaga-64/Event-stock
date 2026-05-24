import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemForm } from '@/components/item-form';

// next/navigation のモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Supabase のモック（DB通信なし）
jest.mock('@/lib/supabase-browser', () => ({
  getSupabaseBrowser: () => ({
    from: () => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
      update: () => ({ eq: jest.fn().mockResolvedValue({ error: null }) }),
    }),
  }),
}));

describe('ItemForm - 在庫数量入力', () => {
  describe('現在庫 (current_stock)', () => {
    test('初期値が0で表示される', () => {
      render(<ItemForm mode="create" />);
      const input = screen.getByLabelText('現在庫') as HTMLInputElement;
      expect(input).toHaveValue(0);
    });

    test('数値を入力すると表示が更新される', () => {
      render(<ItemForm mode="create" />);
      const input = screen.getByLabelText('現在庫') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '10' } });
      expect(input).toHaveValue(10);
    });

    test('initialデータがある場合に初期値が反映される', () => {
      render(
        <ItemForm
          mode="edit"
          initial={{ id: '1', name: '延長コード', current_stock: 5, minimum_stock: 3, category_name: '電源', used_events_count: 0, memo: '' }}
        />
      );
      const input = screen.getByLabelText('現在庫') as HTMLInputElement;
      expect(input).toHaveValue(5);
    });
  });

  describe('最低必要在庫 (minimum_stock)', () => {
    test('初期値が0で表示される', () => {
      render(<ItemForm mode="create" />);
      const input = screen.getByLabelText('最低必要在庫') as HTMLInputElement;
      expect(input).toHaveValue(0);
    });

    test('数値を入力すると表示が更新される', () => {
      render(<ItemForm mode="create" />);
      const input = screen.getByLabelText('最低必要在庫') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '8' } });
      expect(input).toHaveValue(8);
    });
  });

  describe('不足予定数の自動計算', () => {
    test('minimum > current のとき差分が表示される', () => {
      render(<ItemForm mode="create" />);
      fireEvent.change(screen.getByLabelText('現在庫'), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText('最低必要在庫'), { target: { value: '10' } });
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    test('current >= minimum のとき不足数は0になる', () => {
      render(<ItemForm mode="create" />);
      fireEvent.change(screen.getByLabelText('現在庫'), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText('最低必要在庫'), { target: { value: '5' } });
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('不足数がゼロ未満にならない（マイナス表示なし）', () => {
      render(<ItemForm mode="create" />);
      fireEvent.change(screen.getByLabelText('現在庫'), { target: { value: '100' } });
      fireEvent.change(screen.getByLabelText('最低必要在庫'), { target: { value: '1' } });
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('使用イベント回数 (used_events_count)', () => {
    test('初期値が0で表示される', () => {
      render(<ItemForm mode="create" />);
      const input = screen.getByLabelText(/使用イベント回数/) as HTMLInputElement;
      expect(input).toHaveValue(0);
    });

    test('数値を入力すると表示が更新される', () => {
      render(<ItemForm mode="create" />);
      const input = screen.getByLabelText(/使用イベント回数/) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '3' } });
      expect(input).toHaveValue(3);
    });
  });

  describe('バリデーション', () => {
    test('アイテム名が空のまま保存するとエラーが表示される', () => {
      render(<ItemForm mode="create" />);
      fireEvent.click(screen.getByRole('button', { name: '追加する' }));
      expect(screen.getByText('アイテム名は必須です')).toBeInTheDocument();
    });

    test('カテゴリが空のまま保存するとエラーが表示される', () => {
      render(<ItemForm mode="create" />);
      fireEvent.change(screen.getByLabelText('アイテム名'), { target: { value: 'テスト品' } });
      fireEvent.click(screen.getByRole('button', { name: '追加する' }));
      expect(screen.getByText('カテゴリ名は必須です')).toBeInTheDocument();
    });
  });
});
