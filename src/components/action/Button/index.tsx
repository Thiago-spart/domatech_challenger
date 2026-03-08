import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import './style.sass';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The styling variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** The size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is in a loading state */
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    // Generate class names based on props
    const classes = [
      'button', 
      `button--${variant}`, 
      `button--${size}`, 
      ...(isLoading ? ['button--loading'] : []),
      className
    ].filter(Boolean).join(' ');

    return (
      <button 
        ref={ref} 
        className={classes} 
        disabled={disabled || isLoading} 
        {...props}
      >
        {isLoading ? (
          <span className="button__loader" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
