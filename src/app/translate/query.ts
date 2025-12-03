import LocalStorageManager from "../../../utils/LocalStorage";
import { Role, Language, Prompt, History, TLoginData, TAuthData } from "./type";
import {
	LOCAL_PROMPTS_KEY,
	LOCAL_HISTORYS_KEY,
	LOCAL_CONFIG_KEY,
	DEFAULT_LANGUAGES,
	DEFAULT_ROLES,
	LOCAL_AUTH_KEY,
	DEFAULT_AUTH_DATA
} from "./constant";
import 'whatwg-fetch'
import Locale from "../../locales";



// Get: languages
export const GetLanguagesService = async () => {
	return DEFAULT_LANGUAGES;
};

// Get: roles:
export const GetRolesService = async () => {
	return DEFAULT_ROLES;
};

// Prompt:////////////////////////////////////////////
// Get: prompts
export const GetPromptsService = async (params = {}) => {
	// 将参数拼接为 searchParams
	const searchParams = new URLSearchParams();
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			searchParams.set(key, value as string);
		});
	}
	const res = await fetch(`/api/prompt?${searchParams}`, {
		// const res = await fetch(`/api/prompt?user=123d`, {
		method: "GET",
	})
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	const { data } = await res.json()
	return data
};

// POST: pormpt(add or update)
export const PostPromptService = async (item: {}) => {
	const res = await fetch('/api/prompt', {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(item),
	})
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	const { data } = await res.json()
	return data
};

// Delete: delet pormpt
export const DeletePromptService = async (item: {}) => {
	const res = await fetch('/api/prompt', {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(item),
	})
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	const { data } = await res.json()
	return data
};

// Post////////////////////////////////
export const GetPostsService = async (params = {}) => {
	// 将参数拼接为 searchParams
	const searchParams = new URLSearchParams();
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value) {
				searchParams.set(key, value as string);
			}
		});
	}
	const res = await fetch(`/api/post?${searchParams}`, {
		method: "GET",
	})
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	const { data } = await res.json()
	return data
};

// POST: add post
export const AddPostService = async (item: {}) => {
	const res = await fetch('/api/post', {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(item),
	})
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	const { data } = await res.json()
	return data
};

// Post: like post
export const LikePostService = async (item: {}) => {
	const res = await fetch('/api/post', {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(item),
	})
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	const { data } = await res.json()
	return data
};


// History//////////////////////////////////////
// Get: historys
export const GetHistorysService = async () => {
	const list = LocalStorageManager.getItem(LOCAL_HISTORYS_KEY) || [];
	return list;
};

// Update: historys
export const UpdateHistorysService = async (value: History[]) => {
	LocalStorageManager.setItem(LOCAL_HISTORYS_KEY, value);
};

// Config //////////////////////////////////////
// Get: config
export const GetConfigService = () => {
	const list = LocalStorageManager.getItem(LOCAL_CONFIG_KEY) || {};
	return list;
};

// Update: config
export const UpdateConfigService = (value: any) => {
	LocalStorageManager.setItem(LOCAL_CONFIG_KEY, value);
};

// Get: command
export const GetCommandService = async (props: {
	role: Role;
	prompt: Prompt;
	origin: Language;
	target: Language;
}) => {
	let command = "";
	if (props.role.symbol == "translate") {
		command = `${props.role.content},${props.prompt.content}.`
			.replace(/@origin/gi, props.origin.name)
			.replace(/@target/gi, props.target.name);
	} else {
		command = props.role.content
			.replace(/@origin/gi, props.origin.name)
			.replace(/@target/gi, props.target.name);
	}
	// debug: reset
	if (props.prompt.content.includes("@reset@")) {
		command = props.prompt.content
			.replace(/@reset@/gi, "")
			.replace(/@origin/gi, props.origin.name)
			.replace(/@target/gi, props.target.name);
	}
	return command;
};

// Post: detect language
export const DetectLanguageService = async (text: string) => {
	const response = await fetch("/api/detect", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			q: text,
		}),
	});

	if (!response.ok) {
		throw new Error(response.statusText);
	}

	// const data = response.body;
	// if (!data) {
	// 	return;
	// }
	const result = await response.json();
	return result;
};


// Auth: /////////////////////////////////////////
// Get: local auth data
export const GetLocalAuthDataService = async () => {
	const data = LocalStorageManager.getItem(LOCAL_AUTH_KEY) || DEFAULT_AUTH_DATA
	return data
}
// Update: local auth data
export const UpdateLocalAuthDataService = async (value: TAuthData) => {
	const newData = value
	// 不记住验证码的话要清清除
	if (!newData.remember) {
		newData.code = ''
	}
	LocalStorageManager.setItem(LOCAL_AUTH_KEY, value);
};



// GET: login
export const LoginService = async (values: TLoginData) => {
	let lang = Locale.Symbol
	if (lang === 'zh') lang = 'cn'
	if (lang === 'ja') lang = 'jp'

	const authUrl = values.code ?
		`${process.env.NEXT_PUBLIC_302AI_AUTH}${values.domain}?pwd=${values.code}` :
		`${process.env.NEXT_PUBLIC_302AI_AUTH}${values.domain}`
	const response = await fetch(authUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Lang': lang,
		},
	})

	if (!response.ok) {
		throw new Error(Locale.Auth.NetworkError)
		// throw new Error(response.statusText)
	}

	// const data = response.body
	// if (!data) {
	// 	throw new Error('数据错误!')
	// }

	const res = await response.json()
	if (res.code === -1) {
		throw new Error(Locale.Auth.CodeError)
	}
	if (res.code === -99) {
		throw new Error(Locale.Auth.CodeError)
	}
	if (res.code === -100) {
		throw new Error(Locale.Auth.AccountBin)
	}
	if (res.code === -101) {
		throw new Error(Locale.Auth.AccountDel)
	}
	if (res.code === 0) {
		return {
			...values,
			key: res.data.api_key,
			user: res.data.created_by,
			model: res.data.model_name || 'gpt-3.5-turbo-16k',
			tokenLimit: Number(res.data.extra_data.translate_num) || 8000,
			totalLimit: res.data.limit_cost,
			todayLimit: res.data.limit_daily_cost,
			totalCost: res.data.cost,
			todayCost: res.data.current_date_cost,
			region: res.data.region,
			info: res.data.info,
			showBrand: res.data.settings.hideBrand ? "false" : "true"
		}
	}
	throw new Error(Locale.Auth.NetworkError)

}
