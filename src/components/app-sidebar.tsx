import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Building2,
  Users,
  CalendarCheck,
  History,
  Info,
  LayoutDashboard,
} from "lucide-react";

import type { UserRole } from "@/types/supabase";
import { useSupabase } from "@/hooks/use-supabase";
import supabase from "@/lib/supabase";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

/**
 * App sidebar component
 * @param {React.ComponentProps<typeof Sidebar>} props - Props for the sidebar
 * @returns {React.FC} App sidebar component
 */
export const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  const { user, loading } = useSupabase();
  const location = useLocation();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const userData = {
    name: user?.user_metadata.name || "",
    email: user?.email || "",
    avatar: user?.user_metadata.picture || user?.user_metadata.avatar_url || "",
    role: userRole || "ADVISOR",
  };

  // Load user role
  useEffect(() => {
    const loadUserRole = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading user role:", error);
        return;
      }

      setUserRole(data?.role as UserRole);
    };

    loadUserRole();
  }, [user]);

  // Sidebar navigation items, memoized to avoid re-creating it on every render to improve performance
  const navData = useMemo(() => {
    // Define all navigation groups with their items
    const navigationGroups = [
      {
        title: "Administración",
        items: [
          {
            title: "Gestión de áreas",
            url: "/dashboard/gestion-de-areas",
            icon: Building2,
            roles: ["ADMIN"],
            isActive: location.pathname.includes("/dashboard/gestion-de-areas"),
          },
          {
            title: "Gestión de usuarios",
            url: "/dashboard/gestion-de-usuarios",
            icon: Users,
            roles: ["ADMIN", "CHIEF"],
            isActive: location.pathname.includes(
              "/dashboard/gestion-de-usuarios"
            ),
          },
        ],
      },
      {
        title: "Operaciones",
        items: [
          {
            title: "Gestión de visitas",
            url: "/dashboard/gestion-de-visitas",
            icon: CalendarCheck,
            roles: ["CHIEF", "ADVISOR"],
            isActive: location.pathname.includes(
              "/dashboard/gestion-de-visitas"
            ),
          },
          {
            title: "Historial de cambios",
            url: "/dashboard/historial-de-cambios",
            icon: History,
            roles: ["CHIEF"],
            isActive: location.pathname.includes(
              "/dashboard/historial-de-cambios"
            ),
          },
        ],
      },
      {
        title: "Información",
        items: [
          {
            title: "Acerca de",
            url: "/dashboard/acerca-de",
            icon: Info,
            roles: ["ADMIN", "CHIEF", "ADVISOR"],
            isActive: location.pathname.includes("/dashboard/acerca-de"),
          },
        ],
      },
    ];

    // Filter groups and items according to the user role
    const filteredGroups = navigationGroups
      .map((group) => ({
        ...group,
        items: userRole
          ? group.items.filter((item) => item.roles.includes(userRole))
          : [],
      }))
      .filter((group) => group.items.length > 0); // Keep groups with items

    return filteredGroups;
  }, [location.pathname, userRole]);

  if (loading || !userRole) {
    return (
      <Sidebar {...props} collapsible="icon">
        {/* Header Skeleton */}
        <SidebarHeader className="h-16 border-b border-sidebar-border bg-white">
          <div className="flex h-full items-center justify-center px-4 group-data-[collapsible=icon]:px-2">
            {/* Logo skeleton when sidebar is expanded */}
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse group-data-[collapsible=icon]:hidden" />

            {/* Icon skeleton when sidebar is collapsed */}
            <div className="hidden group-data-[collapsible=icon]:block size-10 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </SidebarHeader>

        {/* Content Skeleton */}
        <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-6">
          {/* Group 1: Administration */}
          <SidebarGroup className="mb-2 group-data-[collapsible=icon]:mb-6">
            <div className="px-2 mb-2">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="group-data-[collapsible=icon]:space-y-4">
                {[1, 2].map((i) => (
                  <SidebarMenuItem key={i}>
                    <div className="flex items-center gap-3 h-9 px-2 rounded-md group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:h-14">
                      <div className="size-5 bg-slate-200 rounded animate-pulse group-data-[collapsible=icon]:size-6" />
                      <div className="h-4 flex-1 bg-slate-200 rounded animate-pulse group-data-[collapsible=icon]:hidden" />
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Group 2: Operations */}
          <SidebarGroup className="mb-2 group-data-[collapsible=icon]:mb-6">
            <div className="px-2 mb-2">
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="group-data-[collapsible=icon]:space-y-4">
                {[1, 2].map((i) => (
                  <SidebarMenuItem key={i}>
                    <div className="flex items-center gap-3 h-9 px-2 rounded-md group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:h-14">
                      <div className="size-5 bg-slate-200 rounded animate-pulse group-data-[collapsible=icon]:size-6" />
                      <div className="h-4 flex-1 bg-slate-200 rounded animate-pulse group-data-[collapsible=icon]:hidden" />
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Group 3: Information */}
          <SidebarGroup className="mb-2 group-data-[collapsible=icon]:mb-6">
            <div className="px-2 mb-2">
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="group-data-[collapsible=icon]:space-y-4">
                <SidebarMenuItem>
                  <div className="flex items-center gap-3 h-9 px-2 rounded-md group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:h-14">
                    <div className="size-5 bg-slate-200 rounded animate-pulse group-data-[collapsible=icon]:size-6" />
                    <div className="h-4 flex-1 bg-slate-200 rounded animate-pulse group-data-[collapsible=icon]:hidden" />
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer skeleton */}
        <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
          <div className="flex items-center gap-3 h-12 px-2 rounded-md">
            <div className="size-8 bg-slate-200 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader className="h-16 border-b border-sidebar-border bg-white">
        <div className="flex h-full items-center justify-center px-4 group-data-[collapsible=icon]:px-2">
          {/* Logo when sidebar is expanded */}
          <div className="flex items-center justify-center w-full group-data-[collapsible=icon]:hidden">
            <img
              src="https://www.comfacauca.com/wp-content/uploads/media-1.svg"
              alt="Logo Comfacauca"
              className="h-10 w-auto object-contain transition-all duration-200"
            />
          </div>

          {/* Icon when sidebar is collapsed */}
          <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-slate-800 text-white shadow-md">
              <LayoutDashboard className="size-5" />
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-6">
        {navData.map((group, index) => (
          <SidebarGroup
            key={index}
            className="mb-2 group-data-[collapsible=icon]:mb-6"
          >
            <SidebarGroupLabel className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="group-data-[collapsible=icon]:space-y-4">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        tooltip={item.title}
                        className="transition-all duration-200 hover:enabled:translate-x-1 group-data-[collapsible=icon]:hover:enabled:translate-x-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:h-14"
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                        >
                          <Icon className="size-5 shrink-0 group-data-[collapsible=icon]:size-6" />
                          <span className="truncate group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
