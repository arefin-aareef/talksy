import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Message } from '@/types';
import { clsx } from 'clsx';

interface MessageListProps {
	userId: string; // This should be the conversation partner's ID
}

export function MessageList({ userId }: MessageListProps) {
	const { messages, typingUsers } = useChat();
	const { user: currentUser, loading: authLoading } = useAuth();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Get all messages for this conversation
	const conversationMessages = messages[userId] || [];

	// Sort messages by timestamp
	const allMessages = conversationMessages.sort(
		(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
	);

	const isUserTyping = typingUsers.find(u => u.userId === userId);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [allMessages]);

	// Don't render messages until we know who the current user is
	if (authLoading || !currentUser) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<div className='text-gray-500'>Loading messages...</div>
			</div>
		);
	}

	return (
		<div className='flex-1 overflow-y-auto p-4 space-y-4'>
			{allMessages.map((message: Message) => {
				// Fix: currentUser uses 'id', message.sender uses '_id'
				const isOwnMessage =
					String(message.sender._id) === String(currentUser.id);

				return (
					<div
						key={message._id || message.tempId}
						className={clsx(
							'flex items-end space-x-2',
							isOwnMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row'
						)}
					>
						<div className='flex-shrink-0'>
							<Avatar
								src={message.sender.avatar}
								alt={message.sender.username}
								size='sm'
							/>
						</div>
						<div
							className={clsx(
								// Fixed responsive width classes and added better text wrapping
								'max-w-[85%] sm:max-w-[75%] md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-2xl',
								// Better word breaking and overflow handling
								'break-words overflow-wrap-anywhere hyphens-auto',
								// Ensure proper line height for readability
								'leading-relaxed',
								isOwnMessage
									? 'bg-blue-500 text-white'
									: 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-100',
								message.tempId && 'opacity-60'
							)}
							style={{
								// Fallback for older browsers that don't support overflow-wrap-anywhere
								wordWrap: 'break-word',
								overflowWrap: 'break-word',
								wordBreak: 'break-word',
							}}
						>
							<p className='break-words whitespace-pre-wrap leading-relaxed'>
								{message.content}
							</p>
							<p
								className={clsx(
									'text-xs mt-1',
									isOwnMessage
										? 'text-blue-100'
										: 'text-gray-500 dark:text-gray-400'
								)}
							>
								{formatDistanceToNow(new Date(message.createdAt), {
									addSuffix: true,
								})}
							</p>
						</div>
					</div>
				);
			})}

			{isUserTyping && (
				<div className='flex items-end space-x-2'>
					<div className='flex-shrink-0'>
						<Avatar
							src={`https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
								isUserTyping.username
							)}`}
							alt={isUserTyping.username}
							size='sm'
						/>
					</div>
					<div className='bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl'>
						<div className='flex space-x-1'>
							<div
								className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'
								style={{ animationDelay: '0ms' }}
							/>
							<div
								className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'
								style={{ animationDelay: '150ms' }}
							/>
							<div
								className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'
								style={{ animationDelay: '300ms' }}
							/>
						</div>
					</div>
				</div>
			)}

			<div ref={messagesEndRef} />
		</div>
	);
}