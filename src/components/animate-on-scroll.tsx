"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
}

export default function AnimateOnScroll({
  children,
  className,
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "animate-on-scroll",
        { "is-visible": isVisible },
        className
      )}
    >
      {children}
    </div>
  );
}
