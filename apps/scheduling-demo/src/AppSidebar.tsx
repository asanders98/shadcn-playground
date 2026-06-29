import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@acme/ui";
import { Link, useLocation } from "react-router-dom";

import { COMPANY } from "./data/mock";
import { NAV } from "./nav";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  // On mobile the sidebar is a drawer; tapping a nav item should close it.
  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Acme Scheduling
          </p>
          {/* Company switcher — single company in the demo. */}
          <Select defaultValue={COMPANY.id}>
            <SelectTrigger className="w-full" aria-label="Switch company">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={COMPANY.id}>{COMPANY.name}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {NAV.map(({ to, label, icon: Icon }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton asChild isActive={pathname === to}>
                <Link to={to} onClick={handleNavigate}>
                  <Icon />
                  {label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <span className="px-2 text-xs text-muted-foreground">Acme · demo</span>
      </SidebarFooter>
    </Sidebar>
  );
}
