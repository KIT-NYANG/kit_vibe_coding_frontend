import type { CategoryChip } from '../../entities/main/types'

interface CategoryChipRowProps {
  categories: CategoryChip[]
  selectedId: string
  onSelect: (id: string) => void
}

export const CategoryChipRow = ({ categories, selectedId, onSelect }: CategoryChipRowProps) => {
  return (
    <section aria-label="카테고리 필터">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {categories.map((c) => {
          const selected = c.id === selectedId
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={selected}
              className={`rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                selected
                  ? 'border-blue-500 bg-white text-blue-700 outline outline-1 outline-blue-200 focus-visible:outline-blue-500'
                  : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus-visible:outline-gray-400'
              }`}
              onClick={() => onSelect(c.id)}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
