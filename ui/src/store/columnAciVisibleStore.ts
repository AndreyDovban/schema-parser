// columnAciVisibleStore

import { create } from 'zustand';

interface IColumnAciVisibleStore {
	columnAciVisible: 'parse' | 'raw';
	setColumnAciVisible: (th: 'parse' | 'raw') => void;
}

const initial = 'parse';

// Атом состояния - объект видимости колонок в таблице конструктора Aci
export const columnAciVisibleStore = create<IColumnAciVisibleStore>(set => {
	return {
		columnAciVisible: initial,
		setColumnAciVisible: (th: 'parse' | 'raw') =>
			set(() => {
				return { columnAciVisible: th };
			}),
	};
});
