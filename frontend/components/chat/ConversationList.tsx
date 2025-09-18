import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '@/contexts/ChatContext';
import { Avatar } from '@/components/ui/Avatar';
import { clsx } from 'clsx';

// Helper function to safely format date
const formatSafeDate = (dateString: string | null | undefined): string => {
	if (!dateString) {
		return '';
	}

	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return '';
		}

		return formatDistanceToNow(date, { addSuffix: true });
	} catch {
		return '';
	}
};

export function ConversationList() {
	const { conversations, activeConversation, setActiveConversation, messages } =
		useChat();
	const router = useRouter();

	const handleConversationClick = (userId: string) => {
		setActiveConversation(userId);
		// Update URL to reflect the active conversation
		router.push(`/chat?conversation=${userId}`);
	};

	// Get the last message for a conversation (either from conversation data or messages state)
	const getLastMessage = (conversation: any) => {
		const userMessages = messages[conversation.user._id];
		const lastMessageFromState =
			userMessages && userMessages.length > 0
				? userMessages[userMessages.length - 1]
				: null;

		// Use the most recent message (either from state or conversation data)
		return lastMessageFromState || conversation.lastMessage;
	};

	// Get last message time for sorting and display
	const getLastMessageTime = (conversation: any) => {
		const lastMessage = getLastMessage(conversation);
		return conversation.lastMessageTime || lastMessage?.createdAt;
	};

	// Conversations are already sorted in the context, but we can ensure they're properly sorted here too
	const sortedConversations = [...conversations].sort((a, b) => {
		const aTime = new Date(getLastMessageTime(a) || 0).getTime();
		const bTime = new Date(getLastMessageTime(b) || 0).getTime();
		return bTime - aTime; // Most recent first
	});

	if (conversations.length === 0) {
		return (
			<div className='p-4 text-center text-gray-500 dark:text-gray-400'>
				<p>No conversations yet</p>
				<p className='text-sm'>Start chatting with someone!</p>
			</div>
		);
	}

	return (
		<div className='divide-y divide-gray-200 dark:divide-gray-700'>
			{sortedConversations?.map(conversation => {
				const lastMessage = getLastMessage(conversation);
				const lastMessageTime = getLastMessageTime(conversation);

				return (
					<button
						key={conversation._id}
						onClick={() => handleConversationClick(conversation.user._id)}
						className={clsx(
							'w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
							activeConversation === conversation.user._id &&
								'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500'
						)}
					>
						<div className='flex items-center space-x-3'>
							<Avatar
								src={conversation.user.avatar}
								alt={conversation.user.username}
								online={conversation.user.isOnline}
							/>
							<div className='flex-1 min-w-0'>
								<div className='flex justify-between items-start'>
									<p
										className={clsx(
											'font-medium truncate',
											activeConversation === conversation.user._id
												? 'text-primary-600 dark:text-primary-400'
												: 'text-gray-900 dark:text-white'
										)}
									>
										{conversation.user.username}
									</p>
									{lastMessageTime && (
										<p className='text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2'>
											{formatSafeDate(lastMessageTime)}
										</p>
									)}
								</div>

								{/* Last message preview */}
								{lastMessage && lastMessage.content && (
									<div className='flex justify-between items-center mt-1'>
										<p className='text-sm text-gray-600 dark:text-gray-300 truncate'>
											{lastMessage.sender?._id === conversation.user._id
												? lastMessage.content
												: `You: ${lastMessage.content}`}
										</p>
									</div>
								)}

								{/* User status and unread count */}
								<div className='flex justify-between items-center mt-1'>
									<div className='flex items-center'>
										<span
											className={`inline-block w-2 h-2 rounded-full mr-2 ${
												conversation.user.isOnline
													? 'bg-green-400'
													: 'bg-gray-300 dark:bg-gray-600'
											}`}
										/>
										<span className='text-xs text-gray-500 dark:text-gray-400'>
											{conversation.user.isOnline ? 'Online' : 'Offline'}
										</span>
									</div>

									{/* Unread count badge */}
									{conversation.unreadCount > 0 && (
										<span className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full'>
											{conversation.unreadCount}
										</span>
									)}
								</div>

								{/* Show last seen time if user is offline and no recent message */}
								{!conversation.user.isOnline && !lastMessage && (
									<p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
										Last seen {formatSafeDate(conversation.user?.lastSeen)}
									</p>
								)}
							</div>
						</div>
					</button>
				);
			})}
		</div>
	);
}

export default ConversationList;