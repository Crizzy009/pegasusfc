"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

type TabsProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
  scrollToTopOnValueChange?: boolean;
  scrollBehavior?: "auto" | "smooth";
};

function getScrollContainer(el: HTMLElement | null): HTMLElement | Window {
  let cur: HTMLElement | null = el;
  while (cur && cur !== document.body) {
    const style = window.getComputedStyle(cur);
    const oy = style.overflowY;
    const canScroll = (oy === "auto" || oy === "scroll" || oy === "overlay") && cur.scrollHeight > cur.clientHeight;
    if (canScroll) return cur;
    cur = cur.parentElement;
  }
  return window;
}

function findScrollableDescendant(root: HTMLElement | null): HTMLElement | null {
  if (!root) return null;
  const isScrollable = (el: HTMLElement) => {
    const style = window.getComputedStyle(el);
    const oy = style.overflowY;
    return (oy === "auto" || oy === "scroll" || oy === "overlay") && el.scrollHeight > el.clientHeight;
  };

  if (isScrollable(root)) return root;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let n = walker.nextNode() as HTMLElement | null;
  while (n) {
    if (n instanceof HTMLElement && isScrollable(n)) return n;
    n = walker.nextNode() as HTMLElement | null;
  }
  return null;
}

function scrollToTop(target: HTMLElement | Window, behavior: "auto" | "smooth") {
  if (target === window) {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  target.scrollTo({ top: 0, behavior });
  target.scrollTop = 0;
}

const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, onValueChange, scrollToTopOnValueChange = true, scrollBehavior, ...props }, ref) => {
    const localRef = React.useRef<React.ElementRef<typeof TabsPrimitive.Root> | null>(null);

    const setRef = React.useCallback(
      (node: React.ElementRef<typeof TabsPrimitive.Root> | null) => {
        localRef.current = node;
        if (!ref) return;
        if (typeof ref === "function") ref(node);
        else (ref as React.MutableRefObject<React.ElementRef<typeof TabsPrimitive.Root> | null>).current = node;
      },
      [ref]
    );

    const reducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const behavior = scrollBehavior ?? (reducedMotion ? "auto" : "smooth");

    const handleValueChange = React.useCallback(
      (value: string) => {
        onValueChange?.(value);
        if (!scrollToTopOnValueChange) return;
        const rootEl = localRef.current as unknown as HTMLElement | null;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const activeContent = rootEl?.querySelector(
              "[data-radix-tabs-content][data-state='active'],[data-slot='tabs-content'][data-state='active']"
            ) as HTMLElement | null;

            const innerScroll = findScrollableDescendant(activeContent);
            if (innerScroll) {
              scrollToTop(innerScroll, behavior);
              return;
            }

            const outer = getScrollContainer(rootEl);
            scrollToTop(outer, behavior);
          });
        });
      },
      [behavior, onValueChange, scrollToTopOnValueChange]
    );

    return (
      <TabsPrimitive.Root
        ref={setRef}
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        onValueChange={handleValueChange}
        {...props}
      />
    );
  }
);
Tabs.displayName = "Tabs";

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
        className,
      )}
      {...props}
    />
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
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
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
