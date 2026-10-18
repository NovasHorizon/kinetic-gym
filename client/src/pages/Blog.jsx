import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Arrow } from '../components/ui';

// Posts come from WordPress (headless CMS) through its REST API. Set VITE_WP_API in .env.local.
const WP_API = import.meta.env.VITE_WP_API;
const textOf = (html) => new DOMParser().parseFromString(html, 'text/html').body.textContent.trim();

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!WP_API) return;
    fetch(`${WP_API}/posts?per_page=9&_embed=wp:featuredmedia`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`WordPress returned ${r.status}`))))
      .then(setPosts)
      .catch(setError);
  }, []);

  return (
    <>
      <PageHeader label="(Journal) From our coaches" title="Training journal" accent={['journal']}>
        Training, food and recovery notes. Written in WordPress, shown here with React.
      </PageHeader>
      <section className="px-4 pb-24 md:px-8">
        {!WP_API && <p className="text-bone/60">The journal isn't connected to WordPress yet (set VITE_WP_API).</p>}
        {error && <p className="text-volt">Couldn't load posts: {error.message}</p>}
        {WP_API && !posts && !error && <p className="label">Loading…</p>}
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post, i) => {
            const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            return (
              <a key={post.id} href={post.link} target="_blank" rel="noreferrer" className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-ink-2">
                  {image && <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                </div>
                <p className="label mt-5">{String(i + 1).padStart(2, '0')} · {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <h2 className="mt-2 font-display text-3xl uppercase leading-[0.95] transition-colors group-hover:text-volt">{textOf(post.title.rendered)}</h2>
                <p className="mt-3 line-clamp-3 text-sm text-bone/65">{textOf(post.excerpt.rendered)}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em]">Read <Arrow /></span>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
