"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/utils/cn"
import "./style.sass"

export interface InputProps extends React.ComponentProps<"input"> {
	isLoading?: boolean
	error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className = "", type = "text", isLoading = false, error = false, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false)
		const isPasswordType = type === "password"
		const isSearchType = type === "search"

		const currentType = isPasswordType
			? (showPassword ? "text" : "password")
			: type

		const inputClasses = cn(
			"input",
			isLoading && "input--loading",
			error && "input--error",
			isPasswordType && "input--password",
			isSearchType && "input--search",
			className,
		)

		return (
			<div className="input-wrapper">
				<input
					ref={ref}
					type={currentType}
					data-slot="input"
					className={inputClasses}
					data-invalid={error}
					disabled={props.disabled || isLoading}
					{...props}
				/>

				{isLoading && (
					<div className="input-loader-wrapper">
						<span className="input-loader" />
					</div>
				)}

				{isPasswordType && !isLoading && (
					<button
						type="button"
						className="input-icon-btn"
						onClick={() => setShowPassword(!showPassword)}
						aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
					>
						{showPassword ? (
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
								<circle cx="12" cy="12" r="3"></circle>
							</svg>
						) : (
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
								<line x1="1" y1="1" x2="23" y2="23"></line>
							</svg>
						)}
					</button>
				)}

				{isSearchType && !isLoading && (
					<Search className="input-icon-search" strokeWidth={1.5} />
				)}
			</div>
		)
	}
)

Input.displayName = "Input"

export { Input }
