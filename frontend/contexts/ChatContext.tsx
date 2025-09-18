'use client';

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from 'react';
import { User, Message, Conversation, TypingUser } from '@/types';
import { apiClient } from '@/lib/api';
import { socketClient } from '@/lib/socket';
import { useAuth } from './AuthContext';
<<<<<<< HEAD
import { TOAST_MESSAGES } from '@/lib/constants';
=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
import toast from 'react-hot-toast';

interface ChatContextType {
	// State
	conversations: Conversation[];
	messages: { [userId: string]: Message[] };
	activeConversation: string | null;
	onlineUsers: User[];
	typingUsers: TypingUser[];
	unreadCount: number;
	loading: boolean;

	// Socket connection state
	isSocketConnected: boolean;
	isSocketConnecting: boolean;
	socketConnectionError: string | null;
	socketReconnectAttempts: number;

	// Actions
	setActiveConversation: (userId: string) => void;
	sendMessage: (
		receiverId: string,
		content: string,
		tempId?: string
	) => Promise<void>;
	loadMessages: (userId: string, page?: number) => Promise<void>;
	markAsRead: (messageId: string) => void;
	startTyping: (receiverId: string) => void;
	stopTyping: (receiverId: string) => void;
	refreshConversations: () => Promise<void>;
	refreshOnlineUsers: () => Promise<void>;
	reconnectSocket: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
	const { user, token } = useAuth();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [messages, setMessages] = useState<{ [userId: string]: Message[] }>({});
	const [activeConversation, setActiveConversationState] = useState<
		string | null
	>(null);
	const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
	const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [loading, setLoading] = useState(false);

	// Socket connection state
	const [isSocketConnected, setIsSocketConnected] = useState(false);
	const [isSocketConnecting, setIsSocketConnecting] = useState(false);
	const [socketConnectionError, setSocketConnectionError] = useState<
		string | null
	>(null);
	const [socketReconnectAttempts, setSocketReconnectAttempts] = useState(0);

<<<<<<< HEAD
	// Helper function to update conversation order
	const updateConversationOrder = useCallback(
		(userId: string, messageData?: Message) => {
			setConversations(prevConversations => {
				const updatedConversations = prevConversations.map(conv => {
					if (conv.user._id === userId) {
						return {
							...conv,
							lastMessage: messageData || conv.lastMessage,
							lastMessageTime:
								messageData?.createdAt || new Date().toISOString(),
						};
					}
					return conv;
				});

				// Sort conversations by last message time (most recent first)
				return updatedConversations.sort((a, b) => {
					const aTime = new Date(
						a.lastMessageTime || a.lastMessage?.createdAt || 0
					).getTime();
					const bTime = new Date(
						b.lastMessageTime || b.lastMessage?.createdAt || 0
					).getTime();
					return bTime - aTime;
				});
			});
		},
		[]
	);

=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
	// Initialize socket connection when user is authenticated
	useEffect(() => {
		if (user && token) {
			initializeSocket();
			refreshConversations();
			refreshOnlineUsers();
			loadUnreadCount();
		} else {
			// Disconnect socket when user logs out
			socketClient.disconnect();
			setIsSocketConnected(false);
			setIsSocketConnecting(false);
			setSocketConnectionError(null);
			setSocketReconnectAttempts(0);
		}
	}, [user, token]);

	// Monitor socket connection status
	useEffect(() => {
		const statusInterval = setInterval(() => {
			setIsSocketConnected(socketClient.isConnected);
			setSocketReconnectAttempts(socketClient.reconnectAttemptCount);
		}, 1000);

		return () => clearInterval(statusInterval);
	}, []);

