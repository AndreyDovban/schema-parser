import cn from 'classnames';
import styles from './Nav.module.css';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Link, useLocation } from 'react-router';
import Attribute from '@/assets/svg/attribute.svg?react';
import ObjectClass from '@/assets/svg/object_class.svg?react';
import BuilerOject from '@/assets/svg/builder_object.svg?react';
import FingerPrint from '@/assets/svg/fingerprint.svg?react';
import Eye from '@/assets/svg/eye.svg?react';
import Mask from '@/assets/svg/mask.svg?react';
import Tree from '@/assets/svg/tree.svg?react';

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
			<Link
				className={cn(styles.icon, {
					[styles.active]: location.pathname == '/permissions',
				})}
				to="/permissions"
				title="разрешения"
			>
				<Eye />
			</Link>
			<Link
				className={cn(styles.icon, {
					[styles.active]: location.pathname == '/geteffectiverights',
				})}
				to="/geteffectiverights"
				title="просмотр прав доступа"
			>
				<Mask />
			</Link>
			<Link
				className={cn(styles.icon, {
					[styles.active]: location.pathname == '/ldapbrowser',
				})}
				to="/ldapbrowser"
				title="просмотр прав доступа"
			>
				<Tree />
			</Link>
		</nav>
	);
}
