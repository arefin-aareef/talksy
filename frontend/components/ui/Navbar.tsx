'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogOut, Sun, Moon, Search } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';

interface NavbarProps {
	className?: string;
	searchQuery?: string;
	onSearchChange?: (query: string) => void;
}

export function Navbar({
	className = '',
	searchQuery = '',
	onSearchChange,
}: NavbarProps) {
	const { user, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();

	return (
		<nav
			className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 ${className}`}
		>
			<div className='max-w-7xl mx-auto flex items-center justify-between'>
				{/* Logo */}
				<div className='flex items-center space-x-2'>
					<div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
						<span className='text-white font-bold text-sm'>T</span>
					</div>
					<span className='text-xl font-bold text-gray-900 dark:text-white'>
						{APP_CONFIG.name}
					</span>
				</div>

				{/* Desktop Search Bar */}
				{onSearchChange && (
					<div className='hidden lg:block flex-1 max-w-md mx-8'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
							<Input
								placeholder='Search users...'
								className='pl-10'
								value={searchQuery}
								onChange={e => onSearchChange(e.target.value)}
							/>
						</div>
					</div>
				)}

				{/* Right side actions */}
				<div className='flex items-center space-x-3'>
					{/* Theme toggle */}
					<Button
						variant='ghost'
						size='sm'
						onClick={toggleTheme}
						className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
						title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
					>
						{theme === 'light' ? (
							<Moon className='h-4 w-4' />
						) : (
							<Sun className='h-4 w-4' />
						)}
					</Button>

					{/* User info and logout */}
					{user && (
						<div className='flex items-center space-x-3'>
							<div className='hidden sm:block text-right'>
								<p className='text-sm font-medium text-gray-900 dark:text-white'>
									{user.username}
								</p>
								<p className='text-xs text-gray-500 dark:text-gray-400'>
									{user.email}
								</p>
							</div>
							<Button
								variant='ghost'
								size='sm'
								onClick={logout}
								className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
								title='Logout'
							>
								<LogOut className='h-4 w-4' />
							</Button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
