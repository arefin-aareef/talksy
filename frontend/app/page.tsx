'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConversationList } from '@/components/chat/ConversationList';
import { UserList } from '@/components/chat/UserList';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LogOut, Users, MessageCircle, Menu, X } from 'lucide-react';

export default function HomePage() {
	const { user, loading: authLoading, logout } = useAuth();
	const { activeConversation, onlineUsers } = useChat();
	const [sidebarView, setSidebarView] = useState<'conversations' | 'users'>(
		'conversations'
	);
	const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/auth/login');
		}
	}, [user, authLoading, router]);

	// Close drawer when conversation is selected on mobile
	useEffect(() => {
		if (activeConversation) {
			setIsMobileDrawerOpen(false);
		}
	}, [activeConversation]);

	// Handle escape key to close drawer
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setIsMobileDrawerOpen(false);
			}
		};

		if (isMobileDrawerOpen) {
			document.addEventListener('keydown', handleEscape);
			// Prevent body scroll when drawer is open
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isMobileDrawerOpen]);

	if (authLoading) {
		return (
			<div className='h-screen flex items-center justify-center'>
				<LoadingSpinner />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const activeUser = onlineUsers.find(u => u._id === activeConversation);

	const SidebarContent = () => (
		<>
			{/* Header */}
			<div className='p-4 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center space-x-3'>
						<Avatar src={user.avatar} alt={user.username} online={true} />
						<div>
							<p className='font-medium text-gray-900 dark:text-white'>
								{user.username}
							</p>
							<p className='text-sm text-green-600 dark:text-green-400'>
								Online
							</p>
						</div>
					</div>
					<div className='flex items-center space-x-2'>
						<Button
							variant='ghost'
							size='sm'
							onClick={logout}
							className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
						>
							<LogOut className='h-4 w-4' />
						</Button>
						{/* Close button for mobile drawer */}
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setIsMobileDrawerOpen(false)}
							className='lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
						>
							<X className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className='flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1'>
					<button
						onClick={() => setSidebarView('conversations')}
						className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
							sidebarView === 'conversations'
								? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
								: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
						}`}
					>
						<MessageCircle className='h-4 w-4' />
						<span>Chats</span>
					</button>
					<button
						onClick={() => setSidebarView('users')}
						className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
							sidebarView === 'users'
								? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
								: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
						}`}
					>
						<Users className='h-4 w-4' />
						<span>Users</span>
					</button>
				</div>
			</div>

			{/* Content */}
			<div className='flex-1 overflow-hidden'>
				{sidebarView === 'conversations' ? <ConversationList /> : <UserList />}
			</div>
		</>
	);

	return (
		<div className='h-screen flex bg-white dark:bg-gray-900'>
			{/* Desktop Sidebar */}
			<div className='hidden lg:flex w-80 border-r border-gray-200 dark:border-gray-700 flex-col bg-white dark:bg-gray-800'>
				<SidebarContent />
			</div>

			{/* Mobile Drawer Overlay */}
			{isMobileDrawerOpen && (
				<div
					className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40'
					onClick={() => setIsMobileDrawerOpen(false)}
				/>
			)}

			{/* Mobile Drawer */}
			<div
				className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out z-50 ${
					isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
				} flex flex-col border-r border-gray-200 dark:border-gray-700`}
			>
				<SidebarContent />
			</div>

			{/* Main Chat Area */}
			<div className='flex-1 flex flex-col'>
				{activeConversation ? (
					<>
						{/* Chat Header */}
						<div className='p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
							<div className='flex items-center space-x-3'>
								{/* Mobile menu button */}
								<Button
									variant='ghost'
									size='sm'
									onClick={() => setIsMobileDrawerOpen(true)}
									className='lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
								>
									<Menu className='h-4 w-4' />
								</Button>

								<Avatar
									src={
										activeUser?.avatar ||
										`https://ui-avatars.com/api/?background=random&name=User`
									}
									alt={activeUser?.username || 'User'}
									online={activeUser?.isOnline}
								/>
								<div>
									<p className='font-medium text-gray-900 dark:text-white'>
										{activeUser?.username || 'User'}
									</p>
									<p className='text-sm text-gray-500 dark:text-gray-400'>
										{activeUser?.isOnline ? 'Online' : 'Offline'}
									</p>
								</div>
							</div>
						</div>

						{/* Messages */}
						<MessageList userId={activeConversation} />

						{/* Message Input */}
						<MessageInput receiverId={activeConversation} />
					</>
				) : (
					<div className='flex-1 flex flex-col'>
						{/* Mobile header when no conversation is active */}
						<div className='lg:hidden p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
							<div className='flex items-center space-x-3'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => setIsMobileDrawerOpen(true)}
									className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
								>
									<Menu className='h-4 w-4' />
								</Button>
								<h1 className='text-lg font-semibold text-gray-900 dark:text-white'>
									Talksy App
								</h1>
							</div>
						</div>

						{/* Welcome message */}
						<div className='flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
							<div className='text-center'>
								<div className='w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4'>
									<MessageCircle className='w-8 h-8 text-primary-600 dark:text-primary-400' />
								</div>
								<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
									Welcome to Talksy
								</h3>
								<p className='text-gray-500 dark:text-gray-400 text-center'>
									Select a conversation to start messaging
								</p>
								{/* Mobile-specific instruction */}
								<p className='lg:hidden text-sm text-gray-400 dark:text-gray-500 mt-2'>
									Tap the menu button to see conversations
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
