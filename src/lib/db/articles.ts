import { createClient } from '@/lib/supabase/server';

export interface DBArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  paragraphs: string[];
  cover_image: string | null;
  category: 'Match Report' | 'Team News' | 'Merchandise' | 'Community';
  author: string;
  read_time: number;
  published_at: string;
}

export async function getArticles(): Promise<DBArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, cover_image, category, author, read_time, published_at, paragraphs')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('getArticles error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<DBArticle | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  return data ?? null;
}

export async function getArticleSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articles')
    .select('slug')
    .eq('published', true);
  return (data ?? []).map((a) => a.slug);
}
