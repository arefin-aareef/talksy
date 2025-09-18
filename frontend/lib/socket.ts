import { io, Socket } from 'socket.io-client';
import { Message, TypingUser, OnlineUser } from '@/types';

export type SocketEventHandlers = {
	'new-message': (message: Message) => void;
	'message-sent': (data: {
		id: string;
		tempId?: string;
		content: string;
		receiver: any;
		createdAt: string;
	}) => void;
	'user-online': (user: OnlineUser) => void;
	'user-offline': (data: { userId: string }) => void;
	'user-typing': (user: TypingUser) => void;
	'user-stop-typing': (data: { userId: string }) => void;
	connect: () => void;
	disconnect: () => void;
	error: (error: any) => void;
};

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

class SocketClient {
	private socket: Socket | null = null;
	private eventHandlers: Partial<SocketEventHandlers> = {};
	private connectionState: ConnectionState = 'disconnected';
	private currentToken: string | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 1000;

	async connect(token: string): Promise<void> {
		if (this.socket?.connected && this.currentToken === token) {
			return Promise.resolve();
		}

		// Disconnect existing connection if token changed
		if (this.socket && this.currentToken !== token) {
			this.disconnect();
		}

		this.currentToken = token;
		this.connectionState = 'connecting';

		return new Promise((resolve, reject) => {
			try {
				console.log('🔄 Attempting to connect to socket...');

				// Use separate URL for Socket.IO (without /api path)
				const socketUrl =
					process.env.NEXT_PUBLIC_SOCKET_URL ||
					process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
					'http://localhost:3001';
				console.log('🔗 Connecting to:', socketUrl);

				this.socket = io(socketUrl, {
					auth: {
						token,
					},
					// Specify the path explicitly (default Socket.IO path)
					path: '/socket.io/',
					// Allow both transports with polling as fallback
					transports: ['websocket', 'polling'],
					upgrade: true,
					rememberUpgrade: true,
					reconnection: true,
					reconnectionAttempts: this.maxReconnectAttempts,
					reconnectionDelay: this.reconnectDelay,
					timeout: 10000,
					forceNew: true,
					// Add autoConnect to ensure connection attempt
					autoConnect: true,
				});

				// Connection successful
				this.socket.on('connect', () => {
					console.log('✅ Socket connected successfully:', this.socket?.id);
					this.connectionState = 'connected';
					this.reconnectAttempts = 0;
					this.eventHandlers.connect?.();
					resolve();
				});

				// Connection failed
				this.socket.on('connect_error', error => {
					console.error('❌ Socket connection failed:', error);
					console.error('❌ Error details:', {
						message: error.message,
						stack: error.stack,
						// Log the entire error object to see all available properties
						fullError: error,
					});
					this.connectionState = 'error';
					this.eventHandlers.error?.(error);
					reject(new Error(`Connection failed: ${error.message}`));
				});

				// Setup other event listeners
				this.setupEventListeners();

				// Set a timeout for the connection attempt
				setTimeout(() => {
					if (this.connectionState === 'connecting') {
						this.connectionState = 'error';
						reject(new Error('Connection timeout'));
					}
				}, 15000);
			} catch (error) {
				this.connectionState = 'error';
				console.error('❌ Error creating socket connection:', error);
				reject(error);
			}
		});
	}

	disconnect() {
		if (this.socket) {
			console.log('🔌 Disconnecting socket...');
			this.socket.disconnect();
			this.socket = null;
		}
		this.connectionState = 'disconnected';
		this.currentToken = null;
		this.reconnectAttempts = 0;
	}

	private setupEventListeners() {
		if (!this.socket) return;

		this.socket.on('disconnect', reason => {
			console.log('❌ Socket disconnected:', reason);
			this.connectionState = 'disconnected';
			this.eventHandlers.disconnect?.();
		});

		this.socket.on('reconnect', attemptNumber => {
			console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
			this.connectionState = 'connected';
			this.reconnectAttempts = 0;
		});

		this.socket.on('reconnect_attempt', attemptNumber => {
			console.log('🔄 Socket reconnection attempt:', attemptNumber);
			this.connectionState = 'connecting';
			this.reconnectAttempts = attemptNumber;
		});

		this.socket.on('reconnect_error', error => {
			console.error('❌ Socket reconnection failed:', error);
			this.connectionState = 'error';
		});

		this.socket.on('reconnect_failed', () => {
			console.error('❌ Socket reconnection failed permanently');
			this.connectionState = 'error';
			this.eventHandlers.error?.(new Error('Reconnection failed'));
		});

		// Application-specific events
		this.socket.on('new-message', (message: Message) => {
			this.eventHandlers['new-message']?.(message);
		});

		this.socket.on('message-sent', data => {
			this.eventHandlers['message-sent']?.(data);
		});

		this.socket.on('user-online', (user: OnlineUser) => {
			this.eventHandlers['user-online']?.(user);
		});

		this.socket.on('user-offline', (data: { userId: string }) => {
			this.eventHandlers['user-offline']?.(data);
		});

		this.socket.on('user-typing', (user: TypingUser) => {
			this.eventHandlers['user-typing']?.(user);
		});

		this.socket.on('user-stop-typing', (data: { userId: string }) => {
			this.eventHandlers['user-stop-typing']?.(data);
		});
	}

