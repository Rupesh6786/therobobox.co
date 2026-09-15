
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchableData } from "@/lib/search-data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: Props) {
  const router = useRouter();

  const runCommand = (command: () => unknown) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for kits, workshops, or FAQs..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Kits">
          {searchableData
            .filter((item) => item.type === "kit")
            .map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => {
                  runCommand(() => router.push(item.href));
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </CommandItem>
            ))}
        </CommandGroup>

        <CommandGroup heading="Workshops">
          {searchableData
            .filter((item) => item.type === "workshop")
            .map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => {
                  runCommand(() => router.push(item.href));
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </CommandItem>
            ))}
        </CommandGroup>
        
        <CommandGroup heading="FAQs">
          {searchableData
            .filter((item) => item.type === "faq")
            .map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => {
                  runCommand(() => router.push(item.href));
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
