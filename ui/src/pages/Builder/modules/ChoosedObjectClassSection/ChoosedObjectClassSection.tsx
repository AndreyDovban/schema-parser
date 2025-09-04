import cn from 'classnames';
import styles from './ChoosedObjectClassSection.module.css';
import { Section } from '@/ui';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { choosedObjectClassesStore, targetPseudoObjectClassStore } from '@/store';
import type { IObjectClass } from '@/interfaces';

interface ChoosedObjectClassProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function ChoosedObjectClassSection({ className, ...props }: ChoosedObjectClassProps) {
	const { choosedObjectClasses } = choosedObjectClassesStore();
	const { targetPseudoObjectClass, setTargetPseudoObjectClass } = targetPseudoObjectClassStore();

	function handleShowAttrsOfObjectClass(objcl: IObjectClass) {
		let arr: string[] = [];
		if (objcl.MUST) {
			arr = arr.concat(objcl.MUST);
		}
		if (objcl.MAY) {
			arr = arr.concat(objcl.MAY);
		}
		if (targetPseudoObjectClass.name == objcl.NAME) {
			setTargetPseudoObjectClass({ name: '', attrs: [] });
		} else {
			setTargetPseudoObjectClass({ name: objcl.NAME, attrs: arr });
		}
	}

	return (
		<Section className={cn(className, styles.choosed_object_class_section)} {...props}>
			{choosedObjectClasses.map((el, i) => {
				return (
					<button
						onClick={() => handleShowAttrsOfObjectClass(el)}
						key={i}
						className={cn(styles.tree_object_class, {
							[styles.is_target_object_class]: targetPseudoObjectClass.name == el.NAME,
						})}
					>
						{el.NAME}
					</button>
				);
			})}
		</Section>
	);
}
