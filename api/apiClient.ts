import {ApiError} from "@/api/apiError";

type EndPoint = `/${string}`

interface RequestOptions {
	params?: Record<string, string | number | boolean>
}

interface PostOptions extends RequestOptions {
	body: unknown
}

async function checkStatus(response: Response) {
	if (response.ok) return;

	let errorDetail: string | undefined;
	try {
		const data = await response.json();
		errorDetail = data.detail;
	} catch {}

	throw new ApiError(errorDetail || response.statusText);
}

function buildQueryString(params?: Record<string, string | number | boolean>) {
	if (!params || Object.keys(params).length === 0) return ''
	return `?${new URLSearchParams(params as Record<string, string>).toString()}`
}

export const get = async (endpoint: EndPoint, options?: RequestOptions) => {
	const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}${buildQueryString(options?.params)}`

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	await checkStatus(response)
	return response.json()
}

export const post = async (endpoint: EndPoint, options: PostOptions) => {
	const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(options.body),
	})

	await checkStatus(response)
	const contentType = response.headers.get('content-type')

	if (response.status === 204 || !contentType?.includes('application/json')) {
		return true
	}
	return response.json()
}