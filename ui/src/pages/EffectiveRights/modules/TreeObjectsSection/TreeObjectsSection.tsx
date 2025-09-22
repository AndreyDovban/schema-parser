import cn from 'classnames';
import styles from './TreeObjectsSection.module.css';
import { useEffect, useState, type DetailedHTMLProps, type HTMLAttributes, type MouseEvent } from 'react';
import { Section } from '@/ui';
import { outDataForCheckRightStore } from '@/store';
import { buildTree, type IEff } from '@/helpers';

interface TreeObjectsSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function TreeObjectsSection({ className, ...props }: TreeObjectsSectionProps) {
	const { outDataForCheckRights } = outDataForCheckRightStore();
	const [t, setT] = useState(buildTree(outDataForCheckRights));

	useEffect(() => {
		setT(buildTree(outDataForCheckRights));
	}, [outDataForCheckRights]);

	console.log(buildTree(outDataForCheckRights));

	function openFolder(e: MouseEvent, hashIndex: string[]) {
		e.stopPropagation();

		const obj = JSON.parse(JSON.stringify(t));
		console.log(obj);

		const a = hashIndex.reduce((acc, el) => {
			return (acc = acc[el]);
		}, obj);

		a.open = !a.open;

		setT(obj);
	}

	function drawTree(node: Record<string, IEff>) {
		return (
			<div className={styles.content}>
				{Object.entries(node).map(([key, value]) => {
					if (typeof value == 'object') {
						if (key == 'hashIndex' || key == 'open') {
							return;
						}
						return (
							<div key={key} className={styles.dir} title={value.dn}>
								<span
									className={cn(styles.lab, {
										[styles.hide]: value.open !== false,
									})}
								>
									<span onClick={e => openFolder(e, value.hashIndex)}>
										{key} {value.entry_level_rights}
									</span>
								</span>
								{drawTree(value)}
							</div>
						);
					}
				})}
			</div>
		);
	}
	const tree = drawTree(t);

	return (
		<Section className={cn(className, styles.tree_section)} {...props}>
			{tree}
			{/* <pre>{JSON.stringify(buildTree(outDataForCheckRights), null, 18)}</pre> */}
		</Section>
	);
}
