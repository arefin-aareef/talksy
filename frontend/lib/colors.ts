// Global color system for light and dark themes
export const colors = {
	light: {
		// Primary colors
		primary: {
			50: '#eff6ff',
			100: '#dbeafe',
			200: '#bfdbfe',
			300: '#93c5fd',
			400: '#60a5fa',
			500: '#3b82f6',
			600: '#2563eb',
			700: '#1d4ed8',
			800: '#1e40af',
			900: '#1e3a8a',
		},
		// Secondary colors
		secondary: {
			50: '#f8fafc',
			100: '#f1f5f9',
			200: '#e2e8f0',
			300: '#cbd5e1',
			400: '#94a3b8',
			500: '#64748b',
			600: '#475569',
			700: '#334155',
			800: '#1e293b',
			900: '#0f172a',
		},
		// Success colors
		success: {
			50: '#f0fdf4',
			100: '#dcfce7',
			200: '#bbf7d0',
			300: '#86efac',
			400: '#4ade80',
			500: '#22c55e',
			600: '#16a34a',
			700: '#15803d',
			800: '#166534',
			900: '#14532d',
		},
		// Error colors
		error: {
			50: '#fef2f2',
			100: '#fee2e2',
			200: '#fecaca',
			300: '#fca5a5',
			400: '#f87171',
			500: '#ef4444',
			600: '#dc2626',
			700: '#b91c1c',
			800: '#991b1b',
			900: '#7f1d1d',
		},
		// Warning colors
		warning: {
			50: '#fffbeb',
			100: '#fef3c7',
			200: '#fde68a',
			300: '#fcd34d',
			400: '#fbbf24',
			500: '#f59e0b',
			600: '#d97706',
			700: '#b45309',
			800: '#92400e',
			900: '#78350f',
		},
		// Background colors
		background: {
			primary: '#ffffff',
			secondary: '#f8fafc',
			tertiary: '#f1f5f9',
		},
		// Text colors
		text: {
			primary: '#0f172a',
			secondary: '#475569',
			tertiary: '#64748b',
			inverse: '#ffffff',
		},
		// Border colors
		border: {
			primary: '#e2e8f0',
			secondary: '#cbd5e1',
			focus: '#3b82f6',
		},
	},
	dark: {
		// Primary colors
		primary: {
			50: '#1e3a8a',
			100: '#1e40af',
			200: '#1d4ed8',
			300: '#2563eb',
			400: '#3b82f6',
			500: '#60a5fa',
			600: '#93c5fd',
			700: '#bfdbfe',
			800: '#dbeafe',
			900: '#eff6ff',
		},
		// Secondary colors
		secondary: {
			50: '#0f172a',
			100: '#1e293b',
			200: '#334155',
			300: '#475569',
			400: '#64748b',
			500: '#94a3b8',
			600: '#cbd5e1',
			700: '#e2e8f0',
			800: '#f1f5f9',
			900: '#f8fafc',
		},
		// Success colors
		success: {
			50: '#14532d',
			100: '#166534',
			200: '#15803d',
			300: '#16a34a',
			400: '#22c55e',
			500: '#4ade80',
			600: '#86efac',
			700: '#bbf7d0',
			800: '#dcfce7',
			900: '#f0fdf4',
		},
		// Error colors
		error: {
			50: '#7f1d1d',
			100: '#991b1b',
			200: '#b91c1c',
			300: '#dc2626',
			400: '#ef4444',
			500: '#f87171',
			600: '#fca5a5',
			700: '#fecaca',
			800: '#fee2e2',
			900: '#fef2f2',
		},
		// Warning colors
		warning: {
			50: '#78350f',
			100: '#92400e',
			200: '#b45309',
			300: '#d97706',
			400: '#f59e0b',
			500: '#fbbf24',
			600: '#fcd34d',
			700: '#fde68a',
			800: '#fef3c7',
			900: '#fffbeb',
		},
		// Background colors
		background: {
			primary: '#0f172a',
			secondary: '#1e293b',
			tertiary: '#334155',
		},
		// Text colors
		text: {
			primary: '#f8fafc',
			secondary: '#cbd5e1',
			tertiary: '#94a3b8',
			inverse: '#0f172a',
		},
		// Border colors
		border: {
			primary: '#334155',
			secondary: '#475569',
			focus: '#60a5fa',
		},
	},
} as const;

// Message bubble colors
export const messageColors = {
	light: {
		own: {
			background: '#3b82f6', // primary.500
			text: '#ffffff',
			timestamp: '#dbeafe', // primary.100
		},
		other: {
			background: '#f1f5f9', // secondary.100
			text: '#0f172a', // text.primary
			timestamp: '#64748b', // text.tertiary
		},
	},
	dark: {
		own: {
			background: '#3b82f6', // primary.500
			text: '#ffffff',
			timestamp: '#1e40af', // primary.100
		},
		other: {
			background: '#334155', // secondary.700
			text: '#f8fafc', // text.primary
			timestamp: '#94a3b8', // text.tertiary
		},
	},
} as const;
