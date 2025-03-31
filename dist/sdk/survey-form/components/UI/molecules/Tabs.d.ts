import * as React from "react";
import { Tab } from "@headlessui/react";
export interface TabsProps extends React.ComponentPropsWithoutRef<typeof Tab.Group> {
    className?: string;
}
export declare const Tabs: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLElement>>;
export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof Tab.List> {
    className?: string;
}
export declare const TabsList: React.ForwardRefExoticComponent<TabsListProps & React.RefAttributes<HTMLElement>>;
export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof Tab> {
    className?: string;
    selected?: boolean;
}
export declare const TabsTrigger: React.ForwardRefExoticComponent<TabsTriggerProps & React.RefAttributes<HTMLElement>>;
export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof Tab.Panel> {
    className?: string;
}
export declare const TabsContent: React.ForwardRefExoticComponent<TabsContentProps & React.RefAttributes<HTMLElement>>;
