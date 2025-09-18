import { create } from 'zustand';

interface ITargetEntityForAciStore {
	targetEntityForAci: string;
	setTargetEntityForAci: (th: string) => void;
}

const initial = 'dc=granulex,dc=test';

// Атом состояния - dc объекта для поиска и использования в конструкторе aci
export const targetEntityForAciStore = create<ITargetEntityForAciStore>(set => {
	return {
		targetEntityForAci: initial,
		setTargetEntityForAci: (th: string) =>
			set(() => {
				return { targetEntityForAci: th };
			}),
	};
});
