export interface User {
	_id: string;
	email: string;
	username: string;
	avatar: string;
	isOnline: boolean;
	lastSeen: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface Message {
	_id: string;
	sender: User;
	receiver: User;
	content: string;
	type: 'text' | 'image' | 'file';
	isRead: boolean;
	readAt?: string;
	isDeleted: boolean;
	createdAt: string;
	updatedAt?: string;
	tempId?: string; // For optimistic updates
}

export interface Conversation {
	_id: string;
	user: User;
	lastMessage?: {
		_id: string;
		content: string;
		createdAt: string;
		isRead: boolean;
	};
	lastMessageTime?: string; // Added for conversation sorting
	unreadCount: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface AuthResponse {
	access_token: string;
	user: User;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	username: string;
	password: string;
}

export interface SendMessageData {
	receiver: string;
	content: string;
	tempId?: string;
}

export interface TypingUser {
	userId: string;
	username: string;
}

export interface OnlineUser {
	userId: string;
	username: string;
	avatar: string;
}

export interface ApiError {
	message: string;
	statusCode: number;
	error?: string;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface MessageResponse {
	data: Message[];
	meta: PaginationMeta;
}

export interface User {
	id: string; // Changed from _id to id
	email: string;
	username: string;
	avatar: string;
	isOnline: boolean;
	lastSeen: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface Message {
	_id: string;
	sender: User;
	receiver: User;
	content: string;
	type: 'text' | 'image' | 'file';
	isRead: boolean;
	readAt?: string;
	isDeleted: boolean;
	createdAt: string;
	updatedAt?: string;
	tempId?: string; // For optimistic updates
}

export interface Conversation {
	_id: string;
	user: User;
	lastMessage?: {
		_id: string;
		content: string;
		createdAt: string;
		isRead: boolean;
	};
	lastMessageTime?: string; // Added for conversation sorting
	unreadCount: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface AuthResponse {
	access_token: string;
	user: User;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	username: string;
	password: string;
}

export interface SendMessageData {
	receiver: string;
	content: string;
	tempId?: string;
}

export interface TypingUser {
	userId: string;
	username: string;
}

export interface OnlineUser {
	userId: string;
	username: string;
	avatar: string;
}

export interface ApiError {
	message: string;
	statusCode: number;
	error?: string;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface MessageResponse {
	data: Message[];
	meta: PaginationMeta;
}