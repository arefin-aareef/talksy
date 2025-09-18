import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
	src?: string;
	alt?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	className?: string;
	online?: boolean;
}

export function Avatar({
	src,
	alt,
	size = 'md',
	className,
	online,
}: AvatarProps) {
	const sizeClasses = {
		xs: 'h-6 w-6',
		sm: 'h-8 w-8',
		md: 'h-10 w-10',
		lg: 'h-12 w-12',
		xl: 'h-16 w-16',
	};

	return (
		<div className={clsx('relative flex-shrink-0', className)}>
			<img
				src={src || '/default-avatar.png'}
				alt={alt || 'Avatar'}
				className={clsx('rounded-full object-cover', sizeClasses[size])}
				onError={e => {
					const target = e.target as HTMLImageElement;
					target.src = `https://ui-avatars.com/api/?background=3b82f6&color=white&name=${encodeURIComponent(
						alt || 'U'
					)}`;
				}}
			/>
			{online && (
				<div
					className={clsx(
						'absolute bottom-0 right-0 rounded-full border-2 border-white bg-green-500',
						size === 'xs' && 'h-2 w-2',
						size === 'sm' && 'h-2.5 w-2.5',
						size === 'md' && 'h-3 w-3',
						size === 'lg' && 'h-3.5 w-3.5',
						size === 'xl' && 'h-4 w-4'
					)}
				/>
			)}
		</div>
	);
}
