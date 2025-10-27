import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IModuleHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: {
    label: string;
    icon?: LucideIcon;
  };
  stats?: {
    label: string;
    value: number | string;
  }[];
  action?: ReactNode;
}

/**
 * Module header component
 * @param {ModuleHeaderProps} props - Props for the module header
 * @returns {React.FC} Module header component
 */
export const ModuleHeader: React.FC<IModuleHeaderProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  stats,
  action,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 to-slate-700 p-6 text-white shadow-xl mb-6">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/10" />
      <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-10 translate-y-10 rounded-full bg-white/10" />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon + Title + Badge */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-2 ring-white/20 shrink-0">
              <Icon className="size-6" />
            </div>

            <div className="flex items-center gap-3 min-w-0 flex-1 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight truncate">
                {title}
              </h1>
              {badge && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs bg-white/10 backdrop-blur-sm border-white/30 text-white shrink-0"
                >
                  {badge.icon && <badge.icon className="h-3.5 w-3.5" />}
                  <span className="font-medium">{badge.label}</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Action */}
          {action && (
            <div className="shrink-0 [&_button]:bg-white [&_button]:text-slate-900 [&_button]:hover:enabled:bg-white [&_button]:border-0 [&_button]:shadow-md">
              {action}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 text-slate-200 leading-relaxed max-w-3xl">
          {description}
        </p>

        {/* Optional stats */}
        {stats && stats.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 flex items-baseline gap-2"
              >
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-slate-300 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
