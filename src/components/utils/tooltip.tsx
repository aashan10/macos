import type { JSX } from "solid-js"

interface TooltipProps {
    content: string
    children: JSX.Element
    class?: string,
    arrowClass?: string,
}

export function Tooltip(props: TooltipProps) {
    const tooltipClasses = () => {
        const baseClasses = [
            // Base positioning and layout
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-5 z-50",
            // Styling
            "px-4 py-1 text-sm text-stone-900 dark:text-stone-50 rounded-full shadow-2xl",
            // Backdrop blur and translucent background
            "bg-stone-200/50 dark:bg-stone-900/50 backdrop-blur-2xl",
            // Animation and interaction
            "opacity-0 scale-95 pointer-events-none transition-all duration-200 ease-out",
            "group-hover:opacity-100 group-hover:scale-100",
            // Text formatting
            "whitespace-nowrap"
        ]

        return props.class ? [...baseClasses, props.class].join(" ") : baseClasses.join(" ")
    }

    const arrowClasses = () => {
        const baseClasses = [
            "absolute top-full left-1/2 -translate-x-1/2",
            "w-0 h-0 border-6 border-transparent",
            "border-t-stone-200/50 dark:border-t-stone-900/50"
        ]

        return props.arrowClass ? [...baseClasses, props.arrowClass].join(" ") : baseClasses.join(" ")
    }

    return (
        <div class="relative inline-block group">
            {props.children}
            <div class={tooltipClasses()}>
                {props.content}
                {/* Arrow */}
                <div class={arrowClasses()} />
            </div>
        </div>
    )
}

