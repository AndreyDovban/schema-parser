import type { HTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { Link } from 'react-router';

interface LayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<>
			<header>
				<nav>
					<Link to="/attributes">Атрибуты</Link>
					<Link to="/objectclasses">Объект классы</Link>
					<Link to="/builder">Сборка объекта</Link>
				</nav>
			</header>
			<main>{children}</main>
		</>
	);
};

export default Layout;
