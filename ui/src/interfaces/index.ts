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
	groupdn: string;
	userdn: string[];
}

export interface IPermission {
	cn: string[];
	ipa_perm_bind_rule_type: string[];
	ipa_perm_included_attr: string[];
	ipa_perm_location: string[];
	ipa_perm_right: string[];
	ipa_perm_target: string[];
	ipa_permission_type: string[];
}

export interface IEffectiveRight {
	dn: string;
	entry_level_rights: string;
	attribute_level_rights: { name: string; value: string }[];
	hashIndex: string[];
	open: false;
}

export interface ITargetEntryForER {
	dn: string;
	attribute_level_rights: { name: string; value: string }[];
}

export type IEff = {
	[key: string]: string | string[] | boolean | IEff | { name: string; value: string }[] | undefined;

	dn: string;
	entry_level_rights: string;
	attribute_level_rights: { name: string; value: string }[];
	open: boolean;
	hashIndex: string[];
};
