export interface ILoginData {
	remember: boolean,
	username: string,
	password: string,
}
export interface ILanguage {
	id: number;
	name: string;
	symbol: string;
}

export interface IPrompt {
	id: number;
	like: number
	status: 0 | 1 | 2
	agent: 'system' | 'user'
	author: string
	name: string;
	content: string;
	origin: string;
	target: string;
}

