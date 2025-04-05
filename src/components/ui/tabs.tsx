"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = React.useState(false);
  const [showRightShadow, setShowRightShadow] = React.useState(false);

  const checkForShadows = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Show left shadow if scrolled right
    setShowLeftShadow(el.scrollLeft > 20);

    // Show right shadow if more content to scroll
    setShowRightShadow(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial check
    checkForShadows();

    // Set up event listener
    el.addEventListener("scroll", checkForShadows);
    window.addEventListener("resize", checkForShadows);

    // Check after a short delay to ensure accurate measurements
    const timer = setTimeout(checkForShadows, 100);

    return () => {
      el.removeEventListener("scroll", checkForShadows);
      window.removeEventListener("resize", checkForShadows);
      clearTimeout(timer);
    };
  }, [checkForShadows]);

  return (
    <div className="relative">
      {/* Left shadow indicator */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none",
          "bg-gradient-to-r from-background to-transparent",
          "transition-opacity duration-200",
          showLeftShadow ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none pb-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <TabsPrimitive.List
          data-slot="tabs-list"
          className={cn(
            "bg-muted text-muted-foreground inline-flex h-10 mx-auto items-center justify-around rounded-lg p-1 w-full ",
            className
          )}
          {...props}
        />
      </div>

      {/* Right shadow indicator */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none",
          "bg-gradient-to-l from-background to-transparent",
          "transition-opacity duration-200",
          showRightShadow ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/50 inline-flex h-9 min-w-[100px] flex-shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 sm:flex-1",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
