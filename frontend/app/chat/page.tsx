'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import { LogOut, Menu, X, ArrowLeft } from 'lucide-react';

export default function ChatPage() {
	const { user, loading: authLoading, logout } = useAuth();
	const {
		activeConversation,
		onlineUsers,
		conversations,
		setActiveConversation,
		typingUsers,
	} = useChat();
	const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const conversationId = searchParams.get('conversation');

	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/auth/login');
		}
	}, [user, authLoading, router]);

	// Set active conversation from URL parameter
	useEffect(() => {
		if (conversationId && conversationId !== activeConversation) {
			setActiveConversation(conversationId);
		}
	}, [conversationId, activeConversation, setActiveConversation]);

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

	// Get active user from conversations or onlineUsers
	const activeUser =
		conversations.find(c => c.user._id === activeConversation)?.user ||
		onlineUsers.find(u => u._id === activeConversation);

	// Get user display name (username or email fallback)
	const getUserDisplayName = (user: any) => {
		return user?.username || user?.email || 'User';
	};

	// Check if user is typing
	const isUserTyping = activeConversation
		? typingUsers.some(typingUser => typingUser.userId === activeConversation)
		: false;

	const SidebarContent = () => (
		<>
			{/* Header */}
			<div className='p-4 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
						Conversations
					</h2>
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

				{/* Back to Users Button */}
				<Button
					variant='secondary'
					size='sm'
					onClick={() => router.push('/')}
					className='w-full mb-4'
				>
					<ArrowLeft className='h-4 w-4 mr-2' />
					Back to Users
				</Button>
			</div>

			{/* Chat List - Conversations are now automatically sorted */}
			<div className='flex-1 overflow-hidden'>
				<ConversationList />
			</div>
		</>
	);

	return (
		<div className='h-screen flex flex-col bg-white dark:bg-gray-900'>
			{/* Navbar */}
			<Navbar />

			<div className='flex-1 flex overflow-hidden'>
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
											`https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
												getUserDisplayName(activeUser)
											)}`
										}
										alt={getUserDisplayName(activeUser)}
										online={activeUser?.isOnline}
									/>
									<div className='flex-1'>
										<p className='font-medium text-gray-900 dark:text-white'>
											{getUserDisplayName(activeUser)}
										</p>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											{isUserTyping
												? 'typing...'
												: activeUser?.isOnline
												? 'Online'
												: 'Offline'}
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
										Chat
									</h1>
								</div>
							</div>

							{/* Welcome message */}
							<div className='flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
								<div className='text-center'>
									<div className='w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4'>
										<svg
											className='w-8 h-8 text-primary-600 dark:text-primary-400'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
											/>
										</svg>
									</div>
									<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
										Select a conversation
									</h3>
									<p className='text-gray-500 dark:text-gray-400 text-center'>
										Choose a conversation from the sidebar to start messaging
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
		</div>
	);
}