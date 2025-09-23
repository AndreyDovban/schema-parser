import cn from 'classnames';
import styles from './TreeObjectsSection.module.css';
import { type DetailedHTMLProps, type HTMLAttributes, type MouseEvent } from 'react';
import { Section } from '@/ui';
import { treeDataForCheckRightsStore, targetEntryForCheckRightsStore } from '@/store';
import type { IEff } from '@/interfaces';
import { ColeredPermission } from '@/components';
import Folder from '@/assets/svg/folder.svg?react';
import OpenFolder from '@/assets/svg/open_folder.svg?react';

interface TreeObjectsSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function TreeObjectsSection({ className, ...props }: TreeObjectsSectionProps) {
	const { treeDataForCheckRights, setTreeDataForCheckRights } = treeDataForCheckRightsStore();
	const { targetEntryForCheckRights, setTargetEntryForCheckRights } = targetEntryForCheckRightsStore();

	function openFolder(e: MouseEvent, hashIndex: string[]) {
		e.stopPropagation();

		const obj = JSON.parse(JSON.stringify(treeDataForCheckRights));

		const a = hashIndex.reduce((acc, el) => {
			return (acc = acc[el]);
		}, obj);

		a.open = !a.open;

		setTreeDataForCheckRights(obj);
	}

	function chooseEntry(e: MouseEvent, value: IEff) {
		e.stopPropagation();
		setTargetEntryForCheckRights({ dn: value.dn, attribute_level_rights: value.attribute_level_rights });
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
											[styles.target]: targetEntryForCheckRights.dn == value.dn && value.dn,
										})}
									>
										<button
											className={cn(styles.button_icon)}
											onClick={e => openFolder(e, value.hashIndex)}
										>
											{value.open === true ? (
												<Folder className={styles.icontree} />
											) : (
												<OpenFolder className={styles.icontree} />
											)}
										</button>
										<span onClick={e => chooseEntry(e, value)}>{key}</span>
										{<ColeredPermission className={styles.elr} rights={value.entry_level_rights} />}
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
