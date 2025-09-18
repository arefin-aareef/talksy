import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type, error, ...props }, ref) => {
		return (
			<div className='w-full'>
				<input
					type={type}
					className={clsx(
						'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-400',
						error &&
							'border-red-500 focus:border-red-500 focus:ring-red-500/20',
						className
					)}
					ref={ref}
					{...props}
				/>
				{error && (
					<p className='mt-1 text-sm text-red-600 dark:text-red-400'>{error}</p>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';
