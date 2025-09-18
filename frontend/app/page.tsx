'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
<<<<<<< HEAD
import { UserCard } from '@/components/chat/UserCard';
import { Navbar } from '@/components/ui/Navbar';
import { Input } from '@/components/ui/Input';
import { Search, Users, UserCheck, UserX } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { User } from '@/types';
import { APP_CONFIG } from '@/lib/constants';

export default function HomePage() {
	const { user, loading: authLoading } = useAuth();
	const { onlineUsers } = useChat();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const [searching, setSearching] = useState(false);
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
=======
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
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e

	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/auth/login');
		}
	}, [user, authLoading, router]);

<<<<<<< HEAD
	// Fetch all users on component mount
	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				setLoading(true);
				const users = await apiClient.getUsers();
				setAllUsers(
					users.filter((userItem: any) => userItem._id !== user?._id)
				);
			} catch (error) {
				console.error('Error fetching users:', error);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			fetchAllUsers();
		}
	}, [user]);

	const handleSearch = async (query: string) => {
		setSearchQuery(query);

		if (query.trim().length < 2) {
			setSearchResults([]);
			return;
		}

		try {
			setSearching(true);
			const results = await apiClient.searchUsers(query);
			setSearchResults(results.filter(userItem => userItem._id !== user?._id));
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			setSearching(false);
		}
	};

	const handleStartChat = (userId: string) => {
		router.push(`/chat?conversation=${userId}`);
	};

	// Determine which users to display based on search and filter
	const getFilteredUsers = () => {
		const baseUsers = searchQuery ? searchResults : allUsers;

		switch (filter) {
			case 'online':
				return baseUsers.filter(user => user.isOnline);
			case 'offline':
				return baseUsers.filter(user => !user.isOnline);
			default:
				return baseUsers;
		}
	};

	const usersToDisplay = getFilteredUsers();
	const onlineCount = usersToDisplay.filter(user => user.isOnline).length;
	const offlineCount = usersToDisplay.filter(user => !user.isOnline).length;
=======
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
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e

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

<<<<<<< HEAD
	return (
		<div className='h-screen flex flex-col bg-gray-50 dark:bg-gray-900'>
			{/* Navbar */}
			<Navbar searchQuery={searchQuery} onSearchChange={handleSearch} />

			{/* Main Content */}
			<div className='flex-1 overflow-hidden'>
				<div className='max-w-7xl mx-auto px-4 py-6'>
					{/* Mobile Search Bar */}
					<div className='mb-6 lg:hidden'>
						<div className='max-w-md mx-auto'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
								<Input
									placeholder='Search users...'
									className='pl-10'
									value={searchQuery}
									onChange={e => handleSearch(e.target.value)}
								/>
							</div>
						</div>
					</div>

					{/* Filter Buttons */}
					<div className='flex justify-center space-x-2 mb-6'>
						<button
							onClick={() => setFilter('all')}
							className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								filter === 'all'
									? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
									: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
							}`}
						>
							<Users className='h-4 w-4' />
							<span>All ({allUsers.length})</span>
						</button>
						<button
							onClick={() => setFilter('online')}
							className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								filter === 'online'
									? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
									: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
							}`}
						>
							<UserCheck className='h-4 w-4' />
							<span>Online ({onlineCount})</span>
						</button>
						<button
							onClick={() => setFilter('offline')}
							className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								filter === 'offline'
									? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
									: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
							}`}
						>
							<UserX className='h-4 w-4' />
							<span>Offline ({offlineCount})</span>
						</button>
					</div>

					{/* User Cards Grid */}
					<div className='overflow-y-auto max-h-[calc(100vh-300px)]'>
						{loading ? (
							<div className='flex items-center justify-center py-12'>
								<LoadingSpinner />
							</div>
						) : usersToDisplay.length === 0 ? (
							<div className='text-center py-12'>
								<div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
									<Users className='w-8 h-8 text-gray-400' />
								</div>
								<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
									No users found
								</h3>
								<p className='text-gray-500 dark:text-gray-400'>
									{searching
										? 'Searching...'
										: searchQuery
										? 'Try a different search term'
										: filter === 'online'
										? 'No users are currently online'
										: filter === 'offline'
										? 'No offline users'
										: 'No users available'}
								</p>
							</div>
						) : (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
								{usersToDisplay.map(userItem => (
									<UserCard
										key={userItem._id}
										user={userItem}
										onStartChat={handleStartChat}
									/>
								))}
							</div>
						)}
					</div>
				</div>
=======
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
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
			</div>
		</div>
	);
}
