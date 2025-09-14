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
	const { user: currentUser } = useAuth();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const userMessages = messages[userId] || [];
	const currentUserMessages = messages[currentUser?._id || ''] || [];

	// Combine and sort all messages by timestamp
	const allMessages = [...userMessages, ...currentUserMessages].sort(
		(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
	);

	const isUserTyping = typingUsers.find(u => u.userId === userId);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [allMessages]);

	return (
		<div className='flex-1 overflow-y-auto p-4 space-y-4'>
			{allMessages.map((message: Message) => {
				const isOwnMessage = message.sender._id === currentUser?._id;

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
								'max-w-[70%] sm:max-w-xs lg:max-w-md px-4 py-2 rounded-2xl break-words',
								isOwnMessage
									? 'bg-primary-600 text-white'
									: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
								message.tempId && 'opacity-60'
							)}
						>
							<p className='break-words whitespace-pre-wrap'>
								{message.content}
							</p>
							<p
								className={clsx(
									'text-xs mt-1',
									isOwnMessage
										? 'text-primary-100'
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