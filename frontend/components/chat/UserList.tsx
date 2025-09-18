import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { Search, Users, UserCheck, UserX, MessageCircle } from 'lucide-react';
=======
import { Search, Users, UserCheck, UserX } from 'lucide-react';
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
<<<<<<< HEAD
import { Button } from '@/components/ui/Button';
=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
import { apiClient } from '@/lib/api';
import { User } from '@/types';

export function UserList() {
	const { onlineUsers, setActiveConversation } = useChat();
	const { user: currentUser } = useAuth();
<<<<<<< HEAD
	const router = useRouter();
=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const [searching, setSearching] = useState(false);
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
<<<<<<< HEAD
	const [hoveredUser, setHoveredUser] = useState<string | null>(null);
=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e

	// Fetch all users on component mount
	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				setLoading(true);
				const users = await apiClient.getUsers();
				setAllUsers(users.filter((user: any) => user._id !== currentUser?._id));
			} catch (error) {
				console.error('Error fetching users:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAllUsers();
	}, [currentUser]);

	const handleSearch = async (query: string) => {
		setSearchQuery(query);

		if (query.trim().length < 2) {
			setSearchResults([]);
			return;
		}

		try {
			setSearching(true);
			const results = await apiClient.searchUsers(query);
			setSearchResults(results.filter(user => user._id !== currentUser?._id));
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			setSearching(false);
		}
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

	// Separate online and offline users for organized display
	const onlineUsersToShow = usersToDisplay.filter(user => user.isOnline);
	const offlineUsersToShow = usersToDisplay.filter(user => !user.isOnline);

	const onlineCount = onlineUsersToShow.length;
	const offlineCount = offlineUsersToShow.length;

<<<<<<< HEAD
	const handleStartChat = (userId: string) => {
		// Navigate to chat page with the user
		router.push(`/chat?conversation=${userId}`);
	};

=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
	const renderUserList = (
		users: User[],
		title: string,
		icon: React.ReactNode
	) => {
		if (users.length === 0) return null;

		return (
			<div className='mb-4'>
				<div className='flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'>
					{icon}
					<span>
						{title} ({users.length})
					</span>
				</div>
				<div className='divide-y divide-gray-200 dark:divide-gray-700'>
					{users.map(user => (
<<<<<<< HEAD
						<div
							key={user._id}
							className='relative group p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
							onMouseEnter={() => setHoveredUser(user._id)}
							onMouseLeave={() => setHoveredUser(null)}
=======
						<button
							key={user._id}
							onClick={() => setActiveConversation(user._id)}
							className='w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
						>
							<div className='flex items-center space-x-3'>
								<Avatar
									src={user.avatar}
									alt={user.username}
									online={user.isOnline}
								/>
								<div className='flex-1 min-w-0'>
									<p className='font-medium text-gray-900 dark:text-white truncate'>
										{user.username}
									</p>
									<p
										className={`text-sm ${
											user.isOnline
												? 'text-green-500 dark:text-green-400'
												: 'text-gray-500 dark:text-gray-400'
										}`}
									>
										{user.isOnline ? 'Online' : 'Offline'}
									</p>
								</div>
<<<<<<< HEAD
								{/* Chat button - visible on hover (desktop) or always (mobile) */}
								<Button
									size='sm'
									onClick={() => handleStartChat(user._id)}
									className={`transition-all duration-200 ${
										hoveredUser === user._id || window.innerWidth < 1024
											? 'opacity-100 translate-x-0'
											: 'opacity-0 translate-x-2'
									} lg:absolute lg:right-2 lg:top-1/2 lg:transform lg:-translate-y-1/2`}
								>
									<MessageCircle className='h-4 w-4' />
									<span className='ml-1 hidden sm:inline'>Chat</span>
								</Button>
							</div>
						</div>
=======
							</div>
						</button>
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
					))}
				</div>
			</div>
		);
	};

	return (
		<div className='h-full flex flex-col'>
			{/* Header with search and filters */}
			<div className='p-4 border-b border-gray-200 dark:border-gray-700'>
				<div className='relative mb-3'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
					<Input
						placeholder='Search users...'
						className='pl-10'
						value={searchQuery}
						onChange={e => handleSearch(e.target.value)}
					/>
				</div>

				{/* Filter buttons */}
				<div className='flex space-x-1'>
					<button
						onClick={() => setFilter('all')}
						className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
							filter === 'all'
								? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
								: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
						}`}
					>
						<Users className='h-3 w-3' />
						<span>All ({onlineCount + offlineCount})</span>
					</button>
					<button
						onClick={() => setFilter('online')}
						className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
							filter === 'online'
								? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
								: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
						}`}
					>
						<UserCheck className='h-3 w-3' />
						<span>Online ({onlineCount})</span>
					</button>
					<button
						onClick={() => setFilter('offline')}
						className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
							filter === 'offline'
								? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
								: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
						}`}
					>
						<UserX className='h-3 w-3' />
						<span>Offline ({offlineCount})</span>
					</button>
				</div>
			</div>

			{/* User list */}
			<div className='flex-1 overflow-y-auto'>
				{loading ? (
					<div className='p-4 text-center text-gray-500 dark:text-gray-400'>
						<p>Loading users...</p>
					</div>
				) : usersToDisplay.length === 0 ? (
					<div className='p-4 text-center text-gray-500 dark:text-gray-400'>
						{searching ? (
							<p>Searching...</p>
						) : searchQuery ? (
							<p>No users found</p>
						) : filter === 'online' ? (
							<p>No users online</p>
						) : filter === 'offline' ? (
							<p>No offline users</p>
						) : (
							<p>No users available</p>
						)}
					</div>
				) : (
					<div>
						{filter === 'all' && !searchQuery ? (
							// Show organized sections when viewing all users without search
							<>
								{renderUserList(
									onlineUsersToShow,
									'Online',
									<UserCheck className='h-4 w-4 text-green-500' />
								)}
								{renderUserList(
									offlineUsersToShow,
									'Offline',
									<UserX className='h-4 w-4 text-gray-400' />
								)}
							</>
						) : (
							// Show flat list for filtered views or search results
							<div className='divide-y divide-gray-200 dark:divide-gray-700'>
								{usersToDisplay.map(user => (
<<<<<<< HEAD
									<div
										key={user._id}
										className='relative group p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
										onMouseEnter={() => setHoveredUser(user._id)}
										onMouseLeave={() => setHoveredUser(null)}
=======
									<button
										key={user._id}
										onClick={() => setActiveConversation(user._id)}
										className='w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
									>
										<div className='flex items-center space-x-3'>
											<Avatar
												src={user.avatar}
												alt={user.username}
												online={user.isOnline}
											/>
											<div className='flex-1 min-w-0'>
												<p className='font-medium text-gray-900 dark:text-white truncate'>
													{user.username}
												</p>
												<p
													className={`text-sm ${
														user.isOnline
															? 'text-green-500 dark:text-green-400'
															: 'text-gray-500 dark:text-gray-400'
													}`}
												>
													{user.isOnline ? 'Online' : 'Offline'}
												</p>
											</div>
<<<<<<< HEAD
											{/* Chat button - visible on hover (desktop) or always (mobile) */}
											<Button
												size='sm'
												onClick={() => handleStartChat(user._id)}
												className={`transition-all duration-200 ${
													hoveredUser === user._id || window.innerWidth < 1024
														? 'opacity-100 translate-x-0'
														: 'opacity-0 translate-x-2'
												} lg:absolute lg:right-2 lg:top-1/2 lg:transform lg:-translate-y-1/2`}
											>
												<MessageCircle className='h-4 w-4' />
												<span className='ml-1 hidden sm:inline'>Chat</span>
											</Button>
										</div>
									</div>
=======
										</div>
									</button>
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
<<<<<<< HEAD
}
=======
}
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
