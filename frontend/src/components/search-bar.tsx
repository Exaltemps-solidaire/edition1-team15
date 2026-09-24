export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <label className="input input-lg w-full min-h-touch bg-base-100">
      <svg
        className="opacity-60"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        aria-label="Rechercher dans l'intranet"
        placeholder="Rechercher par mot-clé…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export { SearchBar }
