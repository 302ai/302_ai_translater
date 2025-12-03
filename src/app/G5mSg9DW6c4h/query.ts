import { IPrompt, ILoginData } from "./type";
import 'whatwg-fetch'

// Post////////////////////////////////
export const GetPostsService = async (params = {}) => {
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

// POST: update post
export const UpdatePostService = async (item: {}) => {
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

// Delete: delet pormpt
export const DeletePostService = async (item: {}) => {
	const res = await fetch('/api/post', {
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

// GET: login
export const LoginService = async (values: ILoginData) => {
	const response = await fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(values),
	})

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error('账户信息错误！')
		}
		throw new Error('网络错误！')
	}

	const res = await response.json()
	return res

}
