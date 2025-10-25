import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useSupabase } from "@/hooks/use-supabase";
import { Link, useLocation } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useSupabase();
  const location = useLocation();
  
  const userData = {
    name: user?.user_metadata.name || "",
    email: user?.email || "",
    avatar: user?.user_metadata.picture || user?.user_metadata.avatar_url || "",
  };

  const navData = React.useMemo(() => ({
    navMain: [
      {
        url: "#",
        items: [
          {
            title: "Gestión de visitas",
            url: "/dashboard/gestion-de-visitas",
            role: "jefe_area | asesor",
            isActive: location.pathname.includes("/dashboard/gestion-de-visitas"),
          },
          {
            title: "Gestión de usuarios",
            url: "/dashboard/gestion-de-usuarios",
            role: "jefe_area",
            isActive: location.pathname.includes("/dashboard/gestion-de-usuarios"),
          },
          {
            title: "Historial de cambios",
            url: "/dashboard/historial-de-cambios",
            role: "jefe_area",
            isActive: location.pathname.includes("/dashboard/historial-de-cambios"),
          },
          {
            title: "Acerca de",
            url: "/dashboard/acerca-de",
            role: "jefe_area",
            isActive: location.pathname.includes("/dashboard/acerca-de"),
          },
        ],
      },
    ],
  }), [location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-[62.3px]">
        <div className="flex justify-center items-center">
          <img
            src="https://www.comfacauca.com/wp-content/uploads/media-1.svg"
            alt="logo-comfacauca"
            className="w-50 h-auto"
          />
        </div>
      </SidebarHeader>
      <hr className="w-11/12 border-[1.7px] border-gray-300 mx-auto" />
      <SidebarContent>
        {navData.navMain.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
