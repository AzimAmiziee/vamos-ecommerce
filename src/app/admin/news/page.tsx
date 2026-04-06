'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type Category = 'Match Report' | 'Team News' | 'Merchandise' | 'Community';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  paragraphs: string[];
  cover_image: string | null;
  category: Category;
  author: string;
  read_time: number;
  published: boolean;
  published_at: string;
}

const CATEGORIES: Category[] = ['Match Report', 'Team News', 'Merchandise', 'Community'];
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/storage`;

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  paragraphs: [''],
  cover_image: '',
  category: 'Team News' as Category,
  author: 'Team Vamos Media',
  read_time: 3,
  published: true,
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('articles')
      .select('id, slug, title, excerpt, cover_image, category, author, read_time, published, published_at, paragraphs')
      .order('published_at', { ascending: false });
    setArticles(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-generate slug from title
  function handleTitleChange(title: string) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setForm(f => ({ ...f, title, slug: editingId ? f.slug : slug }));
  }

  // Upload cover image to Supabase Storage bucket "news"
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    if (file.type !== 'image/webp') {
      setUploadError('Only .webp files are accepted.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be under 5 MB.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const path = `news/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('storage').upload(path, file, {
      contentType: 'image/webp',
      upsert: false,
    });

    if (error) {
      setUploadError(error.message);
    } else {
      setForm(f => ({ ...f, cover_image: `${STORAGE_URL}/${path}` }));
    }
    setUploading(false);
  }

  // Paragraph helpers
  function setParagraph(index: number, value: string) {
    setForm(f => {
      const paragraphs = [...f.paragraphs];
      paragraphs[index] = value;
      return { ...f, paragraphs };
    });
  }
  function addParagraph() {
    setForm(f => ({ ...f, paragraphs: [...f.paragraphs, ''] }));
  }
  function removeParagraph(index: number) {
    setForm(f => ({ ...f, paragraphs: f.paragraphs.filter((_, i) => i !== index) }));
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setUploadError('');
    setShowForm(true);
  }

  function openEdit(article: Article) {
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt ?? '',
      paragraphs: article.paragraphs.length ? article.paragraphs : [''],
      cover_image: article.cover_image ?? '',
      category: article.category,
      author: article.author,
      read_time: article.read_time,
      published: article.published,
    });
    setEditingId(article.id);
    setUploadError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setUploadError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function save() {
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      paragraphs: form.paragraphs.filter(p => p.trim()),
      cover_image: form.cover_image || null,
      category: form.category,
      author: form.author.trim(),
      read_time: form.read_time,
      published: form.published,
    };

    if (editingId) {
      const { error } = await supabase.from('articles').update(payload).eq('id', editingId);
      if (error) { setUploadError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('articles').insert({ ...payload, published_at: new Date().toISOString() });
      if (error) { setUploadError(error.message); setSaving(false); return; }
    }

    await load();
    closeForm();
    setSaving(false);
  }

  async function togglePublish(id: string, current: boolean) {
    await createClient().from('articles').update({ published: !current }).eq('id', id);
    setArticles(prev => prev.map(a => a.id === id ? { ...a, published: !current } : a));
  }

  async function deleteArticle(id: string) {
    setDeletingId(id);
    await createClient().from('articles').delete().eq('id', id);
    setArticles(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  }

  const CATEGORY_COLOR: Record<Category, string> = {
    'Match Report':  'bg-blue-50 text-blue-600',
    'Team News':     'bg-[#42deef]/10 text-[#42deef]',
    'Merchandise':   'bg-purple-50 text-purple-600',
    'Community':     'bg-emerald-50 text-emerald-600',
  };

  const articleToDelete = articles.find(a => a.id === confirmDeleteId);

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#42deef] text-[11px] font-bold uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">News</h1>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#42deef] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0bb8d4] transition-colors shadow-sm"
        >
          + New Article
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-2xl flex flex-col max-h-[90vh] rounded-xl shadow-xl">

            {/* Form header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-gray-800 font-bold text-[14px]">
                {editingId ? 'Edit Article' : 'New Article'}
              </h2>
              <button onClick={closeForm} className="text-gray-300 hover:text-gray-600 text-lg leading-none transition-colors">✕</button>
            </div>

            <div className="px-6 py-6 space-y-5 overflow-y-auto flex-1">

              {/* Title */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Title *</label>
                <input
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Article title..."
                  className="w-full bg-white border border-gray-200 text-gray-800 text-[12px] px-4 py-2.5 focus:outline-none focus:border-[#42deef] placeholder-gray-300"
                />
                {form.slug && (
                  <p className="text-gray-300 text-[10px] font-mono mt-1">/{form.slug}</p>
                )}
              </div>

              {/* Category + Author + Read time */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                    className="w-full bg-white border border-gray-200 text-gray-800 text-[11px] px-3 py-2.5 focus:outline-none focus:border-[#42deef]"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Author</label>
                  <input
                    value={form.author}
                    onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full bg-white border border-gray-200 text-gray-800 text-[11px] px-3 py-2.5 focus:outline-none focus:border-[#42deef]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Read Time (min)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.read_time}
                    onChange={e => setForm(f => ({ ...f, read_time: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-white border border-gray-200 text-gray-800 text-[11px] px-3 py-2.5 focus:outline-none focus:border-[#42deef]"
                  />
                </div>
              </div>

              {/* Cover image upload */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Cover Image</label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <label className={`flex items-center gap-3 border border-dashed border-gray-200 px-4 py-3 cursor-pointer hover:border-[#42deef] rounded-lg transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <span className="text-[11px] font-medium text-gray-400">
                        {uploading ? 'Uploading...' : 'Choose .webp file (max 5 MB)'}
                      </span>
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".webp,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      value={form.cover_image}
                      onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
                      placeholder="Or paste image URL directly..."
                      className="w-full bg-white border border-gray-200 text-gray-800 text-[11px] px-3 py-2 focus:outline-none focus:border-[#42deef] placeholder-gray-300 font-mono"
                    />
                    {uploadError && (
                      <p className="text-red-400 text-[10px]">{uploadError}</p>
                    )}
                    {form.cover_image && !uploadError && (
                      <p className="text-[#42deef] text-[10px] truncate">✓ {form.cover_image.split('/').pop()}</p>
                    )}
                  </div>
                  {form.cover_image && (
                    <div className="w-16 h-16 shrink-0 bg-black overflow-hidden border border-white/10">
                      <Image src={form.cover_image} alt="cover" width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Short summary shown in article cards..."
                  rows={2}
                  className="w-full bg-white border border-gray-200 text-gray-800 text-[12px] px-4 py-2.5 focus:outline-none focus:border-[#42deef] placeholder-gray-300 resize-none"
                />
              </div>

              {/* Paragraphs */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Content Paragraphs</label>
                <div className="space-y-2">
                  {form.paragraphs.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <textarea
                        value={p}
                        onChange={e => setParagraph(i, e.target.value)}
                        placeholder={`Paragraph ${i + 1}...`}
                        rows={3}
                        className="flex-1 bg-white border border-gray-200 text-gray-800 text-[12px] px-4 py-2.5 focus:outline-none focus:border-[#42deef] placeholder-gray-300 resize-none"
                      />
                      {form.paragraphs.length > 1 && (
                        <button
                          onClick={() => removeParagraph(i)}
                          className="text-red-300 hover:text-red-500 text-lg leading-none px-1 self-start mt-2 transition-colors"
                        >✕</button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addParagraph}
                    className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300 transition-all"
                  >
                    + Add Paragraph
                  </button>
                </div>
              </div>

              {/* Published toggle */}
              <div className="flex items-center gap-3">
                <div
                  onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                  className={`w-11 h-6 rounded-full cursor-pointer transition-colors flex-shrink-0 flex items-center px-1 ${form.published ? 'bg-[#42deef]' : 'bg-white/10'}`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${form.published ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-[11px] text-white/50 font-black uppercase tracking-widest">
                  {form.published ? 'Published' : 'Draft'}
                </span>
              </div>

            </div>

            {/* Form actions */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={save}
                disabled={saving || uploading || !form.title.trim()}
                className="flex-1 bg-[#42deef] text-white text-[12px] font-semibold py-2.5 rounded-lg hover:bg-[#0bb8d4] transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-sm"
              >
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Article'}
              </button>
              <button
                onClick={closeForm}
                className="px-6 text-[12px] font-semibold text-gray-400 border border-gray-200 rounded-lg hover:text-gray-700 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDeleteId && articleToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 text-center mb-1">Delete Article?</h3>
            <p className="text-[12px] text-gray-400 text-center mb-1">
              <span className="font-semibold text-gray-600">&ldquo;{articleToDelete.title}&rdquo;</span>
            </p>
            <p className="text-[11px] text-red-400 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setConfirmDeleteId(null); deleteArticle(confirmDeleteId); }}
                disabled={deletingId === confirmDeleteId}
                className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-40"
              >
                {deletingId === confirmDeleteId ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
          <span className="text-gray-400 text-[12px] font-semibold">{articles.length} articles</span>
        </div>

        {loading ? (
          <div className="p-8 text-gray-300 text-sm text-center">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-gray-300 text-sm text-center">No articles yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Cover', 'Title', 'Category', 'Author', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="w-14 h-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
                      {article.cover_image ? (
                        <Image src={article.cover_image} alt={article.title} width={56} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-[9px]">No img</div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-[12px] font-semibold text-gray-800 max-w-[200px] truncate">{article.title}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{article.slug}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${CATEGORY_COLOR[article.category]}`}>
                      {article.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-gray-400">{article.author}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => togglePublish(article.id, article.published)}
                      className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full transition-colors ${
                        article.published
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {article.published ? 'Live' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-[11px] text-gray-400">
                    {new Date(article.published_at).toLocaleDateString('en-MY')}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(article)} className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(article.id)}
                        className="text-[11px] font-semibold text-red-300 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
