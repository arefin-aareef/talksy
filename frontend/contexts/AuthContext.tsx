'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse, LoginData, RegisterData } from '@/types';
import { apiClient } from '@/lib/api';
import { socketClient } from '@/lib/socket';
import toast from 'react-hot-toast';

interface AuthContextType {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (data: LoginData) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => void;
	updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Initialize auth state from localStorage
		const initializeAuth = async () => {
			try {
				const storedToken = localStorage.getItem('token');
				const storedUser = localStorage.getItem('user');

				if (storedToken && storedUser) {
					setToken(storedToken);
					setUser(JSON.parse(storedUser));

					// Verify token is still valid
					try {
						const userData = await apiClient.getProfile();
						setUser(userData);

						// Connect to socket
						socketClient.connect(storedToken);
					} catch (error) {
						// Token is invalid, clear storage
						localStorage.removeItem('token');
						localStorage.removeItem('user');
						setToken(null);
						setUser(null);
					}
				}
			} catch (error) {
				console.error('Error initializing auth:', error);
			} finally {
				setLoading(false);
			}
		};

		initializeAuth();

		// Cleanup on unmount
		return () => {
			socketClient.disconnect();
		};
	}, []);

	const login = async (data: LoginData) => {
		try {
			const response: AuthResponse = await apiClient.login(data);

			setToken(response.access_token);
			setUser(response.user);

			localStorage.setItem('token', response.access_token);
			localStorage.setItem('user', JSON.stringify(response.user));

			// Connect to socket
			socketClient.connect(response.access_token);

			toast.success(`Welcome back, ${response.user.username}!`);
		} catch (error: any) {
			const message = error.response?.data?.message || 'Login failed';
			toast.error(message);
			throw error;
		}
	};

	const register = async (data: RegisterData) => {
		try {
			const response: AuthResponse = await apiClient.register(data);

			setToken(response.access_token);
			setUser(response.user);

			localStorage.setItem('token', response.access_token);
			localStorage.setItem('user', JSON.stringify(response.user));

			// Connect to socket
			socketClient.connect(response.access_token);

			toast.success(`Welcome to Chat App, ${response.user.username}!`);
		} catch (error: any) {
			const message = error.response?.data?.message || 'Registration failed';
			toast.error(message);
			throw error;
		}
	};

	const logout = async () => {
		try {
			if (token) {
				await apiClient.logout();
			}
		} catch (error) {
			// Ignore logout errors
			console.error('Error during logout:', error);
		} finally {
			setToken(null);
			setUser(null);
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			socketClient.disconnect();
			toast.success('Logged out successfully');
		}
	};

	const updateUser = (updatedUser: User) => {
		setUser(updatedUser);
		localStorage.setItem('user', JSON.stringify(updatedUser));
	};

	const contextValue: AuthContextType = {
		user,
		token,
		loading,
		login,
		register,
		logout,
		updateUser,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
