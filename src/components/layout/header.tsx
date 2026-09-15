
"use client";

import { Menu, Search, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { ScrollArea } from "../ui/scroll-area";
import { SearchCommand } from "../search-command";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

const navLinks = [
  {
    label: "Kits",
    href: "#",
    subLinks: [
      { label: "RoboBox Kit", href: "/kits/robobox" },
      { label: "Mechatronics Kits", href: "/kits/mechatronics" },
      { label: "Blix Kits", href: "/kits/blix" },
      { label: "Drone Kit", href: "/kits/drone" },
    ],
  },
  {
    label: "Workshop",
    href: "#",
    subLinks: [
      { label: "Insight to Robotics", href: "/workshops/robotics-insight" },
      { label: "All in one Masterclass", href: "/workshops/all-in-one" },
      { label: "Master class (Scratch to Pro)", href: "/workshops/scratch-to-pro" },
    ],
  },
  {
    label: "Community",
    href: "#",
    subLinks: [
        { label: "Games", href: "/community/games" },
        { label: "Scholarship", href: "/community/scholarship" },
        { label: "Make your Bot", href: "/community/make-your-bot" },
    ]
  },
  { href: "/shop", label: "Shop" },
  { href: "/career", label: "Career" },
  { href: "/about", label: "About" },
];


const NavLink = ({ link, isMobile, closeSheet }: { link: (typeof navLinks)[number]; isMobile?: boolean; closeSheet?: () => void}) => {
    const [open, setOpen] = useState(false);

    const handleLinkClick = (isSubLink: boolean) => {
      if (isMobile && closeSheet && isSubLink) {
        closeSheet();
      }
    };

    if (link.subLinks) {
        if (isMobile) {
            return (
              <div key={link.label} className="flex flex-col gap-2">
                <h3 className="font-semibold text-foreground/80">{link.label}</h3>
                {link.subLinks.map((subLink) => (
                  <Link
                    key={subLink.href}
                    href={subLink.href}
                    onClick={() => handleLinkClick(true)}
                    className="pl-4 font-medium text-foreground/60 transition-colors hover:text-foreground/80"
                  >
                    {subLink.label}
                  </Link>
                ))}
              </div>
            )
        }
        return (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <div
                  className="py-2"
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                >
                    <Button variant="ghost" className="font-medium text-foreground/60 transition-colors hover:text-foreground/80 hover:bg-transparent p-0 h-auto">
                      {link.label}
                    </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                {link.subLinks.map((subLink) => (
                  <DropdownMenuItem key={subLink.href} asChild>
                    <Link href={subLink.href}>{subLink.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => handleLinkClick(false)}
          className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
        >
          {link.label}
        </Link>
      );

}


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const renderNavLinks = (isMobile = false) => {
    return navLinks.map((link) => <NavLink link={link} isMobile={isMobile} key={link.label ?? link.href} closeSheet={closeMobileMenu} />);
  };

  return (
    <>
    <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 md:h-24 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center">
            <Image
            src="/img/logo.png"
            alt="Company Logo"
            width={180}
            height={74}
            className="h-16 w-auto md:h-20"
            />
        </Link>
        
        <div className="hidden md:flex flex-1 justify-center">
             <nav className="flex items-center gap-6 text-sm">
                {renderNavLinks()}
            </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
            {/* Desktop Search & Login */}
            <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 border rounded-md px-2 bg-white">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Search..." 
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-9 text-black"
                        onFocus={() => setSearchOpen(true)}
                    />
                </div>
                {user ? (
                    <Button asChild variant="ghost">
                        <Link href="/account">My Account</Link>
                    </Button>
                ) : (
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                )}
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center gap-2 md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchOpen(true)}
                    className="h-9 w-9"
                    >
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
                {user ? (
                    <Button asChild className="h-9 w-9" variant="ghost" size="icon">
                    <Link href="/account"><User className="h-5 w-5"/></Link>
                    </Button>
                ) : (
                    <Button asChild size="sm">
                        <Link href="/login">Login</Link>
                    </Button>
                )}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">
                        Navigate the site using these links.
                        </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="flex-grow">
                        <nav className="flex flex-col gap-6 p-4 text-lg">
                        {renderNavLinks(true)}
                        <div className="border-t border-border/40 pt-6 mt-6 flex flex-col gap-4">
                            {user ? (
                                <Button asChild>
                                <Link href="/account"><User className="mr-2"/> My Account</Link>
                                </Button>
                            ) : (
                                <Button asChild>
                                <Link href="/login">Login</Link>
                                </Button>
                            )}
                        </div>
                        </nav>
                    </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
    </>
  );
}
