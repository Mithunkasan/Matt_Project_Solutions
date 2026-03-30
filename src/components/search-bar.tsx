interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  color: 'blue' | 'red' | 'orange'
}

export function SearchBar({ placeholder, value, onChange, color }: SearchBarProps) {
  const colorClasses = {
    blue: 'focus:ring-[#12498b]',
    red: 'focus:ring-[#b12222]',
    orange: 'focus:ring-[#cb773b]'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${colorClasses[color]}`}
      />
    </div>
  )
}