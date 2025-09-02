import styles from './BuilderSection.module.css';
import { CheckBox, Section } from '@/ui';
import { useSchemaStore } from '@/store/useSchemaStore';
import { choosedObjectClassesStore } from '@/store';
import type { IObjectClass, IAttribute } from '@/interfaces';
import { useState } from 'react';

export function BuilderSection() {
	const { schema } = useSchemaStore();
	const { choosedObjectClasses, setChoosedObjectClasses } = choosedObjectClassesStore();
	// const { choosedAttributes, setChoosedAttributes } = choosedAttributesStore();
	const [names, setNames] = useState<string[]>([]);
	const [targetAttribute, setTargeAttribute] = useState<IAttribute>();

	if (!schema.attributes.length || !schema.attributes.length) {
		return <Section className={styles.error_message}>Данные схемы не получены</Section>;
	}

	function handleChooseObj(objcl: IObjectClass) {
		let objectClassesArr: IObjectClass[] = [];
		let namesArr: string[] = [];
		// const attributesArr: IAttribute[] = [];
		if (choosedObjectClasses.includes(objcl)) {
			objectClassesArr = [...choosedObjectClasses].filter((el: IObjectClass) => el != objcl);
		} else {
			objectClassesArr = [...choosedObjectClasses, objcl];
		}

		for (const el of objectClassesArr) {
			if (el.MUST) {
				for (const m of el.MUST) {
					namesArr.push(m);
				}
			}

			if (el.MAY) {
				for (const m of el.MAY) {
					namesArr.push(m);
				}
			}
		}

		namesArr = [...new Set(namesArr)];
		setNames(namesArr);

		setChoosedObjectClasses(objectClassesArr);
	}

	function handleClearChoose() {
		setChoosedObjectClasses([]);
		setNames([]);
		setTargeAttribute(undefined);
	}

	function handleChooseAttribute(attribute: IAttribute) {
		setTargeAttribute(attribute);
	}

	return (
		<Section className={styles.table_section}>
			<div className={styles.object_classes}>
				<button className={styles.clear} onClick={handleClearChoose}>
					очистить
				</button>
				{schema.objectclasses.map((el, i) => {
					return (
						<label key={i} className={styles.object_class}>
							<CheckBox
								checked={choosedObjectClasses.includes(el)}
								onChange={() => handleChooseObj(el)}
							/>
							<span>{el.NAME}</span>
						</label>
					);
				})}
			</div>

			<div className={styles.tree_object_classes}>
				{choosedObjectClasses.map((el, i) => {
					return (
						<div key={i} className={styles.tree_object_class}>
							{el.NAME}
						</div>
					);
				})}
			</div>

			<div className={styles.attributes}>
				{schema.attributes.map((el, i) => {
					for (const n of el.NAME) {
						if (names.includes(n)) {
							return (
								<button onClick={() => handleChooseAttribute(el)} key={i} className={styles.attribute}>
									{el.NAME}
								</button>
							);
						}
					}
				})}
			</div>

			<div className={styles.out_attribute}>
				{targetAttribute && <pre>{JSON.stringify(targetAttribute, null, 4)}</pre>}
			</div>
		</Section>
	);
}
