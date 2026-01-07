import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowDown } from 'lucide-react';
import { Header } from '../components/Header';
import { LensHero } from '../components/LensHero';
import { PromptModal } from '../components/PromptModal';
import { fetchPrompts } from '../utils/notionService';
import { ArtPromptItem } from '../types';
import { clsx } from 'clsx';

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<ArtPromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(28);
  
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

  // Reset pagination when category changes
  useEffect(() => {
    setVisibleCount(28);
  }, [selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.category));
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter(i => i.category === selectedCategory);
  }, [items, selectedCategory]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const masonryColumns = useMemo(() => {
    const cols: ArtPromptItem[][] = Array.from({ length: numColumns }, () => []);
    visibleItems.forEach((item, index) => {
      cols[index % numColumns].push(item);
    });
    return cols;
  }, [visibleItems, numColumns]);

  const handleCardClick = (item: ArtPromptItem) => {
    // Use slug for URL
    setSearchParams({ prompt: item.slug });
  };

  const closeModal = () => {
    setSearchParams({});
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 14);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <LensHero />

      <main className="container mx-auto px-4 mt-12">
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
                      className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-sm shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 cursor-pointer w-full"
                    >
                      <div className="w-full bg-black/20 font-none leading-none">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-auto block"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/1e293b/475569?text=No+Image';
                          }}
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      
                      <div className="absolute bottom-0 left-0 w-full p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="mb-1 inline-block rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-950">
                          {item.category}
                        </span>
                        <h3 className="line-clamp-2 text-sm font-bold text-white leading-tight">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {visibleCount < filteredItems.length && (
              <div className="mt-16 flex justify-center">
                 <button
                   onClick={handleShowMore}
                   className="group relative overflow-hidden rounded-full px-8 py-3 transition-all hover:scale-105 active:scale-95"
                 >
                   <div className="absolute inset-0 border border-primary/30 bg-primary/10 backdrop-blur-md transition-colors group-hover:bg-primary/20 group-hover:border-primary/50" />
                   <div className="absolute inset-0 opacity-0 shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-opacity group-hover:opacity-100" />
                   <span className="relative z-10 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary group-hover:text-white">
                     Show More
                     <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                   </span>
                 </button>
              </div>
            )}
          </>
        )}
      </main>

      {selectedItem && (
        <PromptModal item={selectedItem} onClose={closeModal} />
      )}
    </div>
  );
};