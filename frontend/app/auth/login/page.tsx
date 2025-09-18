'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
<<<<<<< HEAD
import { APP_CONFIG } from '@/lib/constants';
=======
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			setLoading(true);
			await login(data);
			router.push('/');
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
			<Card className='w-full max-w-md space-y-8 p-8'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
						Welcome Back
					</h2>
					<p className='mt-2 text-gray-600 dark:text-gray-400'>
<<<<<<< HEAD
						Sign in to your {APP_CONFIG.name} account
=======
						Sign in to your Talksy account
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
					</p>
				</div>

				<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
							Email
						</label>
						<Input
							type='email'
							placeholder='Enter your email'
							error={errors.email?.message}
							{...register('email')}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
							Password
						</label>
						<Input
							type='password'
							placeholder='Enter your password'
							error={errors.password?.message}
							{...register('password')}
						/>
					</div>

					<Button type='submit' className='w-full' loading={loading}>
						Sign In
					</Button>
				</form>

				<div className='text-center'>
					<p className='text-gray-600 dark:text-gray-400'>
						Don't have an account?{' '}
						<Link
							href='/auth/register'
							className='text-primary-600 hover:text-primary-500 font-medium'
						>
							Sign up
						</Link>
					</p>
				</div>
			</Card>
		</div>
	);
}
