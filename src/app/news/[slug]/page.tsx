import Header from '@/app/components/Header';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/db/articles';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return { title: article ? `${article.title} — Team Vamos` : 'Article Not Found' };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#42deef] text-xs uppercase tracking-widest font-black mb-10 transition-colors"
        >
          ← Back to News
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#42deef] text-[#0A0A0A] px-3 py-1 text-[10px] font-black uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-gray-600 text-xs uppercase tracking-widest">
            {new Date(article.published_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="text-gray-600 text-xs">· {article.read_time} min read</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-gray-400 text-lg mb-2">{article.excerpt}</p>
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-10">By {article.author}</p>

        <div className="h-px bg-[#1A1A1A] mb-10" />

        {article.cover_image && (
          <img src={article.cover_image} alt={article.title} className="w-full h-64 object-cover mb-10" />
        )}

        <div className="space-y-6">
          {article.paragraphs.map((para, i) => (
            <p key={i} className="text-gray-300 leading-relaxed text-base">{para}</p>
          ))}
        </div>

        <div className="h-px bg-[#1A1A1A] mt-12 mb-8" />

        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-[#42deef] text-xs uppercase tracking-widest font-black hover:gap-3 transition-all"
        >
          ← More Articles
        </Link>
      </article>
    </div>
  );
}
