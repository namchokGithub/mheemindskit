import { Menu, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import mindskitLogo from "@/assets/mindskit.png";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur">
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
          <SheetContent side="left" className="w-72 p-4">
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
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold">
          <img src={mindskitLogo} alt="" className="size-9 object-contain" />
          MindsKit
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-border p-4 lg:block">
          <SidebarNav />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
