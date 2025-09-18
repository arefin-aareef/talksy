'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
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

	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/auth/login');
		}
	}, [user, authLoading, router]);

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
			</div>
		</div>
	);
}
