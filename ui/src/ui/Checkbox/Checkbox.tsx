import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Checkbox.module.css';

interface CheckBoxProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	className?: string;
}

export function CheckBox({ className, ...props }: CheckBoxProps) {
	return <input type="checkbox" className={cn(className, styles.checkbox)} {...props} />;
}
