type ChatGPTAgent = "user" | "system" | "assistant";

export type TransferAction =
	| "left-to-left"
	| "left-to-right"
	| "right-to-right";

export type RoleSymbol =
	| "all"
	| "translate"
	| "summary"
	| "polish"
	| "modify"
	| "check";

export interface ChatGPTMessage {
	role: ChatGPTAgent;
	content: string;
}

export interface Language {
	id: number;
	name: string;
	symbol: string;
}

export interface Role {
	id: number;
	name: string;
	symbol: string
	content: string;
}

export interface Prompt {
	id: number;
	like: number;
	status: number;
	agent: string;
	author: string;
	name: string;
	content: string;
	origin: string;
	target: string;
}

export interface History {
	id: number;
	action: TransferAction;
	origin: Language;
	target: Language;
	role: Role;
	prompt: Prompt;
	input: string;
	output: string;
}

// interface: login
export interface TLoginData {
	remember: boolean,
	uuid: string,
	domain: string,
	code: string,
}

// interface: auth
export interface TAuthData {
	remember: boolean,
	uuid: string,
	domain: string,
	code: string,
	key: string,
	user: string,
	model: string,
	tokenLimit: number,
	totalLimit: number,
	todayLimit: number,
	totalCost: number,
	todayCost: number,
	info: string,
}

// interface: global
export interface TGlobalData {
	name: string,
	title: string,
	desc: string,
	theme: string,
	region: number,
	domain: string,
	login: string,
	register: string,
	showBrand: string,
}