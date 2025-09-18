import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	loading?: boolean;
}

export function Button({
	className,
	variant = 'primary',
	size = 'md',
	loading,
	disabled,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={clsx(
				'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50',
				{
					'bg-primary-600 text-white hover:bg-primary-700':
						variant === 'primary',
					'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600':
						variant === 'secondary',
					'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
					'hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'ghost',
					'h-8 px-3 text-sm': size === 'sm',
					'h-10 px-4': size === 'md',
					'h-12 px-6 text-lg': size === 'lg',
				},
				className
			)}
			disabled={disabled || loading}
			{...props}
		>
			{loading && (
				<svg
					className='mr-2 h-4 w-4 animate-spin'
					fill='none'
					viewBox='0 0 24 24'
				>
					<circle
						className='opacity-25'
						cx='12'
						cy='12'
						r='10'
						stroke='currentColor'
						strokeWidth='4'
					/>
					<path
						className='opacity-75'
						fill='currentColor'
						d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
					/>
				</svg>
			)}
			{children}
		</button>
	);
}
