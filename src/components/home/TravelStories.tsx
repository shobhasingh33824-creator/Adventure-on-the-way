import React from 'react';
import { initialBlogPosts } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { Clock, BookOpen, ArrowRight, User } from 'lucide-react';

export const TravelStories: React.FC = () => {
  const { t, showToast } = useApp();

  const handleReadBlog = (title: string) => {
    showToast(`Opening article: "${title}"`, 'info');
  };

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
            Field Notes & Tips
          </span>
          <h2 className="font-poppins font-black text-3xl sm:text-4xl text-zinc-900 dark:text-white">
            {t('storiesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Expert insights on acclimatization, packing, route guides, and safety protocols from our mountain team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initialBlogPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => handleReadBlog(post.title)}
              className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-zinc-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold shadow-xs">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="font-poppins font-bold text-base text-zinc-900 dark:text-white group-hover:text-[#FF6B35] transition leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-400 text-[11px] truncate max-w-[170px]">
                    By {post.author}
                  </span>
                  <span className="text-[#FF6B35] font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                    Read Story <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
