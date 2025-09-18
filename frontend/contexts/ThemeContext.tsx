'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('light');
	const [mounted, setMounted] = useState(false);

	// Initialize theme from localStorage or system preference
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as Theme;
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
			.matches
			? 'dark'
			: 'light';
		const initialTheme = savedTheme || systemTheme;

		setThemeState(initialTheme);
		setMounted(true);
	}, []);

	// Apply theme to document
	useEffect(() => {
		if (mounted) {
			const root = document.documentElement;
			root.classList.remove('light', 'dark');
			root.classList.add(theme);

			// Update meta theme-color for mobile browsers
			const metaThemeColor = document.querySelector('meta[name="theme-color"]');
			if (metaThemeColor) {
				metaThemeColor.setAttribute(
					'content',
					theme === 'dark' ? '#0f172a' : '#ffffff'
				);
			}
		}
	}, [theme, mounted]);

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		localStorage.setItem('theme', newTheme);
	};

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
	};

	// Listen for system theme changes
	useEffect(() => {
		if (!mounted) return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem('theme')) {
				setTheme(e.matches ? 'dark' : 'light');
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [mounted]);

	const contextValue: ThemeContextType = {
		theme,
		toggleTheme,
		setTheme,
	};

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return <div className='light'>{children}</div>;
	}

	return (
		<ThemeContext.Provider value={contextValue}>
			<div className={theme}>{children}</div>
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
