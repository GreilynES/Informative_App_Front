// components/Services/serviceCarouselButton.tsx
interface Props {
  direction: "left" | "right"
  onClick: () => void
  disabled: boolean
}

export default function ServicesCarouselButton({ direction, onClick, disabled }: Props) {
  const isLeft = direction === "left"
  const iconPath = isLeft ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute ${isLeft ? "left-[-1.5rem]" : "right-[-1.5rem]"} top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow-lg hover:scale-105 transition z-10 flex items-center justify-center disabled:opacity-50`}
    >
      <svg className="w-5 h-5 text-[#2E321B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
    </button>
  )
}