	// Wait for connection if currently connecting
	async waitForConnection(timeoutMs = 10000): Promise<void> {
		if (this.connectionState === 'connected') {
			return Promise.resolve();
		}

		if (
			this.connectionState === 'error' ||
			this.connectionState === 'disconnected'
		) {
			throw new Error('Socket is not connected and not attempting to connect');
		}

		// If connecting, wait for it to complete
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(new Error('Timeout waiting for connection'));
			}, timeoutMs);

			const checkConnection = () => {
				if (this.connectionState === 'connected') {
					clearTimeout(timeout);
					resolve();
				} else if (
					this.connectionState === 'error' ||
					this.connectionState === 'disconnected'
				) {
					clearTimeout(timeout);
					reject(new Error('Connection failed while waiting'));
				} else {
					setTimeout(checkConnection, 100);
				}
			};

			checkConnection();
		});
	}

	on<K extends keyof SocketEventHandlers>(
		event: K,
		handler: SocketEventHandlers[K]
	) {
		this.eventHandlers[event] = handler as any;
	}

	off<K extends keyof SocketEventHandlers>(event: K) {
		delete this.eventHandlers[event];
	}

	async sendMessage(
		receiverId: string,
		content: string,
		tempId?: string
	): Promise<any> {
		await this.ensureConnected();

		return new Promise((resolve, reject) => {
			if (!this.socket?.connected) {
				reject(new Error('Socket not connected'));
				return;
			}

			// Emit with acknowledgment callback
			this.socket.emit(
				'send-message',
				{
					receiverId,
					content,
					tempId,
				},
				(response: any) => {
					if (response?.error) {
						reject(new Error(response.error));
					} else {
						resolve(response);
					}
				}
			);

			// Fallback timeout
			setTimeout(() => {
				reject(new Error('Message send timeout'));
			}, 10000);
		});
	}

	async markAsRead(messageId: string): Promise<any> {
		await this.ensureConnected();

		return new Promise((resolve, reject) => {
			if (!this.socket?.connected) {
				reject(new Error('Socket not connected'));
				return;
			}

			this.socket.emit('mark-as-read', { messageId }, (response: any) => {
				if (response?.error) {
					reject(new Error(response.error));
				} else {
					resolve(response);
				}
			});
		});
	}

	async startTyping(receiverId: string) {
		if (this.isConnected) {
			this.socket!.emit('typing-start', { receiverId });
		}
	}

	async stopTyping(receiverId: string) {
		if (this.isConnected) {
			this.socket!.emit('typing-stop', { receiverId });
		}
	}

	async joinConversation(conversationId: string) {
		await this.ensureConnected();
		this.socket!.emit('join-conversation', { conversationId });
	}

	async leaveConversation(conversationId: string) {
		if (this.isConnected) {
			this.socket!.emit('leave-conversation', { conversationId });
		}
	}

	// Ensure connection before performing operations
	private async ensureConnected(): Promise<void> {
		if (this.connectionState === 'connected') {
			return;
		}

		if (this.connectionState === 'connecting') {
			await this.waitForConnection();
			return;
		}

		if (
			this.connectionState === 'disconnected' ||
			this.connectionState === 'error'
		) {
			if (!this.currentToken) {
				throw new Error('No token available for reconnection');
			}
			await this.connect(this.currentToken);
		}
	}

	get isConnected(): boolean {
		return this.socket?.connected ?? false;
	}

	get connectionStatus(): ConnectionState {
		return this.connectionState;
	}

	get reconnectAttemptCount(): number {
		return this.reconnectAttempts;
	}
}

export const socketClient = new SocketClient();