import { create } from 'zustand';
import type { ITargetEntryForER } from '@/interfaces';

interface ITargetEntryForCheckRights {
	targetEntryForCheckRights: ITargetEntryForER;
	setTargetEntryForCheckRights: (th: ITargetEntryForER) => void;
}

const initial: ITargetEntryForER = { dn: '', attribute_level_rights: [] };

// Атом состояния - выбранный объект для отображения эффективных прав
export const targetEntryForCheckRightsStore = create<ITargetEntryForCheckRights>(set => {
	return {
		targetEntryForCheckRights: initial,
		setTargetEntryForCheckRights: (th: ITargetEntryForER) =>
			set(() => {
				return { targetEntryForCheckRights: th };
			}),
	};
});
