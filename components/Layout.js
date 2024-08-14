import Head from 'next/head'
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Bar Curion</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-4">
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/">ホーム</Link></li>
            <li><Link href="/recipes">レシピ一覧</Link></li>
            <li><Link href="/graph">関係グラフ</Link></li>
            <li><Link href="/admin">管理画面</Link></li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="py-4 mt-8 border-t">
        <p>© 2024 Bar Curion</p>
      </footer>
    </div>
  )
}