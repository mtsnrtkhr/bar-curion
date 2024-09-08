# Bar Curion - Recipe Search
このアプリケーションは、様々なカクテルのレシピを検索できるWebアプリケーションです。  
https://mtsnrtkhr.github.io/bar-curion/

## 機能

- カクテル名、材料名などのキーワードからレシピを検索
- レシピの詳細情報の表示（材料、作り方、画像など）

## 使用技術

- フロントエンド：Next.js, React, TypeScript, Tailwind CSS

## セットアップ

1. このリポジトリをクローンします。  
`git clone https://github.com/mtsnrtkhr/bar-curion.git`

2. 依存関係をインストールします。  
`cd bar-curion`  
`npm install`  

3. アプリケーションを起動します。  
`npm run dev`

4. ブラウザで `http://localhost:3000` にアクセスし、アプリケーションを使用できます。

## ライセンス

本アプリケーションは、MITライセンスの下で公開されています。詳細は[LICENSE](./LICENSE)ファイルを参照してください。

また、本アプリケーションで使用しているオープンソースライブラリのライセンス情報については、[licenses.md](./licenses.md)ファイルにまとめています。

抽出条件  
license-report --output=markdown --config license-report-config.json| % { $_ -replace 'git\+', '' -replace 'ssh://', '' -replace 'git://', 'https://' -replace 'git@', 'https://' } | Set-Content license.md