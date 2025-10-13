interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function AboutUsCard({ icon, title, description }: Props) {
  return (
    <div className="h-full bg-[#FAFDF4]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-[#DDE9BB] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 p-3 bg-[#6F8C1F] rounded-xl shadow-lg">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[#2E321B] break-words">
          {title}
        </h3>
      </div>
      <p className="text-sm sm:text-base text-[#475C1D] font-semibold leading-relaxed break-words">
        {description}
      </p>
    </div>
  );
}