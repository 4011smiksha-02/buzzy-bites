import { cn } from "@/lib/utils";
import {
  BarChart3,
  CalendarDays,
  ChefHat,
  Image,
  LogOut,
  Settings,
  UtensilsCrossed,
  X,
} from "lucide-react";

export type AdminTab =
  | "overview"
  | "reservations"
  | "menu"
  | "gallery"
  | "settings";

const NAV_ITEMS: {
  id: AdminTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "reservations", label: "Reservations", icon: CalendarDays },
  { id: "menu", label: "Menu", icon: ChefHat },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  restaurantName: string;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  restaurantName,
  onLogout,
  open,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          aria-hidden="true"
          role="presentation"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-card border-r border-border transition-transform duration-300",
          "lg:static lg:translate-x-0 lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <UtensilsCrossed className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground">
                Admin
              </span>
            </div>
            <p className="font-display font-semibold text-foreground text-sm truncate">
              {restaurantName || "My Restaurant"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              data-ocid={`admin.sidebar.${id}`}
              onClick={() => {
                onTabChange(id);
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-smooth",
                activeTab === id
                  ? "bg-primary text-primary-foreground shadow-warm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border">
          <button
            type="button"
            data-ocid="admin.logout_button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
