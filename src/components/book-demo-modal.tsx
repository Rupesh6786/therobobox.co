"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Bot } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function BookDemoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only open if a user hasn't closed it before in this session
      if (!sessionStorage.getItem("demoModalClosed")) {
        setIsOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("demoModalClosed", "true");
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold tracking-tighter font-headline">Book A Demo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
            <Input type="text" placeholder="Name" />
            <Input type="email" placeholder="Email" />
            <Input type="tel" placeholder="Mobile" />
            <Input type="text" placeholder="Address" />
            <div className="relative">
                <Input type="text" placeholder="Enter last 6 digit of order id" className="pr-10"/>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>You can find this on your order confirmation email.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
          <Button type="submit">Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
