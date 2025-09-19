export interface IAuthData {
	address: string;
	port: string;
	login: string;
	password: string;
}

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

export interface IHashIndexObject {
	attrs: string[];
	supers: string[];
}

export interface ITargetPseudoObjectClass {
	name: string;
	attrs: string[];
}

export interface IAciForEntity {
	location: string;
	acl: string;
	version: string;
	allow: string[];
	target: string;
	targetattr: string[];
	raw: string;
}
