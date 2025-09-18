import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
<<<<<<< HEAD
import { ThemeProvider } from '@/contexts/ThemeContext';
import { APP_CONFIG } from '@/lib/constants';
=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
<<<<<<< HEAD
	title: `${APP_CONFIG.name} - Real-time Messaging`,
	description: APP_CONFIG.description,
=======
	title: 'Talksy - Real-time Messaging',
	description: 'A modern chat application built with Next.js and NestJS',
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
<<<<<<< HEAD
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
=======
		<html lang='en' className='h-full'>
			<body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
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
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
			</body>
		</html>
	);
}
