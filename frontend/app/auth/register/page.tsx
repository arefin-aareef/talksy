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

const registerSchema = z
	.object({
		email: z.string().email('Please enter a valid email address'),
		username: z
			.string()
			.min(2, 'Username must be at least 2 characters')
			.max(50, 'Username cannot exceed 50 characters'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const { register: registerUser } = useAuth();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterFormData) => {
		try {
			setLoading(true);
			await registerUser({
				email: data.email,
				username: data.username,
				password: data.password,
			});
			router.push('/');
		} catch (error) {
			// Error handled by AuthContext
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
			<Card className='w-full max-w-md space-y-8 p-8'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
						Create Account
					</h2>
					<p className='mt-2 text-gray-600 dark:text-gray-400'>
<<<<<<< HEAD
						Join our {APP_CONFIG.name} community
=======
						Join our Talksy community
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
							Username
						</label>
						<Input
							type='text'
							placeholder='Choose a username'
							error={errors.username?.message}
							{...register('username')}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
							Password
						</label>
						<Input
							type='password'
							placeholder='Create a password'
							error={errors.password?.message}
							{...register('password')}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
							Confirm Password
						</label>
						<Input
							type='password'
							placeholder='Confirm your password'
							error={errors.confirmPassword?.message}
							{...register('confirmPassword')}
						/>
					</div>

					<Button type='submit' className='w-full' loading={loading}>
						Create Account
					</Button>
				</form>

				<div className='text-center'>
					<p className='text-gray-600 dark:text-gray-400'>
						Already have an account?{' '}
						<Link
							href='/auth/login'
							className='text-primary-600 hover:text-primary-500 font-medium'
						>
							Sign in
						</Link>
					</p>
				</div>
			</Card>
		</div>
	);
}
