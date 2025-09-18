// Global constants for the application
export const APP_CONFIG = {
	name: 'Talksy',
	description: 'Real-time messaging application',
	version: '1.0.0',
} as const;

// Toast messages
export const TOAST_MESSAGES = {
	welcome: (username: string) => `Welcome to ${APP_CONFIG.name}, ${username}!`,
	welcomeBack: (username: string) =>
		`Welcome back to ${APP_CONFIG.name}, ${username}!`,
	loggedOut: `Logged out from ${APP_CONFIG.name} successfully`,
	connectionRestored: 'Connection restored!',
	connectionFailed: 'Connection failed. Some features may not work properly.',
	messageSent: 'Message sent successfully',
	messageFailed: 'Failed to send message',
	loginFailed: 'Login failed',
	registrationFailed: 'Registration failed',
	conversationsLoadFailed: 'Failed to load conversations',
	messagesLoadFailed: 'Failed to load messages',
	usersLoadFailed: 'Failed to load users',
} as const;

// API endpoints
export const API_ENDPOINTS = {
	auth: {
		login: '/auth/login',
		register: '/auth/register',
		profile: '/auth/profile',
		logout: '/auth/logout',
	},
	users: {
		list: '/users',
		search: '/users/search',
		online: '/users/online',
	},
	messages: {
		send: '/messages',
		conversations: '/messages/conversations',
		conversation: '/messages/conversation',
		markRead: '/messages',
		unreadCount: '/messages/unread-count',
	},
} as const;

// UI constants
export const UI_CONSTANTS = {
	maxMessageLength: 1000,
	typingTimeout: 2000,
	reconnectAttempts: 5,
	reconnectDelay: 1000,
	messageLoadLimit: 50,
} as const;
