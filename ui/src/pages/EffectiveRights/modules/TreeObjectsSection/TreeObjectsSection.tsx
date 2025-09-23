import cn from 'classnames';
import styles from './TreeObjectsSection.module.css';
import { type DetailedHTMLProps, type HTMLAttributes, type MouseEvent } from 'react';
import { Section } from '@/ui';
import { treeDataForCheckRightsStore } from '@/store';

import type { IEff } from '@/interfaces';
import { ColeredPermission } from '@/components';

interface TreeObjectsSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function TreeObjectsSection({ className, ...props }: TreeObjectsSectionProps) {
	const { treeDataForCheckRights, setTreeDataForCheckRights } = treeDataForCheckRightsStore();

	function openFolder(e: MouseEvent, hashIndex: string[]) {
		e.stopPropagation();

		const obj = JSON.parse(JSON.stringify(treeDataForCheckRights));

		const a = hashIndex.reduce((acc, el) => {
			return (acc = acc[el]);
		}, obj);

		a.open = !a.open;

		setTreeDataForCheckRights(obj);
	}

	function drawTree(node: IEff) {
		return (
			<div className={styles.content}>
				{Object.entries(node).map(([key, value]) => {
					if (typeof value == 'object' && !Array.isArray(value)) {
						if (key == 'hashIndex' || key == 'open') {
							return;
						}
						if (value) {
							return (
								<div key={key} className={styles.dir} title={value.dn}>
									<span
										className={cn(styles.lab, {
											[styles.hide]: value.open !== false,
											[styles.not_show]: !value.entry_level_rights,
										})}
										onClick={e => openFolder(e, value.hashIndex)}
									>
										<span>{key}</span>
										{<ColeredPermission rights={value.entry_level_rights} />}
									</span>
									{drawTree(value)}
								</div>
							);
						}
					}
				})}
			</div>
		);
	}
	const tree = drawTree(treeDataForCheckRights);

	return (
		<Section className={cn(className, styles.tree_section)} {...props}>
			<div className={styles.tree}>{tree}</div>

			{/* <pre>{JSON.stringify(buildTree(listDataForCheckRights), null, 18)}</pre> */}
		</Section>
	);
}
