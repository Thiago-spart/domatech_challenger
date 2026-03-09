"use client"
import React, { useState, useRef, useEffect } from 'react'
import { getCountries, getCountryCallingCode, type Country } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import './style.sass'

interface CountrySelectProps {
	value?: Country
	onChange: (value?: Country) => void
	labels: Record<string, string>
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, labels }) => {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const FlagComponent = value ? flags[value] : null

	return (
		<div className="countrySelect" ref={containerRef}>
			<button
				type="button"
				className="countrySelectButton"
				onClick={() => setIsOpen(!isOpen)}
			>
				{FlagComponent && (
					<div className="countrySelectFlag">
						<FlagComponent title={value ? labels[value] : ''} />
					</div>
				)}
				<span>+{value ? getCountryCallingCode(value) : ''}</span>
			</button>
			<div className="countrySelectSeparator" />

			{isOpen && (
				<div className="countrySelectDropdown">
					{getCountries().map((country) => {
						const CountryFlag = flags[country]
						return (
							<button
								key={country}
								type="button"
								className={`countrySelectOption ${value === country ? 'countrySelectOption--selected' : ''}`}
								onClick={() => {
									onChange(country)
									setIsOpen(false)
								}}
							>
								{CountryFlag && (
									<div className="countrySelectFlag">
										<CountryFlag title={labels[country]} />
									</div>
								)}
								<span className="countrySelectOptionName">{labels[country]}</span>
								<span className="countrySelectOptionCode">+{getCountryCallingCode(country)}</span>
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default CountrySelect