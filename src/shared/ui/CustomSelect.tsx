// CustomSelect.tsx
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'

type Option = {
  value: string | number
  label: string
}

type CustomSelectProps = {
  value: string | number
  onChange: (value: string | number) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  zIndex?: number 
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  disabled = false,
  zIndex = 10 // 👈 Valor por defecto
}: CustomSelectProps) {
  const selected = options.find(opt => opt.value === value)

  return (
    <div className="relative">
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <>
            <ListboxButton 
              className="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-4 pr-10 text-left border border-[#E6E1D6] shadow-sm hover:border-[#5B732E] focus:outline-none focus:ring-2 focus:ring-[#5B732E]/20 focus:border-[#5B732E] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={`block truncate text-sm ${!selected ? 'text-gray-400' : 'text-[#2E321B] font-medium'}`}>
                {selected ? selected.label : placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown 
                  className={`h-4 w-4 text-[#708C3E] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  aria-hidden="true" 
                />
              </span>
            </ListboxButton>

            <ListboxOptions
              modal={false}
              className="absolute mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white py-2 shadow-xl border border-[#E6E1D6] focus:outline-none"
              style={{ zIndex }} // 👈 Usa el z-index dinámico
            >
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  className="relative cursor-pointer select-none py-2.5 px-4 mx-2 rounded-lg transition-all duration-150 data-[focus]:bg-[#E6EDC8] text-[#2E321B] text-sm"
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span className={`block truncate ${selected ? 'font-semibold text-[#5B732E]' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {selected && (
                        <Check className="h-4 w-4 text-[#6F8C1F] flex-shrink-0 ml-3" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </>
        )}
      </Listbox>
    </div>
  )
}