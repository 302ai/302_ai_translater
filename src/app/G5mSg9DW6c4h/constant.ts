import { ILoginData, IPrompt } from "./type";

export const T_ADMIN_TOKEN = 'T_ADMIN_TOKEN_V2'

export const DEFAULT_LOGIN_DATA: ILoginData = {
	remember: true,
	username: '',
	password: '',
}

export const DEFAULT_POST: IPrompt = {
	id: 0,
	like: 0,
	status: 1,
	agent: 'user',
	author: 'root',
	name: '',
	content: '',
	origin: '',
	target: '',
}

