import cn from 'classnames';
import styles from './AttributesSection.module.css';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Section } from '@/ui';
import {
	namesAttributesStore,
	requiredAttrsStore,
	targetAttributeStore,
	targetPseudoObjectClassStore,
	useSchemaStore,
} from '@/store';
import type { IAttribute } from '@/interfaces';

interface AttributesSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function AttributesSection({ className, ...props }: AttributesSectionProps) {
	const { schema } = useSchemaStore();
	const { namesAttributes } = namesAttributesStore();
	const { setTargetAttribute } = targetAttributeStore();
	const { requiredAttrs } = requiredAttrsStore();
	const { targetPseudoObjectClass } = targetPseudoObjectClassStore();

	function handleChooseAttribute(attribute: IAttribute) {
		setTargetAttribute(attribute);
	}

	return (
		<Section className={cn(className, styles.attributes_section)} {...props}>
			{schema.attributes.map((el, i) => {
				for (const n of el.NAME) {
					if (namesAttributes.includes(n)) {
						return (
							<button
								onClick={() => handleChooseAttribute(el)}
								key={i}
								className={cn(styles.attribute, {
									[styles.is_require]: requiredAttrs.includes(n),
									[styles.attrs_for_target_object_class]:
										targetPseudoObjectClass.name &&
										!targetPseudoObjectClass.attrs.includes(el.NAME[0]),
								})}
							>
								{el.NAME.join(' ')}
							</button>
						);
					}
				}
			})}
		</Section>
	);
}
