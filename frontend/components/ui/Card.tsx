interface CardProps {
	children: React.ReactNode;
	className?: string;
}
import { clsx } from 'clsx';

export function Card({ children, className }: CardProps) {
	return (
		<div
			className={clsx(
				'rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
				className
			)}
		>
			{children}
		</div>
	);
}
