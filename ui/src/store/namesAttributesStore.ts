import { create } from 'zustand';

interface INamestAttributes {
	namesAttributes: string[];
	setNamesAttributes: (th: string[]) => void;
}

const initial: string[] = [];

// Атом состояния - масси имён атрибутов выбранных объект классов
export const namesAttributesStore = create<INamestAttributes>(set => {
	return {
		namesAttributes: initial,
		setNamesAttributes: (th: string[]) =>
			set(() => {
				return { namesAttributes: th };
			}),
	};
});
