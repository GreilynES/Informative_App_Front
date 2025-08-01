export default function ServicesCarouselIndicator({ count, current, isTransitioning, onClick }: any) {
  return (
    <div className="flex justify-center mt-10 space-x-2">
      {Array.from({ length: count }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => !isTransitioning && onClick(idx)}
          className={`w-3 h-3 rounded-full ${idx === current ? "bg-[#d8b769]" : "bg-gray-300"}`}
        />
      ))}
    </div>
  )
}
