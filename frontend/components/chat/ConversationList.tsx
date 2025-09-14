import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '@/contexts/ChatContext';
import { Avatar } from '@/components/ui/Avatar';
import { clsx } from 'clsx';

// Helper function to safely format date
const formatSafeDate = (dateString: string | null | undefined): string => {
	if (!dateString) {
		return 'No messages';
	}

	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return 'Invalid date';
		}

		return formatDistanceToNow(date, { addSuffix: true });
	} catch {
		return 'Invalid date';
	}
};

export function ConversationList() {
	const { conversations, activeConversation, setActiveConversation } =
		useChat();

	if (conversations.length === 0) {
		return (
			<div className='p-4 text-center text-gray-500 dark:text-gray-400'>
				<p>No conversations yet</p>
				<p className='text-sm'>Start chatting with someone!</p>
			</div>
		);
	}

	console.log('Conversations:', conversations);

	return (
		<div className='divide-y divide-gray-200 dark:divide-gray-700'>
			{conversations?.map(conversation => (
				<button
					key={conversation._id}
					onClick={() => setActiveConversation(conversation.user._id)}
					className={clsx(
						'w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
						activeConversation === conversation.user._id &&
							'bg-primary-50 dark:bg-primary-900/20'
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
								<p className='font-medium text-gray-900 dark:text-white truncate'>
									{conversation.user.username}
								</p>
								<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
									{/* {formatSafeDate(conversation.lastMessage?.createdAt)} */}
									Total Messages
								</p>
							</div>
							<div className='flex justify-between items-center mt-1'>
								<p className='text-sm text-gray-600 dark:text-gray-300 truncate'>
									Last Active {formatSafeDate(conversation.user?.lastSeen)}
								</p>
								{conversation.unreadCount > 0 && (
									<span className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full'>
										{conversation.unreadCount}
									</span>
								)}
							</div>
						</div>
					</div>
				</button>
			))}
		</div>
	);
}

export default ConversationList;