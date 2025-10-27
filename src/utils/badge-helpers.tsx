import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import { ACTION_BADGE_CONFIG, STATUS_BADGE_CONFIG } from "./constants";
import { translateAction, translateStatus } from "./translators";
import type { VisitStatus } from "@/types/supabase";

/**
 * Get action badge component
 * @param {string} action - Action type
 * @returns {JSX.Element} Badge component with action
 */
export const getActionBadge = (action: string) => {
  const badgeConfig = ACTION_BADGE_CONFIG[action] || {
    variant: "outline" as const,
    color: "",
  };

  return (
    <Badge variant={badgeConfig.variant} className={badgeConfig.color}>
      {translateAction(action)}
    </Badge>
  );
};

/**
 * Get status badge component
 * @param {string} status - Status type
 * @returns {JSX.Element} Badge component with status
 */
export const getStatusBadge = (status: string) => {
  const badgeConfig = STATUS_BADGE_CONFIG[status] || {
    variant: "outline" as const,
  };

  return (
    <Badge
      variant={badgeConfig.variant}
      className={badgeConfig.className || ""}
    >
      {translateStatus(status)}
    </Badge>
  );
};

/**
 * Get visit status badge component with icon
 * @param {VisitStatus} status - Visit status type
 * @returns {JSX.Element} Badge component with status and icon
 */
export const getVisitStatusBadge = (status: VisitStatus) => {
  const statusConfig: Record<
    VisitStatus,
    {
      label: string;
      variant: "info" | "warning" | "success" | "destructive";
      icon: LucideIcon;
    }
  > = {
    SCHEDULED: { label: "Programada", variant: "info", icon: Clock },
    IN_PROGRESS: {
      label: "En Progreso",
      variant: "warning",
      icon: PlayCircle,
    },
    COMPLETED: {
      label: "Completada",
      variant: "success",
      icon: CheckCircle2,
    },
    CANCELLED: { label: "Cancelada", variant: "destructive", icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
