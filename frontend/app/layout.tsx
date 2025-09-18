import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { APP_CONFIG } from '@/lib/constants';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: `${APP_CONFIG.name} - Real-time Messaging`,
	description: APP_CONFIG.description,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' className='h-full' suppressHydrationWarning>
			<body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
				<ThemeProvider>
					<AuthProvider>
						<ChatProvider>
							{children}
							<Toaster
								position='top-right'
								toastOptions={{
									duration: 4000,
									style: {
										background: '#363636',
										color: '#fff',
									},
								}}
							/>
						</ChatProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
