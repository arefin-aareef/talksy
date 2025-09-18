import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/Button';
<<<<<<< HEAD
import { socketClient } from '@/lib/socket';
=======
import { socketClient } from '@/lib/socket'; 
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e

interface MessageInputProps {
	receiverId: string;
}

export function MessageInput({ receiverId }: MessageInputProps) {
	const [message, setMessage] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [connectionStatus, setConnectionStatus] = useState(
		socketClient.connectionStatus
	);

	const { sendMessage, startTyping, stopTyping } = useChat();
	const typingTimeoutRef = useRef<NodeJS.Timeout>();
<<<<<<< HEAD
	const inputRef = useRef<HTMLInputElement>(null);

	// Auto-focus input when receiver changes
	useEffect(() => {
		if (inputRef.current && receiverId) {
			// Small delay to ensure the component is fully rendered
			const focusTimeout = setTimeout(() => {
				inputRef.current?.focus();
			}, 100);

			return () => clearTimeout(focusTimeout);
		}
	}, [receiverId]);
=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e

	// Monitor connection status
	useEffect(() => {
		const statusInterval = setInterval(() => {
			setConnectionStatus(socketClient.connectionStatus);
		}, 1000);

		// Set up socket event handlers for real-time status updates
		socketClient.on('connect', () => {
			setConnectionStatus('connected');
			setError(null);
		});

		socketClient.on('disconnect', () => {
			setConnectionStatus('disconnected');
		});

		socketClient.on('error', err => {
			setError(err.message || 'Connection error');
			setConnectionStatus('error');
		});

		return () => {
			clearInterval(statusInterval);
			socketClient.off('connect');
			socketClient.off('disconnect');
			socketClient.off('error');
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!message.trim()) return;

		try {
			setIsSending(true);
			setError(null);

			// Generate temp ID for optimistic updates
			const tempId = `temp_${Date.now()}_${Math.random()}`;

<<<<<<< HEAD
			// Send message - this will automatically update conversation order in context
			await sendMessage(receiverId, message.trim(), tempId);
			setMessage('');
			handleStopTyping();

			// Keep focus on input after sending message
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
=======
			await sendMessage(receiverId, message.trim(), tempId);
			setMessage('');
			handleStopTyping();
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to send message';
			console.error('Error sending message:', error);
			setError(errorMessage);

			// Auto-clear error after 5 seconds
			setTimeout(() => setError(null), 5000);
		} finally {
			setIsSending(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);

		// Only handle typing indicators if connected
		if (socketClient.isConnected) {
			if (!isTyping) {
				setIsTyping(true);
				startTyping(receiverId);
			}

			// Clear existing timeout
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			// Set new timeout to stop typing
			typingTimeoutRef.current = setTimeout(() => {
				handleStopTyping();
			}, 2000);
		}
	};

	const handleStopTyping = () => {
		if (isTyping) {
			setIsTyping(false);
			stopTyping(receiverId);
		}
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
	};

	const getConnectionStatusIcon = () => {
		switch (connectionStatus) {
			case 'connected':
				return <Wifi className='h-4 w-4 text-green-500' />;
			case 'connecting':
				return <Loader2 className='h-4 w-4 text-yellow-500 animate-spin' />;
			case 'error':
			case 'disconnected':
				return <WifiOff className='h-4 w-4 text-red-500' />;
			default:
				return <WifiOff className='h-4 w-4 text-gray-500' />;
		}
	};

	const getConnectionStatusText = () => {
		switch (connectionStatus) {
			case 'connected':
				return 'Connected';
			case 'connecting':
				return 'Connecting...';
			case 'error':
				return 'Connection Error';
			case 'disconnected':
				return 'Disconnected';
			default:
				return 'Unknown';
		}
	};

	const isDisabled =
		!socketClient.isConnected || isSending || connectionStatus === 'connecting';
	const placeholder = isDisabled
		? connectionStatus === 'connecting'
			? 'Connecting...'
			: 'No connection'
		: 'Type a message...';

	return (
		<div className='border-t border-gray-200 dark:border-gray-700'>
			{/* Connection Status Bar */}
			<div className='px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						{getConnectionStatusIcon()}
						<span
							className={`text-sm ${
								connectionStatus === 'connected'
									? 'text-green-600 dark:text-green-400'
									: connectionStatus === 'connecting'
									? 'text-yellow-600 dark:text-yellow-400'
									: 'text-red-600 dark:text-red-400'
							}`}
						>
							{getConnectionStatusText()}
						</span>
						{socketClient.reconnectAttemptCount > 0 && (
							<span className='text-xs text-gray-500'>
								(Attempt {socketClient.reconnectAttemptCount})
							</span>
						)}
					</div>

					{/* Retry button for failed connections */}
					{(connectionStatus === 'error' ||
						connectionStatus === 'disconnected') && (
						<Button
							size='sm'
<<<<<<< HEAD
							onClick={() => {
								const token = localStorage.getItem('token');
=======
							// variant='outline'
							onClick={() => {
								const token = localStorage.getItem('token'); // Adjust as needed
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
								if (token) {
									socketClient.connect(token).catch(console.error);
								}
							}}
							className='text-xs'
						>
							Retry
						</Button>
					)}
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className='px-4 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800'>
					<div className='flex items-center space-x-2'>
						<AlertCircle className='h-4 w-4 text-red-500' />
						<span className='text-sm text-red-600 dark:text-red-400'>
							{error}
						</span>
						<Button
							size='sm'
							variant='ghost'
							onClick={() => setError(null)}
							className='ml-auto text-red-500 hover:text-red-700 p-1'
						>
							×
						</Button>
					</div>
				</div>
			)}

			{/* Message Input Form */}
			<form onSubmit={handleSubmit} className='p-4'>
				<div className='flex space-x-2'>
					<input
<<<<<<< HEAD
						ref={inputRef}
=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
						type='text'
						value={message}
						onChange={handleInputChange}
						onBlur={handleStopTyping}
						placeholder={placeholder}
						disabled={isDisabled}
						className={`flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all ${
							isDisabled
								? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-400 cursor-not-allowed'
								: 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
						}`}
						maxLength={1000}
					/>
					<Button
						type='submit'
						disabled={!message.trim() || isDisabled}
						className={`rounded-full p-2 transition-all ${
							isSending ? 'animate-pulse' : ''
						}`}
					>
						{isSending ? (
							<Loader2 className='h-4 w-4 animate-spin' />
						) : (
							<Send className='h-4 w-4' />
						)}
					</Button>
				</div>

				{/* Character Counter */}
				{message.length > 800 && (
					<div className='mt-2 text-right'>
						<span
							className={`text-xs ${
								message.length > 950
									? 'text-red-500'
									: message.length > 900
									? 'text-yellow-500'
									: 'text-gray-500'
							}`}
						>
							{message.length}/1000
						</span>
					</div>
				)}
			</form>
<<<<<<< HEAD
=======

			{/* Debug Info (only in development) */}
			{/* {process.env.NODE_ENV === 'development' && (
				<div className='px-4 pb-2'>
					<details className='text-xs text-gray-500'>
						<summary className='cursor-pointer hover:text-gray-700'>
							Debug Info
						</summary>
						<div className='mt-1 space-y-1'>
							<div>Connection Status: {connectionStatus}</div>
							<div>
								Socket Connected: {socketClient.isConnected ? 'Yes' : 'No'}
							</div>
							<div>Is Sending: {isSending ? 'Yes' : 'No'}</div>
							<div>Is Typing: {isTyping ? 'Yes' : 'No'}</div>
							<div>
								Reconnect Attempts: {socketClient.reconnectAttemptCount}
							</div>
							<div>
								Socket ID: {socketClient.isConnected ? 'Connected' : 'N/A'}
							</div>
						</div>
					</details>
				</div>
			)} */}
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
		</div>
	);
}