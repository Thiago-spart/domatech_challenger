"use client"

import * as React from "react"
import "./style.sass"

interface SeparatorProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className = "", orientation = "horizontal", decorative = true, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        data-orientation={orientation}
        data-slot="separator"
        className={`separator ${className}`.trim()}
        {...props}
      />
    )
  }
)
Separator.displayName = "Separator"

export { Separator }
