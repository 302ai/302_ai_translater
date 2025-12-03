"use client";
// Base
import { useState, useEffect } from "react";

// Ui: Component
import { message, ConfigProvider } from "antd";
// UI: Icon

// UI: Style
import "./page.css";

// Type
import {
	IPrompt,
	ILoginData
} from "./type";
// Constant
import {
	T_ADMIN_TOKEN,
	DEFAULT_LOGIN_DATA
} from "./constant";

// Server
import {
	LoginService,
	GetPostsService,
	UpdatePostService,
	DeletePostService,
} from "./query";

// Component
import Footer from '@/components/Footer';
import PageLoading from "../../components/PageLoading";
import AdminForm from "@/components/PostForm"
import AdminTable from '@/components/PostTable'
import { useRouter } from 'next/navigation'

// Function
export default function TranslaterPage() {
	// router
	const router = useRouter()
	// message
	const [messageApi, contextHolder] = message.useMessage();
	// State: Page
	const [isShowAuth, setIsShowAuth] = useState(true);
	// State: Auth
	const [loginData, setLoginData] = useState<ILoginData>(DEFAULT_LOGIN_DATA)
	// State: Login
	const [isShowFrom, setIsShowFrom] = useState(false)
	const [errMessage, setErrMessage] = useState('')

	// Handle login form submit
	const handleLogin = async (values: any) => {
		// return
		try {
			const data = await LoginService(values)
			messageApi.info("验证成功!")
			setIsShowAuth(false);
		} catch (error: any) {
			if (isShowFrom) {
				return messageApi.warning(error.message);
			}
			setErrMessage(error.message)
			setIsShowFrom(true)
		}
	};

	// Effect/////////////////////////////////////
	// 初始化数据
	useEffect(() => {
		// 获取本地Token
		const cookie = document.cookie
			.split('; ')
			.find(row => row.startsWith(T_ADMIN_TOKEN))
		const token = cookie?.split('=')[1]
		if (token) {
			setIsShowAuth(false)
		}
		setTimeout(() => { setIsShowFrom(true) }, 300)
	}, [messageApi]);

	// 初始化页面
	useEffect(() => {
		// 禁止页面缩放
		document
			.getElementsByName("viewport")[0]
			.setAttribute(
				"content",
				"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
			);

	}, []);

	// 渲染页面
	if (isShowAuth) {
		return (
			<ConfigProvider
				theme={{
					"token": {
						"colorPrimary": "#000",
						"colorInfo": "#7728f5",
					}
				}}
			>
				<div id="login-container" className='relative flex h-screen flex-col bg-[#f5f5f5] h-100vh w-full justify-center'>
					<div className="relative w-full h-full flex flex-col sm:p-6 justify-center bg-white sm:border-[1px] sm:border-solid sm:border-[rgba(222,222,222,1)] sm:rounded-2xl sm:shadow-xl max-w-[1200px] items-center m-auto">
						{
							<div className="absolute left-6 top-6 w-[120px]">
								<a href="https://302.ai" target="_blank">
									<img width="100%" height="auto" src="/images/banner.png" alt="logo" />

								</a>
							</div>
						}

						{

							<div className={isShowFrom ? '' : 'opacity-0'}>
								<AdminForm data={loginData} msg={errMessage} onSubmit={handleLogin} />
							</div>
						}

						{!isShowFrom && <div className="absolute w-full">
							<PageLoading />
						</div>}
					</div>
				</div>
				<>{contextHolder}</>
			</ConfigProvider>
		)
	}
	return (
		<div className="flex w-full flex-col">
			{/* <Header /> */}
			<div id="translator-header">
				<div className="flex space-x-2 items-center justify-center p-2 w-full">
					<div className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]">
						<a href="https://302.ai" target="_blank">
							<img className="w-full h-auto" src="/images/logo.png" alt="" />
						</a>

					</div>
					<div className="text-[22px] sm:text-[28px] no-underline">
						AI翻译大师数据管理后台
					</div>
				</div>
			</div>
			<div id="admin-container" className="flex w-full justify-center sm:mt-2">
				<div className="w-full flex flex-col  p-4 sm:p-6 justify-center bg-white border-y-[1px] border-x-[1px] sm:border-[1px] border-solid border-[rgba(222,222,222,1)] sm:rounded-2xl shadow-xl max-w-[1200px] relative">
					<AdminTable
						onData={GetPostsService}
						onUpdate={UpdatePostService}
						onDelete={DeletePostService}
					/>
				</div>

				<>
					{contextHolder}
				</>
			</div >
			<Footer />
		</div>

	);
}
