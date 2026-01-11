interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function AboutUsCard({ icon, title, description }: Props) {
  return (
    <div className="bg-[#FAFDF4]/95 backdrop-blur-md p-6 rounded-xl shadow-xl border border-[#DDE9BB]/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 will-change-transform">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-[#6F8C1F] rounded-xl mr-4 shadow-lg flex-shrink-0">{icon}</div>
        <h3 className="text-xl font-bold text-[#2E321B]">{title}</h3>
      </div>
      <p className="text-sm sm:text-base text-[#475C1D] font-semibold leading-relaxed break-words">
        {description}
      </p>
    </div>
  );
}