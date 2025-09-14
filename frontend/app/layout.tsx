import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Talksy - Real-time Messaging',
	description: 'A modern chat application built with Next.js and NestJS',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
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
			</body>
		</html>
	);
}
