interface Props {
  icon: React.ReactNode
  title: string
  description: string
}

export function AboutUsCard({ icon, title, description }: Props) {
  return (
    <div className="bg-[#FAFDF4]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-[#DDE9BB] transition-all hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-[#6F8C1F] rounded-xl mr-4 shadow-lg">{icon}</div>
        <h3 className="text-xl font-bold text-[#2E321B]">{title}</h3>
      </div>
      <p className="text-md text-[#475C1D] font-semibold leading-relaxed">{description}</p>
    </div>
  )
}
