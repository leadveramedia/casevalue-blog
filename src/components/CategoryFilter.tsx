'use client';

import { useState, useEffect } from 'react';

interface CategoryFilterProps {
  categories: string[];
}

function formatCategory(category: string): string {
  return category === 'all'
    ? 'All Posts'
    : category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter posts on the client side
  useEffect(() => {
    const postsGrid = document.getElementById('posts-grid');
    if (!postsGrid) return;

    const posts = postsGrid.querySelectorAll('[data-categories]');
    posts.forEach((post) => {
      const postCategories = post.getAttribute('data-categories')?.split(',') || [];
      const shouldShow = selectedCategory === 'all' || postCategories.includes(selectedCategory);
      (post as HTMLElement).style.display = shouldShow ? 'block' : 'none';
    });
  }, [selectedCategory]);

  return (
    <div className="mb-10 flex flex-wrap gap-3 justify-center">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
            selectedCategory === category
              ? 'bg-gradient-gold text-text-dark shadow-glow-gold-soft'
              : 'bg-card/50 text-text/70 hover:bg-card border border-card-border'
          }`}
        >
          {formatCategory(category)}
        </button>
      ))}
    </div>
  );
}
