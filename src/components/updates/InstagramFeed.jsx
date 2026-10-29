import { useEffect, useState } from 'react'
import { ExternalLink, Heart, MessageCircle } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, getInstagramPosts } from '../../services/mockDatabase'

const dateFmt = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' })

export default function InstagramFeed() {
  const [posts, setPosts] = useState([])
  const ref = useScrollReveal([posts.length])

  useEffect(() => {
    getInstagramPosts().then(setPosts)
  }, [])

  return (
    <section id="actualizaciones" className="scroll-mt-24 pb-16 sm:pb-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">Actualizaciones</h2>
          <p className="mt-1 text-[#111111]/60">Lo último que publicamos en Instagram: preventas, drops y novedades de la tienda.</p>
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.06)] bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
        >
          Seguir a @{INSTAGRAM_HANDLE} <ExternalLink size={14} />
        </a>
      </div>

      <div ref={ref} className="grid gap-3 sm:grid-cols-3 lg:gap-4">
        {posts.map((post) => (
          <a
            key={post.id}
            data-reveal
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-[24px] border border-[rgba(0,0,0,0.06)] bg-white p-2.5 shadow-[0_12px_32px_-8px_rgba(17,17,17,0.06)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_28px_48px_-16px_rgba(17,17,17,0.16)]"
          >
            <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[#F8F9FA]">
              <img
                src={post.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${post.tag === 'Preventa' ? 'bg-[#FF6B00] text-white' : 'bg-white/90 text-[#111111]'}`}>
                {post.tag}
              </span>
            </div>
            <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
              <p className="line-clamp-3 text-sm text-[#111111]/80">{post.caption}</p>
              <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-[#111111]/50">
                <span className="inline-flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
                <span className="inline-flex items-center gap-1"><MessageCircle size={14} /> {post.comments}</span>
                <time dateTime={post.date} className="ml-auto">{dateFmt.format(new Date(`${post.date}T12:00:00`))}</time>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
