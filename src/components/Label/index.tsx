"use client"

import * as React from "react"
import "./style.sass"

export interface LabelProps extends React.ComponentProps<"label"> {
	isVisible?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({
	className = "",
	isVisible = true,
	...props
}, ref) => {
	const classes = [
		"label",
		!isVisible ? "label--sr-only" : "",
		className
	].filter(Boolean).join(" ")

	return (
		<label
			ref={ref}
			data-slot="label"
			className={classes}
			{...props}
		/>
	)
})
Label.displayName = "Label"

export { Label }
