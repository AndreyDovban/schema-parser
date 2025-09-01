import type { HTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { Header, Nav } from './components';

interface LayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<>
			<Header />
			<Nav />
			<main>{children}</main>
		</>
	);
};

export default Layout;
