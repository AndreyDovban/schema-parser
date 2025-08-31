import type { HTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

interface LayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<>
			<header>
				<nav></nav>
			</header>
			<main>{children}</main>
		</>
	);
};

export default Layout;
