import cn from 'classnames';
import styles from './TargetAttribute.module.css';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Section } from '@/ui';
import { targetAttributeStore } from '@/store';

interface TargetAttributeProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function TargetAttribute({ className, ...props }: TargetAttributeProps) {
	const { targetAttribute } = targetAttributeStore();

	return (
		<Section className={cn(className, styles.target_attribute_section)} {...props}>
			{targetAttribute && <pre>{JSON.stringify(targetAttribute, null, 4)}</pre>}
		</Section>
	);
}
