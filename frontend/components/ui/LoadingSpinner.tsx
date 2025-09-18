import { clsx } from 'clsx';
export function LoadingSpinner({ className }: { className?: string }) {
	return (
		<div className={clsx('flex items-center justify-center', className)}>
			<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600' />
		</div>
	);
}
