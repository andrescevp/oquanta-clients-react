import * as React from "react";

import { Tab } from "@headlessui/react";

import { cn } from "../../../lib/utils";

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof Tab.Group> {
  className?: string;
}

export const Tabs = React.forwardRef<
  React.ElementRef<typeof Tab.Group>,
  TabsProps
>(({ className, ...props }, ref) => (
  <Tab.Group
    ref={ref}
    {...props}
    className={cn("w-full", className)}
  />
));
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof Tab.List> {
  className?: string;
}

export const TabsList = React.forwardRef<
  React.ElementRef<typeof Tab.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <Tab.List
    ref={ref}
    className={cn(
      "flex h-10 items-center rounded-md bg-gray-100 p-1 dark:bg-dark-800",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof Tab> {
  className?: string;
  selected?: boolean;
}

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof Tab>,
  TabsTriggerProps
>(({ className, selected, ...props }, ref) => (
  <Tab
    ref={ref}
    className={cn(
      "inline-flex w-full items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      selected
        ? "bg-white text-blue-600 shadow-sm dark:bg-dark-700 dark:text-blue-400"
        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-700 dark:hover:text-gray-300",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof Tab.Panel> {
  className?: string;
}

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof Tab.Panel>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <Tab.Panel
    ref={ref}
    className={cn(
      "py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";
