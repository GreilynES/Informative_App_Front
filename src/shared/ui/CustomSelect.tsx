import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react"
import { Check, ChevronDown } from "lucide-react"

type Option = { value: string | number; label: string }
type Size = "sm" | "md"

type CustomSelectProps = {
  value: string | number
  onChange: (value: string | number) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  zIndex?: number
  buttonClassName?: string
  lockScroll?: boolean
  optionsClassName?: string
  size?: Size
}

const STYLES = {
  sm: {
    button: "py-1.5 pl-3 pr-7 rounded-md",
    text: "text-xs",
    iconWrap: "pr-2.5",
    icon: "h-3.5 w-3.5",
    optionsPanel: "mt-1.5 py-1.5 rounded-md",
    optionRow: "py-1.5 px-3 mx-1 text-xs rounded-md",
    checkIcon: "h-3.5 w-3.5",
  },
  md: {
    button: "py-2 pl-3.5 pr-10 rounded-md",
    text: "text-sm",
    iconWrap: "pr-3",
    icon: "h-4 w-4",
    optionsPanel: "mt-2 py-2 rounded-lg",
    optionRow: "py-2.5 px-4 mx-2 text-sm rounded-lg",
    checkIcon: "h-4 w-4",
  },
} as const

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  disabled = false,
  zIndex = 1000,
  buttonClassName = "",
  optionsClassName = "",
  size = "md", 
}: CustomSelectProps) {
  const s = STYLES[size]
  const selected = options.find((opt) => opt.value === value)

  const baseBtn =
    "relative w-full cursor-pointer bg-white text-left border shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

  const defaultBtn =
    `border-[#E6E1D6] hover:border-[#5B732E] focus:outline-none focus:ring-2 focus:ring-[#5B732E]/20 focus:border-[#5B732E] ${s.button}`

  return (
    <div className="relative">
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <>
            <ListboxButton className={`${baseBtn} ${defaultBtn} ${buttonClassName}`}>
              <span
                className={`block truncate ${s.text} ${
                  !selected ? "text-gray-400" : "text-[#2E321B] font-medium"
                }`}
              >
                {selected ? selected.label : placeholder}
              </span>

              <span className={`pointer-events-none absolute inset-y-0 right-0 flex items-center ${s.iconWrap}`}>
                <ChevronDown
                  className={`${s.icon} text-[#708C3E] transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <ListboxOptions
              modal={false}
              className={`absolute w-full select-panel hide-scrollbar-force bg-white shadow-xl border border-[#E6E1D6] focus:outline-none overscroll-contain ${s.optionsPanel} ${optionsClassName}`}
              style={{ zIndex }}
            >
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  className={`relative cursor-pointer select-none transition-all duration-150 data-[focus]:bg-[#E6EDC8] text-[#2E321B] ${s.optionRow}`}
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span className={`block truncate ${selected ? "font-semibold text-[#5B732E]" : "font-normal"}`}>
                        {option.label}
                      </span>
                      {selected && (
                        <Check className={`${s.checkIcon} text-[#6F8C1F] flex-shrink-0 ml-3`} aria-hidden="true" />
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
