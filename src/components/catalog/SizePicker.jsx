export default function SizePicker({ sizes, value, onChange, large = false }) {
  return (
    <div role="radiogroup" aria-label="Talla" className="flex flex-wrap gap-1.5">
      {sizes.map((s) => {
        const active = value === s
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={(e) => {
              e.stopPropagation()
              onChange(s)
            }}
            className={`rounded-full font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00] ${
              large ? 'h-11 min-w-11 px-4 text-sm' : 'h-8 min-w-8 px-2.5 text-xs'
            } ${
              active
                ? 'bg-[#111111] text-white'
                : 'border border-[rgba(0,0,0,0.06)] bg-white hover:border-[#FF6B00] hover:text-[#FF6B00]'
            }`}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}
