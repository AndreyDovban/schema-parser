import { create } from 'zustand';
import type { ISchema } from '@/interfaces';

interface ISchemaStore {
	schema: ISchema;
	setSchema: (th: ISchema) => void;
}

const initial: ISchema = { attributes: [], objectclasses: [] };

export const useSchemaStore = create<ISchemaStore>(set => {
	return {
		schema: initial,
		setSchema: (th: ISchema) =>
			set(() => {
				return { schema: th };
			}),
	};
});
