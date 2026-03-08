"use client"

import { useMemo } from "react"
import { Label } from "@/components/Label"
import { Separator } from "@/components/Separator"
import "./style.sass"

function FieldSet({ className = "", ...props }: React.ComponentProps<"fieldset">) {
	return (
		<fieldset
			data-slot="field-set"
			className={`field-set ${className}`.trim()}
			{...props}
		/>
	)
}

function FieldLegend({
	className = "",
	variant = "legend",
	...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			className={`field-legend field-legend--${variant} ${className}`.trim()}
			{...props}
		/>
	)
}

function FieldGroup({ className = "", ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-group"
			className={`field-group ${className}`.trim()}
			{...props}
		/>
	)
}

function Field({
	className = "",
	orientation = "vertical",
	...props
}: React.ComponentProps<"div"> & { orientation?: "vertical" | "horizontal" | "responsive" }) {
	return (
		<div
			role="group"
			data-slot="field"
			data-orientation={orientation}
			className={`field field--${orientation} ${className}`.trim()}
			{...props}
		/>
	)
}

function FieldContent({ className = "", ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-content"
			className={`field-content ${className}`.trim()}
			{...props}
		/>
	)
}

function FieldLabel({
	className = "",
	...props
}: React.ComponentProps<typeof Label>) {
	return (
		<Label
			data-slot="field-label"
			className={`field-label ${className}`.trim()}
			{...props}
		/>
	)
}

function FieldTitle({ className = "", ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-label"
			className={`field-title ${className}`.trim()}
			{...props}
		/>
	)
}

function FieldDescription({ className = "", ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="field-description"
			className={`field-description ${className}`.trim()}
			{...props}
		/>
	)
}

function FieldSeparator({
	children,
	className = "",
	...props
}: React.ComponentProps<"div"> & {
	children?: React.ReactNode
}) {
	return (
		<div
			data-slot="field-separator"
			data-content={!!children}
			className={`field-separator ${className}`.trim()}
			{...props}
		>
			<Separator className="field-separator__line" />
			{children && (
				<span
					className="field-separator__content"
					data-slot="field-separator-content"
				>
					{children}
				</span>
			)}
		</div>
	)
}

function FieldError({
	className = "",
	children,
	errors,
	...props
}: React.ComponentProps<"div"> & {
	errors?: Array<{ message?: string } | undefined>
}) {
	const content = useMemo(() => {
		if (children) return children

		if (!errors?.length) return null

		const uniqueErrors = [
			...new Map(errors.map((error) => [error?.message, error])).values(),
		]

		if (uniqueErrors?.length == 1) {
			return uniqueErrors[0]?.message
		}

		return (
			<ul className="field-error-list">
				{uniqueErrors.map(
					(error, index) =>
						error?.message && <li key={index}>{error.message}</li>
				)}
			</ul>
		)
	}, [children, errors])

	if (!content) return null

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={`field-error ${className}`.trim()}
			{...props}
		>
			{content}
		</div>
	)
}

export {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldContent,
	FieldTitle,
}
