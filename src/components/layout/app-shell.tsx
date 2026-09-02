import { Menu, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import mindskitLogo from "@/assets/mindskit.png";
import { Footer } from "@/components/layout/footer";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { QuickActions } from "@/components/layout/quick-actions";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="app-gradient-bg pointer-events-none fixed inset-0 -z-10"
      />
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-4">
            <SheetHeader className="p-0 pb-4">
              <SheetTitle asChild>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-base font-semibold">
                  <Wrench className="size-5 text-primary" />
                  MindsKit
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3">
              <QuickActions sidebar />
              <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold">
          <img src={mindskitLogo} alt="" className="size-9 object-contain" />
          MindsKit
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
            v0.1.0
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-60 shrink-0 flex-col gap-3 overflow-y-auto border-r border-sidebar-border bg-sidebar p-4 lg:flex">
          <QuickActions sidebar />
          <SidebarNav />
        </aside>
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
