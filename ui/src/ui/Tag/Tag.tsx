import styles from './Tag.module.css';
import cn from 'classnames';
import type { HTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

interface HtagProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	tag: 'sertificates' | 'docs' | 'save' | 'news' | 'learn' | 'faq' | 'application';
	children: ReactNode;
	className?: string;
}

export function Tag({ tag, children, className, ...props }: HtagProps) {
	switch (tag) {
		case 'sertificates':
			return (
				<div className={cn(className, styles.tag, styles.sertificates)} {...props}>
					{children}
				</div>
			);
		case 'docs':
			return (
				<div className={cn(className, styles.tag, styles.docs)} {...props}>
					{children}
				</div>
			);
		case 'save':
			return (
				<div className={cn(className, styles.tag, styles.save)} {...props}>
					{children}
				</div>
			);
		case 'news':
			return (
				<div className={cn(className, styles.tag, styles.news)} {...props}>
					{children}
				</div>
			);
		case 'learn':
			return (
				<div className={cn(className, styles.tag, styles.learn)} {...props}>
					{children}
				</div>
			);
		case 'faq':
			return (
				<div className={cn(className, styles.tag, styles.faq)} {...props}>
					{children}
				</div>
			);
		case 'application':
			return (
				<div className={cn(className, styles.tag, styles.application)} {...props}>
					{children}
				</div>
			);

		default:
			return <></>;
	}
}
