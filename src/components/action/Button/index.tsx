import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import './style.sass';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The styling variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** The size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button should take up the full width of its container */
  fullWidth?: boolean;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, isLoading = false, children, disabled, ...props }, ref) => {
    // Generate class names based on props
    const classes = [
      'button',
      `button--${variant}`,
      `button--${size}`,
      ...(fullWidth ? ['button--fullWidth'] : []),
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
          <span className="button__text">{children}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
