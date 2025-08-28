import styles from './Textarea.module.css';

import cn from 'classnames';

import { type DetailedHTMLProps, type ForwardedRef, type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
	className?: string;
}

export const Textarea = forwardRef(function Textarea(
	{ className, ...props }: TextareaProps,
	ref: ForwardedRef<HTMLTextAreaElement>,
) {
	return <textarea className={cn(className, styles.textarea)} ref={ref} {...props} />;
});
