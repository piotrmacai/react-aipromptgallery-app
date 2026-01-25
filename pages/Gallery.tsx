import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, Lock } from 'lucide-react';
import { Header } from '../components/Header';
import { LensHero } from '../components/LensHero';
import { PromptModal } from '../components/PromptModal';
import { PremiumCta } from '../components/PremiumCta';
import { fetchPrompts } from '../utils/notionService';
import { ArtPromptItem } from '../types';
import { clsx } from 'clsx';

type DisplayItem = ArtPromptItem & { isLocked: boolean };

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<ArtPromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [numColumns, setNumColumns] = useState(() => {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width >= 1280) return 4;
    if (width >= 1024) return 3;
    if (width >= 640) return 2;
    return 1;
  });

  // URL Handling for deep linking via SLUG
  const [searchParams, setSearchParams] = useSearchParams();
  const deepLinkSlug = searchParams.get('prompt');

  const selectedItem = useMemo(() => {
    // Try to find by slug first, then ID for backward compatibility
    return items.find(i => i.slug === deepLinkSlug || i.id === deepLinkSlug) || null;
  }, [items, deepLinkSlug]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPrompts();

        if (data.length === 0) {
          setError("Connected to Notion, but no valid prompts found.");
        }

        setItems(data);
      } catch (err: any) {
        setError(err.message || 'Failed to connect to Notion.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setNumColumns(4);
      else if (width >= 1024) setNumColumns(3);
      else if (width >= 640) setNumColumns(2);
      else setNumColumns(1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.category));
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter(i => i.category === selectedCategory);
  }, [items, selectedCategory]);

  const visibleItems = useMemo(() => {
    const FREE_LIMIT = 39;
    const LOCKED_PREVIEW_COUNT = 9;

    const unlocked = filteredItems.slice(0, FREE_LIMIT).map(item => ({ ...item, isLocked: false }));
    const locked = filteredItems.slice(FREE_LIMIT, FREE_LIMIT + LOCKED_PREVIEW_COUNT).map(item => ({ ...item, isLocked: true }));

    // If we have fewer than FREE_LIMIT items, we just show what we have.
    // If we have items but not enough for full locked row, we show what we have.
    // If we absolutely want to enforce 9 "teaser" cards even if no data, we'd need fake data.
    // Assuming for now data is sufficient or we only lock real items.

    return [...unlocked, ...locked];
  }, [filteredItems]);

  const masonryColumns = useMemo(() => {
    const cols: DisplayItem[][] = Array.from({ length: numColumns }, () => []);
    visibleItems.forEach((item, index) => {
      cols[index % numColumns].push(item);
    });
    return cols;
  }, [visibleItems, numColumns]);

  const handleCardClick = (item: DisplayItem) => {
    if (item.isLocked) return;
    setSearchParams({ prompt: item.slug });
  };

  const closeModal = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <LensHero />

      <main className="container mx-auto px-4 mt-12 mb-24">
        <div className="mb-10 flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-all backdrop-blur-sm",
                selectedCategory === cat
                  ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                  : "border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="flex h-64 flex-col items-center justify-center text-red-400 text-center px-4">
            <AlertCircle className="mb-4 h-12 w-12 opacity-80" />
            <p className="max-w-md font-mono text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex gap-6 items-start">
              {masonryColumns.map((columnItems, colIndex) => (
                <div key={colIndex} className="flex-1 flex flex-col gap-6 min-w-0">
                  {columnItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item)}
                      className={clsx(
                        "group relative overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm shadow-lg transition-all w-full",
                        item.isLocked
                          ? "bg-slate-950/20 border-white/5 cursor-not-allowed opacity-60"
                          : "bg-slate-950/40 hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 cursor-pointer"
                      )}
                    >
                      <div className="w-full bg-black/20 font-none leading-none relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          className={clsx(
                            "w-full h-auto block",
                            item.isLocked && "grayscale blur-[2px] opacity-40"
                          )}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/1e293b/475569?text=No+Image';
                          }}
                        />
                        {item.isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <div className="bg-black/50 p-3 rounded-full border border-white/10 backdrop-blur-md">
                              <Lock className="w-6 h-6 text-white/50" />
                            </div>
                          </div>
                        )}
                      </div>

                      {!item.isLocked && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="mb-1 inline-block rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-950">
                              {item.category}
                            </span>
                            <h3 className="line-clamp-2 text-sm font-bold text-white leading-tight">{item.title}</h3>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-20">
              <PremiumCta />
            </div>
          </>
        )}
      </main>

      {selectedItem && (
        <PromptModal item={selectedItem} onClose={closeModal} />
      )}
    </div>
  );
};