	const initializeSocket = async () => {
		if (!token) return;

		try {
			setIsSocketConnecting(true);
			setSocketConnectionError(null);

			await socketClient.connect(token);

			setIsSocketConnected(true);
			console.log('✅ Socket connected successfully');

			// Setup event listeners after successful connection
			setupSocketEventListeners();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Socket connection failed';
			console.error('❌ Socket connection failed:', errorMessage);
			setSocketConnectionError(errorMessage);
			setIsSocketConnected(false);

			// Show user-friendly error message
<<<<<<< HEAD
			toast.error(TOAST_MESSAGES.connectionFailed);
=======
			toast.error('Connection failed. Some features may not work properly.');
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
		} finally {
			setIsSocketConnecting(false);
		}
	};

	const reconnectSocket = async () => {
		if (!token) return;

		try {
			setIsSocketConnecting(true);
			setSocketConnectionError(null);

			// Force disconnect first
			socketClient.disconnect();

			// Wait a bit before reconnecting
			await new Promise(resolve => setTimeout(resolve, 1000));

			await socketClient.connect(token);

			setIsSocketConnected(true);
			setupSocketEventListeners();

<<<<<<< HEAD
			toast.success(TOAST_MESSAGES.connectionRestored);
=======
			toast.success('Connection restored!');
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Reconnection failed';
			setSocketConnectionError(errorMessage);
			setIsSocketConnected(false);
			toast.error('Failed to reconnect');
		} finally {
			setIsSocketConnecting(false);
		}
	};

	const setupSocketEventListeners = useCallback(() => {
		// Connection events
		socketClient.on('connect', () => {
			setIsSocketConnected(true);
			setIsSocketConnecting(false);
			setSocketConnectionError(null);
			setSocketReconnectAttempts(0);
		});

		socketClient.on('disconnect', () => {
			setIsSocketConnected(false);
			setIsSocketConnecting(false);
		});

		socketClient.on('error', error => {
			const errorMessage = error?.message || 'Socket error occurred';
			setSocketConnectionError(errorMessage);
			setIsSocketConnected(false);
			setIsSocketConnecting(false);
		});

		// Message events
		socketClient.on('new-message', handleNewMessage);
		socketClient.on('message-sent', handleMessageSent);

		// User status events
		socketClient.on('user-online', handleUserOnline);
		socketClient.on('user-offline', handleUserOffline);

		// Typing events
		socketClient.on('user-typing', handleUserTyping);
		socketClient.on('user-stop-typing', handleUserStopTyping);

		return () => {
			socketClient.off('connect');
			socketClient.off('disconnect');
			socketClient.off('error');
			socketClient.off('new-message');
			socketClient.off('message-sent');
			socketClient.off('user-online');
			socketClient.off('user-offline');
			socketClient.off('user-typing');
			socketClient.off('user-stop-typing');
		};
	}, []);

	const handleNewMessage = useCallback(
		(message: Message) => {
			const senderId = message.sender._id;

			// Add message to the conversation
			setMessages(prev => ({
				...prev,
<<<<<<< HEAD
				[senderId]: [...(prev[senderId] || []), message],
			}));

			// Update conversation order
			updateConversationOrder(senderId, message);
=======
				[senderId]: [message, ...(prev[senderId] || [])],
			}));

			// Update conversations list
			refreshConversations();
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e

			// Update unread count
			setUnreadCount(prev => prev + 1);

			// Show notification if not in active conversation
			if (activeConversation !== senderId) {
				toast.success(`New message from ${message.sender.username}`, {
					duration: 3000,
					position: 'top-right',
				});
			}
		},
<<<<<<< HEAD
		[activeConversation, updateConversationOrder]
	);

	const handleMessageSent = useCallback(
		(data: any) => {
			const receiverId = data.receiver._id;

			// Update the temporary message with real ID
			if (data.tempId) {
				setMessages(prev => ({
					...prev,
					[receiverId]:
						prev[receiverId]?.map(msg =>
							msg.tempId === data.tempId
								? { ...msg, _id: data.id, tempId: undefined }
								: msg
						) || [],
				}));
			}

			// Update conversation order with the sent message
			const sentMessage: Message = {
				_id: data.id,
				sender: user!,
				receiver: data.receiver,
				content: data.content,
				type: 'text',
				isRead: false,
				isDeleted: false,
				createdAt: data.createdAt || new Date().toISOString(),
			};

			updateConversationOrder(receiverId, sentMessage);
		},
		[user, updateConversationOrder]
	);
