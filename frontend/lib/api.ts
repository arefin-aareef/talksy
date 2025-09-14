import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
	AuthResponse,
	LoginData,
	RegisterData,
	User,
	Message,
	Conversation,
	SendMessageData,
} from '@/types';

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		// Request interceptor to add auth token
		this.client.interceptors.request.use(
			config => {
				if (typeof window !== 'undefined') {
					const token = localStorage.getItem('token');
					if (token) {
						config.headers.Authorization = `Bearer ${token}`;
					}
				}
				return config;
			},
			error => {
				return Promise.reject(error);
			}
		);

		// Response interceptor to handle errors
		this.client.interceptors.response.use(
			(response: AxiosResponse) => response,
			error => {
				if (error.response?.status === 401) {
					// Token expired or invalid
					if (typeof window !== 'undefined') {
						localStorage.removeItem('token');
						localStorage.removeItem('user');
						window.location.href = '/auth/login';
					}
				}
				return Promise.reject(error);
			}
		);
	}

	// Auth endpoints
	async login(data: LoginData): Promise<AuthResponse> {
		const response = await this.client.post<AuthResponse>('/auth/login', data);
		return response.data;
	}

	async register(data: RegisterData): Promise<AuthResponse> {
		const response = await this.client.post<AuthResponse>(
			'/auth/register',
			data
		);
		return response.data;
	}

	async getProfile(): Promise<User> {
		const response = await this.client.get<User>('/auth/profile');
		return response.data;
	}

	async logout(): Promise<void> {
		await this.client.post('/auth/logout');
	}

	// User endpoints
	async getUsers(): Promise<User[]> {
		const response = await this.client.get<User[]>('/users');
		return response.data;
	}

	async searchUsers(query: string): Promise<User[]> {
		const response = await this.client.get<User[]>(
			`/users/search?q=${encodeURIComponent(query)}`
		);
		return response.data;
	}

	async getOnlineUsers(): Promise<User[]> {
		const response = await this.client.get<User[]>('/users/online');
		return response.data;
	}

	// Message endpoints
	async sendMessage(data: SendMessageData): Promise<Message> {
		const response = await this.client.post<Message>('/messages', data);
		return response.data;
	}

	async getConversations(): Promise<Conversation[]> {
		const response = await this.client.get<Conversation[]>(
			'/messages/conversations'
		);
		return response.data;
	}

	async getConversation(
		userId: string,
		page: number = 1,
		limit: number = 50
	): Promise<Message[]> {
		const response = await this.client.get<Message[]>(
			`/messages/conversation/${userId}?page=${page}&limit=${limit}`
		);
		return response.data;
	}

	async markAsRead(messageId: string): Promise<void> {
		await this.client.patch(`/messages/${messageId}/read`);
	}

	async getUnreadCount(): Promise<{ count: number }> {
		const response = await this.client.get<{ count: number }>(
			'/messages/unread-count'
		);
		return response.data;
	}

	async deleteMessage(messageId: string): Promise<void> {
		await this.client.delete(`/messages/${messageId}`);
	}
}

export const apiClient = new ApiClient();
