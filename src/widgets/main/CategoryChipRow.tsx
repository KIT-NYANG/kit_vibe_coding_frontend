import type { CategoryChip } from '../../entities/main/types'

interface CategoryChipRowProps {
  categories: CategoryChip[]
  selectedId: string
  onSelect: (id: string) => void
}

const ArrowIcon = () => (
  <svg
    aria-hidden
    className="h-5 w-5 text-palette-accent"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 5l7 7m0 0l-7 7m7-7H3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
)

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
              className={`group relative inline-flex items-center justify-start overflow-hidden rounded py-3 pl-4 pr-12 font-semibold text-palette-primary transition-all duration-150 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary bg-palette-accent/15 ${
                selected ? 'pl-10 pr-6' : 'hover:pl-10 hover:pr-6'
              }`}
              onClick={() => onSelect(c.id)}
            >
              <span
                aria-hidden
                className={`absolute bottom-0 left-0 h-1 w-full bg-palette-primary transition-all duration-150 ease-in-out ${
                  selected ? 'h-full' : 'group-hover:h-full'
                }`}
              />
              <span
                className={`absolute right-0 pr-4 duration-200 ease-out ${
                  selected ? 'translate-x-12' : 'group-hover:translate-x-12'
                }`}
              >
                <ArrowIcon />
              </span>
              <span
                className={`absolute left-0 pl-2.5 duration-200 ease-out ${
                  selected ? 'translate-x-0' : '-translate-x-12 group-hover:translate-x-0'
                }`}
              >
                <ArrowIcon />
              </span>
              <span
                className={`relative w-full text-left transition-colors duration-200 ease-in-out ${
                  selected ? 'text-palette-white' : 'text-palette-primary group-hover:text-palette-white'
                }`}
              >
                {c.label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
