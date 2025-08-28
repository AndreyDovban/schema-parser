import styles from './Input.module.css';

import cn from 'classnames';

import { DetailedHTMLProps, ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	className?: string;
}

export const Input = forwardRef(function Input(
	{ className, ...props }: InputProps,
	ref: ForwardedRef<HTMLInputElement>,
) {
	return <input className={cn(className, styles.input)} ref={ref} {...props} />;
});
