import { useEffect } from 'react';
import { TableSection } from './modules';

export default function Home() {
	// return <TableSection />;

	useEffect(() => {
		sessionStorage.setItem('isReloading', 'true');

		const handleBeforeUnload = () => {
			const isReloading = sessionStorage.getItem('isReloading');
			if (!isReloading) {
				fetch('/api/close');
			}
		};

		const handleUnload = () => {
			fetch('/api/close');
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		window.addEventListener('unload', handleUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('unload', handleUnload);
		};
	});
	return <TableSection />;
}
