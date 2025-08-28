export interface IAttribute {
	DESC: string;
	NAME: string[];
	SINGLE_VALUE: boolean;
	USAGE: string;
}

export interface IClient {
	attributes: IAttribute[];
}