=======
		[activeConversation]
	);

	const handleMessageSent = useCallback((data: any) => {
		const receiverId = data.receiver._id;

		// Update the temporary message with real ID
		if (data.tempId) {
			setMessages(prev => ({
				...prev,
				[receiverId]:
					prev[receiverId]?.map(msg =>
						msg.tempId === data.tempId
							? { ...msg, _id: data.id, tempId: undefined }
							: msg
					) || [],
			}));
		}

		// Refresh conversations to update last message
		refreshConversations();
	}, []);
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e

	const handleUserOnline = useCallback((user: any) => {
		setOnlineUsers(prev => {
			const exists = prev.find(u => u._id === user.userId);
			if (exists) return prev;
			return [
				...prev,
				{
					_id: user.userId,
					username: user.username,
					avatar: user.avatar,
					isOnline: true,
				} as User,
			];
		});
	}, []);

	const handleUserOffline = useCallback((data: { userId: string }) => {
		setOnlineUsers(prev => prev.filter(user => user._id !== data.userId));
	}, []);

	const handleUserTyping = useCallback((user: TypingUser) => {
		setTypingUsers(prev => {
			const exists = prev.find(u => u.userId === user.userId);
			if (exists) return prev;
			return [...prev, user];
		});
	}, []);

	const handleUserStopTyping = useCallback((data: { userId: string }) => {
		setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
	}, []);

	const refreshConversations = async () => {
		try {
			const data = await apiClient.getConversations();
<<<<<<< HEAD
			// Sort conversations when they're first loaded
			const sortedData = data.sort((a: Conversation, b: Conversation) => {
				const aTime = new Date(
					a.lastMessageTime || a.lastMessage?.createdAt || 0
				).getTime();
				const bTime = new Date(
					b.lastMessageTime || b.lastMessage?.createdAt || 0
				).getTime();
				return bTime - aTime;
			});
			setConversations(sortedData);
		} catch (error) {
			console.error('Error loading conversations:', error);
			toast.error(TOAST_MESSAGES.conversationsLoadFailed);
=======
			setConversations(data);
		} catch (error) {
			console.error('Error loading conversations:', error);
			toast.error('Failed to load conversations');
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
		}
	};

	const refreshOnlineUsers = async () => {
		try {
			const data = await apiClient.getOnlineUsers();
			setOnlineUsers(data);
		} catch (error) {
			console.error('Error loading online users:', error);
		}
	};

	const loadUnreadCount = async () => {
		try {
			const data = await apiClient.getUnreadCount();
			setUnreadCount(data.count);
		} catch (error) {
			console.error('Error loading unread count:', error);
		}
	};

	const setActiveConversation = (userId: string) => {
		setActiveConversationState(userId);
		// Load messages if not already loaded
		if (!messages[userId]) {
			loadMessages(userId);
		}
		// Clear typing indicator for this user
		setTypingUsers(prev => prev.filter(user => user.userId !== userId));
	};

	const loadMessages = async (userId: string, page: number = 1) => {
		try {
			setLoading(true);
			const data = await apiClient.getConversation(userId, page);

			if (page === 1) {
				setMessages(prev => ({ ...prev, [userId]: data.reverse() }));
			} else {
				setMessages(prev => ({
					...prev,
					[userId]: [...data.reverse(), ...(prev[userId] || [])],
				}));
			}
		} catch (error) {
			console.error('Error loading messages:', error);
<<<<<<< HEAD
			toast.error(TOAST_MESSAGES.messagesLoadFailed);
=======
			toast.error('Failed to load messages');
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
		} finally {
			setLoading(false);
		}
	};

	const sendMessage = async (
		receiverId: string,
		content: string,
		tempId?: string
	) => {
		if (!content.trim() || !user) return;

		const messageId = tempId || `temp-${Date.now()}-${Math.random()}`;
		const tempMessage: Message = {
			_id: messageId,
<<<<<<< HEAD
			sender: {
				...user,
				_id: user.id, // Convert id to _id for consistency with message structure
			},
=======
			sender: user,
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
			receiver: { _id: receiverId } as User,
			content,
			type: 'text',
			isRead: false,
			isDeleted: false,
			createdAt: new Date().toISOString(),
			tempId: messageId,
		};

		// Add optimistic message
		setMessages(prev => ({
			...prev,
			[receiverId]: [...(prev[receiverId] || []), tempMessage],
		}));

<<<<<<< HEAD
		// Immediately update conversation order when sending
		updateConversationOrder(receiverId, tempMessage);

=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
		try {
			// Try to send via socket first
			if (isSocketConnected) {
				await socketClient.sendMessage(receiverId, content, messageId);
			} else {
				// Fallback to API if socket is not connected
				console.warn('Socket not connected, using API fallback');
				const response = await apiClient.sendMessage({
					receiver: receiverId,
					content,
				});

				// Update the temp message with real data
				setMessages(prev => ({
					...prev,
					[receiverId]:
						prev[receiverId]?.map(msg =>
							msg.tempId === messageId
								? { ...response, tempId: undefined }
								: msg
						) || [],
				}));

<<<<<<< HEAD
				// Update conversation order with real message data
				updateConversationOrder(receiverId, response);
=======
				// Refresh conversations
				refreshConversations();
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
			}
		} catch (error) {
			console.error('Error sending message:', error);

			// Remove optimistic message on error
			setMessages(prev => ({
				...prev,
				[receiverId]:
					prev[receiverId]?.filter(msg => msg.tempId !== messageId) || [],
			}));

			// Show error with retry option
<<<<<<< HEAD
			toast.error(TOAST_MESSAGES.messageFailed, {
=======
			toast.error('Failed to send message', {
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
				duration: 4000,
				style: {
					background: '#363636',
					color: '#fff',
				},
			});

			throw error;
		}
	};

	const markAsRead = (messageId: string) => {
		try {
			if (isSocketConnected) {
				socketClient.markAsRead(messageId);
			} else {
				// Fallback to API
				apiClient.markAsRead(messageId);
			}

			// Update local state optimistically
			setMessages(prev => {
				const updated = { ...prev };
				Object.keys(updated).forEach(userId => {
					updated[userId] = updated[userId].map(msg =>
						msg._id === messageId ? { ...msg, isRead: true } : msg
					);
				});
				return updated;
			});
		} catch (error) {
			console.error('Error marking message as read:', error);
		}
	};

	const startTyping = (receiverId: string) => {
		try {
			if (isSocketConnected) {
				socketClient.startTyping(receiverId);
			}
		} catch (error) {
			console.error('Error starting typing:', error);
		}
	};

	const stopTyping = (receiverId: string) => {
		try {
			if (isSocketConnected) {
				socketClient.stopTyping(receiverId);
			}
		} catch (error) {
			console.error('Error stopping typing:', error);
		}
	};

	const contextValue: ChatContextType = {
		// State
		conversations,
		messages,
		activeConversation,
		onlineUsers,
		typingUsers,
		unreadCount,
		loading,

		// Socket connection state
		isSocketConnected,
		isSocketConnecting,
		socketConnectionError,
		socketReconnectAttempts,

		// Actions
		setActiveConversation,
		sendMessage,
		loadMessages,
		markAsRead,
		startTyping,
		stopTyping,
		refreshConversations,
		refreshOnlineUsers,
		reconnectSocket,
	};

	return (
		<ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
	);
}

export function useChat() {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error('useChat must be used within a ChatProvider');
	}
	return context;
<<<<<<< HEAD
}
=======
}
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
