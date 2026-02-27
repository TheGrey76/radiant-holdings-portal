import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Kanban, Send, Zap } from "lucide-react";

const menuItems = [
  { id: "overview", title: "Dashboard", icon: LayoutDashboard },
  { id: "contacts", title: "Contact Hub", icon: Users },
  { id: "pipeline", title: "Deal Pipeline", icon: Kanban },
  { id: "outreach", title: "Outreach", icon: Send },
];

interface CRMSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function CRMSidebar({ activeView, onViewChange }: CRMSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            {!collapsed && <span className="font-bold tracking-tight">Personal CRM</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    className={activeView === item.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
