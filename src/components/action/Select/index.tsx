import React from 'react'
import { cn } from "@/utils/cn"
import './style.sass'

export interface SelectOption {
	label: string
	value: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	options: SelectOption[]
	error?: boolean
	isLoading?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ options, className = '', error = false, isLoading = false, ...props }, ref) => {
		const selectClasses = cn(
			"select",
			isLoading && "select--loading",
			error && "select--error",
			className
		)

		return (
			<div className="select-wrapper">
				<select
					ref={ref}
					className={selectClasses}
					data-invalid={error}
					disabled={props.disabled || isLoading}
					{...props}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				
				{isLoading ? (
					<div className="select-loader-wrapper">
						<span className="select-loader" />
					</div>
				) : (
					<div className="select-icon-wrapper">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</div>
				)}
			</div>
		)
	}
)

Select.displayName = 'Select'

export default Select

