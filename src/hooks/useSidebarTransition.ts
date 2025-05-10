import { useState } from 'react';

export function useSidebarTransition() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(prev => !prev);

    return {
        isCollapsed,
        toggleSidebar,
        transitionProps: {
            show: !isCollapsed,
            enter: 'transition-all duration-300 ease-in-out',
            enterFrom: 'opacity-0 -translate-x-full',
            enterTo: 'opacity-100 translate-x-0',
            leave: 'transition-all duration-300 ease-in-out',
            leaveFrom: 'opacity-100 translate-x-0',
            leaveTo: 'opacity-0 -translate-x-full',
        },
    };
}
