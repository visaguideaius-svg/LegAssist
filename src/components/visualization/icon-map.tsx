import {
  Scale,
  AlertTriangle,
  Clock,
  CalendarDays,
  FileText,
  FolderOpen,
  WalletCards,
  ShieldAlert,
  Gavel,
  CircleCheck,
  UserRound,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  scales: Scale,
  warning: AlertTriangle,
  clock: Clock,
  calendar: CalendarDays,
  documents: FileText,
  folder: FolderOpen,
  money: WalletCards,
  shield: ShieldAlert,
  gavel: Gavel,
  checklist: CircleCheck,
  person: UserRound,
};

export default iconMap;
