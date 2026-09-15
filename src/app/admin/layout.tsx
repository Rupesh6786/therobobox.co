
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Box,
  Wrench,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Bot,
  MessageSquareQuote,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { app } from "@/lib/firebase";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/kits", label: "Kits", icon: Wrench },
  { href: "/admin/workshops", label: "Workshops", icon: GraduationCap },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const ADMIN_UID = "nIYMqUe3BOXcThLivbW6oj6HjNH2";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.uid === ADMIN_UID) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const getInitials = (email: string | null | undefined) => {
    return email ? email.substring(0, 2).toUpperCase() : "AD";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Image src="/img/logofavicon.ico" alt="Loading..." width={64} height={64} className="animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return null; // The useEffect hook handles the redirect.
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary"/>
            <h1 className="text-xl font-semibold">RoboBox Admin</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')}
                  tooltip={{ children: item.label, side: "right" }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-center text-xs text-muted-foreground p-2 group-data-[collapsible=icon]:hidden">
             © {new Date().getFullYear()} RoboBox
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {menuItems.find((item) => pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin'))?.label || "Dashboard"}
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-auto items-center justify-start gap-2 p-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || undefined} alt={user.email || 'Admin'} />
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <div className="flex-col items-start hidden sm:flex">
                  <span className="text-sm font-medium">{user.email || 'Admin'}</span>
                </div>
                <ChevronDown className="ml-auto hidden h-4 w-4 sm:flex" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
