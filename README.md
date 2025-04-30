# write2obsidianの使い方

## 概要
write2obsidianは、Obsidianのinboxフォルダを操作するためのMCPツールです。

## 主な機能
- inboxフォルダのページ一覧表示
- 新しいページの追加
- 既存ページの更新
- デバッグ情報の表示

## 使用例
### ページ一覧の表示
```bash
mcp_write2obsidian_list_pages_in_inbox
```

### 新規ページの追加
```bash
mcp_write2obsidian_add_page_to_inbox "ページ名" "ページの内容"
```

### ページの更新
```bash
mcp_write2obsidian_update_page_in_inbox "ページ名" "追加する内容"
```

## 注意点
- パスは実際の環境に合わせて変更してください
- ファイル名に使用できない文字（/など）は避けてください