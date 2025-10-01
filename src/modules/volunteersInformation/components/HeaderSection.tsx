interface HeaderSectionProps { title: string; description: string; }
export function HeaderSection({ title, description }: HeaderSectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#F5F8E6] via-[#F5F8E6] to-[#F5F8E6] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[#475C1D]/80 mb-6">{title}</h1>
        <p className="text-lg text-[#2E321B] max-w-3xl mx-auto">{description}</p>
      </div>
    </div>
  );
}
