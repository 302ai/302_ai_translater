import { Role, Prompt, Language } from "./type";
import { TLoginData, TAuthData, TGlobalData } from "./type"
import Locale from "../../locales";

// local-key: Auth
export const LOCAL_AUTH_KEY = "gpt-translator-auth-v2"
// local-key: Prompt
export const LOCAL_PROMPTS_KEY = "gpt-translator-prompts-v2";
// local-ley: History
export const LOCAL_HISTORYS_KEY = "gpt-translator-historys-v2";
// local-key: config
export const LOCAL_CONFIG_KEY = 'gpt-translator-config-v2';

// language: list
export const DEFAULT_LANGUAGES: Language[] = Locale.LanguageOption;

// role: list
export const DEFAULT_ROLES: Role[] = Locale.RoleOption;

// prompt: list
export const DEFAULT_PROMPTS: Prompt[] = Locale.PromptOption;

// login: data
export const DEFAULT_LOGIN_DATA: TLoginData = {
	remember: true,
	uuid: '',
	domain: '',
	code: '',
}

// auth: data
export const DEFAULT_AUTH_DATA: TAuthData = {
	remember: true,
	uuid: '',
	domain: '',
	code: '',
	key: '',
	user: '',
	model: '',
	tokenLimit: 0,
	totalLimit: 0,
	todayLimit: 0,
	totalCost: 0,
	todayCost: 0,
	info: '',
}

// global-domestic: data
export const GLOBAL_DOMESTIC_DATA: TGlobalData = {
	name: 'Domestic',
	title: '',
	desc: '',
	theme: "light",
	region: 0,
	domain: 'https://302ai.cn',
	login: '',
	register: '',
	showBrand: 'false',
}

// global-international: data
export const GLOBAL_INTERNATIONAL_DATA: TGlobalData = {
	name: 'International',
	title: '',
	desc: '',
	theme: "light",
	region: 1,
	domain: 'https://302.ai',
	login: '',
	register: '',
	showBrand: 'false',
}

