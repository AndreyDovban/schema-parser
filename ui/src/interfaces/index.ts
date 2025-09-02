export interface IAttribute {
	DESC: string;
	NAME: string[];
	SUP: string;
	SINGLE_VALUE: boolean;
	USAGE: string;
	USER_MODIFICATION: boolean;
}

export interface IObjectClass {
	NAME: string;
	SUP: string;
	DESC: string;
	STRUCTURAL: boolean;
	MUST: string[];
	MAY: string[];
}

export interface ISchema {
	attributes: IAttribute[];
	objectclasses: IObjectClass[];
}
