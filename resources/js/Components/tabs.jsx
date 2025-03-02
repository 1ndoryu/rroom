// Components/ui/tabs.jsx  (Versión CORREGIDA)
import React from 'react';
import { cn } from '@/lib/utils';

const Tabs = React.forwardRef(({ className, defaultValue, onValueChange, children, ...props }, ref) => {
    const [value, setValue] = React.useState(defaultValue);

    const handleValueChange = (newValue) => {
        setValue(newValue);
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    const validChildren = React.Children.toArray(children).filter(child => React.isValidElement(child))

    return (
        <div className={cn("w-full", className)} {...props} ref={ref}>
            {React.cloneElement(validChildren[0], { onValueChange: handleValueChange, value: value })}
            {React.cloneElement(validChildren[1], { value: value })}
        </div>
    );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className, onValueChange, value, children, ...props }, ref) => {
    const validChildren = React.Children.toArray(children).filter(child => React.isValidElement(child))

    return (
        <div
            className={cn(
                "inline-flex items-center justify-center w-full rounded-md bg-gray-100 p-1",
                className
            )}
            {...props}
            ref={ref}
        >
            {validChildren.map((child) =>
                React.cloneElement(child, {
                    onClick: () => onValueChange(child.props.value),
                    isActive: child.props.value === value,
                })
            )}
        </div>
    );
});
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, value, isActive, children, onClick, ...props }, ref) => {

    return (
        <button
            type="button"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap py-2 px-3 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
                isActive
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-700 hover:text-black hover:bg-gray-200",
                className
            )}
            {...props}
            ref={ref}
            onClick={onClick}
        >
            {children}
        </button>
    );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
    const context = value; // El value se obtiene del contexto, no por props
    return (
        context === props.value ?
            <div
                className={cn(
                    "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
                    className
                )}
                {...props}
                ref={ref}
            >
                {children}
            </div>
            : null
    );
});

TabsContent.displayName = "TabsContent";


export { Tabs, TabsList, TabsTrigger, TabsContent };