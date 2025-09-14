// components/RetryToast.tsx
import React from 'react';
import toast from 'react-hot-toast';

interface RetryToastProps {
	message: string;
	onRetry: () => void;
	toastId: string;
}

export const RetryToast: React.FC<RetryToastProps> = ({
	message,
	onRetry,
	toastId,
}) => {
	const handleRetry = () => {
		toast.dismiss(toastId);
		onRetry();
	};

	return (
		<div className='flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3'>
			<div className='flex items-center'>
				<div className='flex-shrink-0'>
					<svg
						className='h-5 w-5 text-red-400'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
							clipRule='evenodd'
						/>
					</svg>
				</div>
				<div className='ml-3'>
					<p className='text-sm font-medium text-red-800'>{message}</p>
				</div>
			</div>
			<div className='ml-4 flex-shrink-0'>
				<button
					onClick={handleRetry}
					className='bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors'
				>
					Retry
				</button>
			</div>
		</div>
	);
};

// Usage function
export const showRetryToast = (message: string, onRetry: () => void) => {
	const toastId = toast.custom(
		t => <RetryToast message={message} onRetry={onRetry} toastId={t.id} />,
		{
			duration: 8000,
		}
	);
	return toastId;
};
