'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, UserCheck, UserX } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { User } from '@/types';

interface UserCardProps {
	user: User;
	onStartChat: (userId: string) => void;
}

export function UserCard({ user, onStartChat }: UserCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	const handleStartChat = (e: React.MouseEvent) => {
		e.stopPropagation();
		onStartChat(user._id);
	};

	return (
		<div
			className='relative group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 cursor-pointer'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='flex flex-col items-center text-center space-y-3'>
				{/* Avatar */}
				<div className='relative'>
					<Avatar
						src={user.avatar}
						alt={user.username}
						online={user.isOnline}
						size='lg'
					/>
					{/* Online indicator */}
					<div
						className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
							user.isOnline ? 'bg-green-500' : 'bg-gray-400'
						}`}
					/>
				</div>

				{/* User info */}
				<div className='flex-1 min-w-0'>
					<h3 className='font-medium text-gray-900 dark:text-white truncate'>
						{user.username}
					</h3>
					<p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
						{user.email}
					</p>
					<div className='flex items-center justify-center space-x-1 mt-1'>
						{user.isOnline ? (
							<>
								<UserCheck className='h-3 w-3 text-green-500' />
								<span className='text-xs text-green-500'>Online</span>
							</>
						) : (
							<>
								<UserX className='h-3 w-3 text-gray-400' />
								<span className='text-xs text-gray-400'>Offline</span>
							</>
						)}
					</div>
				</div>

				{/* Chat button - visible on hover (desktop) or always (mobile) */}
				<Button
					size='sm'
					onClick={handleStartChat}
					className={`transition-all duration-200 ${
						isHovered || window.innerWidth < 1024
							? 'opacity-100 translate-y-0'
							: 'opacity-0 translate-y-2'
					}`}
				>
					<MessageCircle className='h-4 w-4 mr-1' />
					Chat
				</Button>
			</div>
		</div>
	);
}
