import cn from 'classnames';
import styles from './AttributeRightsSection.module.css';
import { Fragment, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { Section } from '@/ui';
import { targetEntryForCheckRightsStore } from '@/store';
import { ColeredPermission } from '@/components';

interface AttributeRightsSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function AttributeRightsSection({ className, ...props }: AttributeRightsSectionProps) {
	const { targetEntryForCheckRights } = targetEntryForCheckRightsStore();

	return (
		<Section className={cn(className, styles.target_attribute_rights_section)} {...props}>
			<div title={targetEntryForCheckRights.dn} className={styles.dn_block}>
				{targetEntryForCheckRights.dn}
			</div>
			<hr />
			{targetEntryForCheckRights && (
				<div className={styles.wrap}>
					{targetEntryForCheckRights.attribute_level_rights.map(el => {
						return (
							<Fragment key={el.name}>
								<span>{el.name}</span>
								<ColeredPermission rights={el.value} />
							</Fragment>
						);
					})}
				</div>
			)}
		</Section>
	);
}
