export interface BreadcrumbItem {
    label: string;
    path: string;
}

export interface BreadcrumbContextType {
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: (items: BreadcrumbItem[]) => void;
}
