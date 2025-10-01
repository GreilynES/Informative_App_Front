import * as Icons from "lucide-react";
export function LucideIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as any)[name] ?? Icons.HelpCircle;
  return <Icon className={className} />;
}
