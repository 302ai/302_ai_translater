
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { GetLocalAuthDataService } from "./auth/query"
export default function Home() {
	const router = useRouter()
	// 初始化数据
	useEffect(() => {
		router.replace('/translate' + window.location.search)
		// 定义异步函数
		// const fetchData = async () => {
		// 	const localData = await GetLocalAuthDataService();
		// 	if (!localData.key) {
		// 		router.replace('/auth' + window.location.search)
		// 	}
		// };
		// 获取数据
		// fetchData();
	}, [router]);

	return <>Welcome!</>
}
