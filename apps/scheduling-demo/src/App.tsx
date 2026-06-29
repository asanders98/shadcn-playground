import { SidebarProvider, SidebarTrigger, TooltipProvider } from "@acme/ui";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppSidebar } from "./AppSidebar";
import { AttendanceView } from "./views/AttendanceView";
import { ComponentsView } from "./views/ComponentsView";
import { MyCompanyView } from "./views/MyCompanyView";
import { PlanningView } from "./views/PlanningView";
import { PoolsView } from "./views/PoolsView";

export function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          {/* The trigger only shows on mobile (the library hides it ≥ md). */}
          <header className="flex h-14 items-center gap-2 border-b border-border px-4 md:hidden">
            <SidebarTrigger />
            <span className="font-semibold text-foreground">Acme Scheduling</span>
          </header>
          <main className="flex-1 p-6 md:p-10">
            <Routes>
              <Route path="/" element={<Navigate to="/planning" replace />} />
              <Route path="/planning" element={<PlanningView />} />
              <Route path="/attendance" element={<AttendanceView />} />
              <Route path="/pools" element={<PoolsView />} />
              <Route path="/my-company" element={<MyCompanyView />} />
              <Route path="/components" element={<ComponentsView />} />
              {/* Unknown hash → back to the default landing view. */}
              <Route path="*" element={<Navigate to="/planning" replace />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
