import Header from '@/app/components/Header';
import Link from 'next/link';
import { getArticles } from '@/lib/db/articles';

export const revalidate = 300; // re-fetch every 5 min

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black uppercase tracking-[0.3em]">Latest Updates</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-none mb-3">
            News &amp; <span className="text-[#42deef]">Articles</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Match reports, team updates, merch drops — everything Vamos.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-600">No articles yet. Check back soon.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="bg-[#111111] border border-[#1A1A1A] hover:border-[#42deef] transition-colors duration-300 group block overflow-hidden"
              >
                <div className="h-48 bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
                  {article.cover_image ? (
                    <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[#42deef] opacity-[0.03]" />
                      <div className="text-[#42deef] opacity-10 text-8xl font-black select-none">V</div>
                    </>
                  )}
                  <div className="absolute top-0 left-0 bg-[#42deef] text-[#0A0A0A] px-3 py-1 text-xs font-black uppercase tracking-widest">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-gray-600 text-xs mb-3 uppercase tracking-wider">
                    <span>{new Date(article.published_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>·</span>
                    <span>{article.read_time} min read</span>
                    <span>·</span>
                    <span>{article.author}</span>
                  </div>
                  <h2 className="text-white font-black text-xl mb-3 group-hover:text-[#42deef] transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-[#42deef] text-xs font-black uppercase tracking-widest">
                    Read More
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
