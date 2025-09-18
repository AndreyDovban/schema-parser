import cn from 'classnames';
import styles from './Nav.module.css';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Link, useLocation } from 'react-router';
import Attribute from '@/assets/svg/attribute.svg?react';
import ObjectClass from '@/assets/svg/object_class.svg?react';
import BuilerOject from '@/assets/svg/builder_object.svg?react';
import FingerPrint from '@/assets/svg/fingerprint.svg?react';

interface NavProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function Nav({ className, ...props }: NavProps) {
	const location = useLocation();

	return (
		<nav className={cn(className, styles.nav)} {...props}>
			<Link
				className={cn(styles.icon, {
					[styles.active]: location.pathname == '/attributes',
				})}
				to="/attributes"
				title="атрибуты"
			>
				<Attribute />
			</Link>
			<Link
				className={cn(styles.icon, {
					[styles.active]: location.pathname == '/objectclasses',
				})}
				to="/objectclasses"
				title="объект классы"
			>
				<ObjectClass />
			</Link>
			<Link
				className={cn(styles.icon, {
					[styles.active]: location.pathname == '/builder',
				})}
				to="/builder"
				title="сборка объекта"
			>
				<BuilerOject />
			</Link>
			<Link
				className={cn(styles.icon, {
					[styles.active]: location.pathname == '/aciconstructor',
				})}
				to="/aciconstructor"
				title="aci коструктор"
			>
				<FingerPrint />
			</Link>
		</nav>
	);
}
