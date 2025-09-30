import { LucideIcon } from "../common/lucideIcon";

interface BenefitItem { iconName: string; title: string; desc: string; }

export function BenefitsSection({ items }: { items: BenefitItem[] }) {
  return (
    <div className="py-16 px-4 bg-[#FAF9F5]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-12">Beneficios</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {items.map((item, i) => (
            <div className="text-center" key={i}>
              <div className="w-16 h-16 bg-[#E7EDC8]/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <LucideIcon name={item.iconName} className="w-8 h-8 text-[#A3853D]" />
              </div>
              <h3 className="text-xl font-semibold text-[#708C3E] mb-3">{item.title}</h3>
              <p className="text-[#475C1D]/90">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
