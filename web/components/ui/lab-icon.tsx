import { Code2, Database, LayoutGrid, Send, Smartphone, Table2, type LucideProps } from "lucide-react";
import type { LabIconKey } from "@/lib/registry";

const map = {
  table: Table2,
  send: Send,
  database: Database,
  layout: LayoutGrid,
  code: Code2,
  smartphone: Smartphone,
} satisfies Record<LabIconKey, React.ComponentType<LucideProps>>;

export function LabIcon({ icon, ...props }: { icon: LabIconKey } & LucideProps) {
  const Icon = map[icon];
  return <Icon aria-hidden {...props} />;
}
