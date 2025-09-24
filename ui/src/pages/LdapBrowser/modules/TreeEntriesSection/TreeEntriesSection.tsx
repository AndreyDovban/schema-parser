import cn from 'classnames';
import styles from './TreeEntriesSection.module.css';
import { type DetailedHTMLProps, type HTMLAttributes, type MouseEvent } from 'react';
import { Section } from '@/ui';
import { treeCatalogStore, targetContainerStore, targetEntryStore } from '@/store';
import type { IEIC } from '@/interfaces';
import Folder from '@/assets/svg/folder.svg?react';
import OpenFolder from '@/assets/svg/open_folder.svg?react';
import Eye from '@/assets/svg/eye.svg?react';

interface TreeEntriesSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function TreeEntriesSection({ className, ...props }: TreeEntriesSectionProps) {
	const { treeCatalog, setTreeCatalog } = treeCatalogStore();
	const { targetContainer, setTargetContainer } = targetContainerStore();
	const { targetEntry, setTargetEntry } = targetEntryStore();
	// const { treeDataForCheckRights, setTreeDataForCheckRights } = treeDataForCheckRightsStore();
	// const { targetEntryForCheckRights, setTargetEntryForCheckRights } = targetEntryForCheckRightsStore();

	function openFolder(e: MouseEvent, hashIndex: string[]) {
		e.stopPropagation();

		const obj = JSON.parse(JSON.stringify(treeCatalog));

		const a = hashIndex.reduce((acc, el) => {
			return (acc = acc[el]);
		}, obj);

		a.open = !a.open;

		setTreeCatalog(obj);
	}

	function chooseEntry(e: MouseEvent, value: IEIC) {
		e.stopPropagation();
		if (targetContainer == value.dn) {
			setTargetContainer('');
		} else {
			setTargetContainer(value.dn);
		}
		if (targetEntry == value.dn) {
			setTargetEntry('');
		} else {
			setTargetEntry(value.dn);
		}
	}

	function drawTree(node: IEIC) {
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
											[styles.hide]: value.open == false,
											[styles.target]: targetContainer == value.dn && value.dn,
										})}
										onClick={e => {
											openFolder(e, value.hashIndex);
											chooseEntry(e, value);
										}}
									>
										{Object.keys(value).length > 4 ? (
											<button className={cn(styles.button_icon, {})}>
												{value.open === true ? (
													<OpenFolder className={styles.icontree} />
												) : (
													<Folder className={styles.icontree} />
												)}
											</button>
										) : null}
										<span>{key}</span>
										{targetContainer == value.dn && value.dn ? (
											<Eye className={styles.icon} />
										) : null}
										{/* {Object.keys(value).length < 5 && value.open === true ? '!!!!!!' : null} */}
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
	const tree = drawTree(treeCatalog);

	return (
		<Section className={cn(className, styles.tree_section)} {...props}>
			<div className={styles.tree}>{tree}</div>

			{/* <pre>{JSON.stringify(treeCatalog, null, 4)}</pre> */}
		</Section>
	);
}
