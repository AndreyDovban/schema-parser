// import { useEffect } from 'react';
import { AttributeTableSection } from './modules';
import Layout from '@/layout';

export function Attributes() {
	// useEffect(() => {
	// 	sessionStorage.setItem('isReloading', 'true');

	// 	const handleBeforeUnload = () => {
	// 		const isReloading = sessionStorage.getItem('isReloading');
	// 		if (!isReloading) {
	// 			fetch('/api/close');
	// 		}
	// 	};

	// 	const handleUnload = () => {
	// 		fetch('/api/close');
	// 	};

	// 	window.addEventListener('beforeunload', handleBeforeUnload);
	// 	window.addEventListener('unload', handleUnload);

	// 	return () => {
	// 		window.removeEventListener('beforeunload', handleBeforeUnload);
	// 		window.removeEventListener('unload', handleUnload);
	// 	};
	// });
	return (
		<Layout>
			<AttributeTableSection />
		</Layout>
	);
}
