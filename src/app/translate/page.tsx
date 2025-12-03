"use client";
// Base
import { useState, useEffect, useRef } from "react";
// store
import AppContext from '../../store';
// uuid
import { v4 as uuidv4 } from 'uuid';
// fetch-ploffil
import 'whatwg-fetch'
// markdown
import ReactMarkdown from "react-markdown";
import remarkBreaks from 'remark-breaks';

// Ui: Component
import { Space, Button, Select, Input, Tag, message, MenuProps, Dropdown, ConfigProvider } from "antd";
// UI: Icon
import {
	SwapOutlined,
	ClearOutlined,
	CopyOutlined,
	SyncOutlined,
	EditOutlined,
	HistoryOutlined,
	CaretDownOutlined,
	SettingFilled,
	PlusOutlined,
	QuestionCircleOutlined,
	PlayCircleOutlined,
} from "@ant-design/icons";
// style: fix 360 browser
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';
// 
import { StopIcon, SummaryIcon, ModifyIcon, PolishIcon } from "@/components/MyIcon";
// UI: Style
import "./page.css";

// Type
import {
	TransferAction,
	RoleSymbol,
	Language,
	Prompt,
	History,
	Role,
	TAuthData,
	TLoginData
} from "./type";
// Constant
import { DEFAULT_LANGUAGES, DEFAULT_ROLES, DEFAULT_PROMPTS, DEFAULT_AUTH_DATA, DEFAULT_LOGIN_DATA, GLOBAL_INTERNATIONAL_DATA, GLOBAL_DOMESTIC_DATA } from "./constant";

// Utile
import SystemManager from "../../../utils/System";
import FetchWithAbort from "../../../utils/FetchWithAbort";
import { ChatGPTMessage } from "../../../utils/OpenAiStream";

// Locales
import Locale, {
	AllLangs,
	ALL_LANG_OPTIONS,
	setLang,
	getLang,
} from "../../locales";

// Server
import {
	GetRolesService,
	GetLanguagesService,
	// history
	GetHistorysService,
	UpdateHistorysService,
	// config
	GetConfigService,
	UpdateConfigService,
	// cammand
	GetCommandService,
	GetLocalAuthDataService,
	UpdateLocalAuthDataService,
	LoginService,
	DetectLanguageService,
	// prompt
	GetPromptsService,
	PostPromptService, // add || update
	DeletePromptService,
	// post
	GetPostsService,
	AddPostService,
	LikePostService,
} from "./query";

// Component
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import PageLoading from "../../components/PageLoading";
import LoginForm from '@/components/LoginForm'
import NotifyDrawer from "@/components/NotifyDrawer";
import QuestionDrawer from "@/components/QuestionDrawer";
import HistoryDrawer from "@/components/HistoryDrawer";
import PromptDrawer from "@/components/PromptDrawer";
import PromptModal from "@/components/PromptModal";
import LangMenu from "@/components/LangMenu";
import { useRouter } from 'next/navigation'

// items
const items: MenuProps['items'] = [
	{
		label: Locale.Translate.Summary,
		key: 'summary',
		icon: <SummaryIcon />,
	},
	{
		label: Locale.Translate.Polish,
		key: 'polish',
		icon: <PolishIcon />,
	},
	{
		label: Locale.Translate.Modify,
		key: 'modify',
		icon: <ModifyIcon />,
	},
];


// Function
export default function TranslaterPage() {
	// store
	const [globalState, setGlobalState] = useState(GLOBAL_INTERNATIONAL_DATA);
	// componnent
	const { TextArea } = Input;
	const [messageApi, contextHolder] = message.useMessage();
	// State: Page
	const [isShowAuth, setIsShowAuth] = useState(true);
	const [isConnect, setIsConnect] = useState(false);
	const [isLoadInput, setIsLoadInput] = useState(false);
	const [isLoadOuput, setIsLoadOutput] = useState(false);
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");
	const [actionType, setactionType] = useState<TransferAction>("left-to-right");
	const [textContent, setTextContent] = useState("");
	// const [textAreaMaxCount, setTextAreaMaxCount] = useState(80000)
	const [textAreaFontSize, setTextAreaFontSize] = useState("24px")
	const [textAreaHeight, setTextAreaHeight] = useState("360px")
	const [serverKey, setServerKey] = useState("")
	// State: Device
	const [isMobile, setIsMobile] = useState(false);
	const [textRow, setTextRow] = useState(18);
	// State: Detect
	const [isDetect, setIsDetect] = useState(false);
	// State: Language
	const [languageList, setLanguageList] =
		useState<Language[]>(DEFAULT_LANGUAGES);
	const [originLanguage, setOriginLanguage] = useState(DEFAULT_LANGUAGES[0]);
	const [targetLanguage, setTargetLanguage] = useState(DEFAULT_LANGUAGES[1]);
	// State: Role
	const [roleList, setRoleList] = useState<Role[]>([]);
	// State: Notify
	const [isNotifyDrawerOpen, setIsNotifydrawerOpen] = useState(false);
	// Sate: Auth
	const [notifyData, setNotifyData] = useState({ title: '', desc: '' })
	// State: Question
	const [isQuestionDrawerOpen, setIsQuestiondrawerOpen] = useState(false);
	// State: Prompt
	const [showType, setShowType] = useState('')
	const [promptList, setPromptList] = useState<Prompt[]>([]);
	const [publishList, setPublishList] = useState<Prompt[]>([]);
	const [showPrompt, setShowPrompt] = useState(DEFAULT_PROMPTS[0]);
	const [selectedPrompt, setSelectedPrompt] = useState({ ...DEFAULT_PROMPTS[0], id: -1 });
	const [isPromptDrawerOpen, setIsPromptdrawerOpen] = useState(false);
	const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
	// State: History
	const [historyList, setHistoryList] = useState<History[]>([]);
	const [isHistoryDrawerOpen, setIsHistorydrawerOpen] = useState(false);
	// State: Auth
	const [loginData, setLoginData] = useState<TLoginData>(DEFAULT_LOGIN_DATA)
	const [authData, setAuthData] = useState<TAuthData>(DEFAULT_AUTH_DATA)
	// State: Login
	const [isShowFrom, setIsShowFrom] = useState(false)
	const [errMessage, setErrMessage] = useState('')
	// State: prompt
	const [defaultPrompt, setDefaultPrompt] = useState(
		{
			id: 0,
			like: 0,
			status: 1,
			agent: 'user',
			author: '',
			name: '',
			content: '',
			origin: '',
			target: '',
		}
	)
	// State: model
	const [model, setModel] = useState('')
	// State: lock
	const [lock, setLock] = useState(false)

	// Effect: model
	useEffect(() => {
		if (model && ['deepl-en', 'deepl-zh', 'deepl-ja'].includes(model)) {
			const symbol = model.split('-')[1]
			const item = languageList.find((it) => it.symbol == symbol);
			if (item) {
				setTargetLanguage(item)
				setLock(true)
			}
		}
	}, [model])

	// Effect: target
	useEffect(() => {
		// deepl-en
		// deepl-zh
		// deepl-ja
		if (['deepl-en', 'deepl-zh', 'deepl-ja'].includes(model)) {
			setTimeout(() => {
				const symbol = model.split('-')[1]
				const item = languageList.find((it) => it.symbol == symbol);
				if (item) {
					setTargetLanguage(item)
				}
			}, 30)
		}
	}, [targetLanguage])

	// Ref: fetch
	const inputTextAreaRef = useRef<any>(null);
	const outputTextAreaRef = useRef<any>(null);
	const outputMarkdownRef = useRef<any>(null);
	const fetchWithAbortRef = useRef<any>();

	// router
	const router = useRouter()

	// 交换语言选择
	const handleSwitch = () => {
		setOriginLanguage(targetLanguage);
		setTargetLanguage(originLanguage);
		if (outputText) {
			setInputText(outputText);
			setOutputText(inputText);
		}
	};

	// 修改来源语言
	const handleChangeOrigin = (value: string) => {
		const item = languageList.find((it) => it.symbol == value);
		if (item) {
			setOriginLanguage(item);
		}
	};
	// 修改目标语言
	const handleChangeTarget = (value: string) => {
		const item = languageList.find((it) => it.symbol == value);
		if (item) {
			setTargetLanguage(item);
		}
	};

	// 中断请求
	const handleCancelFetch = () => {
		fetchWithAbortRef.current.cancel();
	};

	// 处理输入
	const handleInputText = (event: any) => {
		setInputText(event.target.value);
	};

	// 处理输出
	const handleOutputText = (event: any) => {
		setOutputText(event.target.value);
	};


	// 处理回车
	const handleEnterPress = (event: any) => {
		// 移动端不处理
		if (isMobile) return;
		// Escape取消请求
		if (isConnect && event.key === "Escape") {
			handleCancelFetch()
		}
		// shift+enter不处理
		// if (!event.shiftKey && event.key === "Enter") {
		if (!event.shiftKey && event.keyCode === 13) {
			event.preventDefault(); // 阻止默认行为比如换行
			handleTransfer("translate", "left-to-right");
		}
	};

	// 清空输入输出
	const handleClerText = () => {
		if (isConnect) {
			handleCancelFetch()
		}
		setInputText("");
		setOutputText("");
	};

	// 复制文本
	const handleCopyText = (text: string) => {
		if (!text) {
			return messageApi.info(Locale.Copy.Empty);
		}
		SystemManager.copyToClipboard(text);
		return messageApi.info(Locale.Copy.Done);
	};

	// 自动复制
	const handleAutoCopy = async () => {
		return new Promise((resolve, reject) => {
			try {
				if (outputTextAreaRef.current) {
					const outputDom = outputTextAreaRef.current.resizableTextArea.textArea
					outputDom.click()
					resolve('done')
				}
			} catch (error) {
				resolve('not done')
			}
		})
	}

	// Handle Prompt////////////////////////////////
	// Prompt: 打开抽屉
	const handlePrompts = (type: string) => {
		setIsPromptdrawerOpen(true);
		setShowType(type)
	};

	// Prompt: 打开新增弹框
	const handlePromptAdd = async () => {
		const localData = await GetLocalAuthDataService();
		const user = localData.domain + localData.u
		const item: Prompt = {
			id: 0,
			like: 0,
			status: 1,
			agent: 'user',
			author: user,
			name: '',
			content: '',
			origin: '',
			target: '',
		}
		setShowPrompt(item);
		setIsPromptModalOpen(true);
	};

	// Prompt: 打开修改弹框
	const handlePromptEdit = (data: Prompt) => {
		const item = JSON.parse(JSON.stringify(data));
		setShowPrompt(item);
		setIsPromptModalOpen(true);
	};

	// prmmpts: 获取列表
	const handlePromptsRefresh = async () => {
		try {
			// 当前域名=user
			const localData = await GetLocalAuthDataService();
			const user = localData.domain + localData.uuid
			const prompts = await GetPromptsService({ user });
			// 刷新列表
			setPromptList(prompts);
		} catch (error) {
			messageApi.warning(Locale.Error.NetworkError)
		}
	}

	// tab: 切换tab
	const handleTabChange = (tab: string) => {
		setShowType(tab)
	}


	// Prompt: 处理确认
	const handlePromptConfirm = async (data: Prompt) => {
		const action = data.id ? `${Locale.System.Modify}[${data.name}]` : `${Locale.System.Add}[${data.name}]`
		try {
			// 新增/修改
			const result = await PostPromptService(data)
			// 选中此项
			setSelectedPrompt(result)
			// 刷新列表
			await handlePromptsRefresh()
			// 提示
			messageApi.info(`${action}${Locale.System.Success}！`)
		} catch (error) {
			messageApi.warning(`${Locale.System.Error}，${action}${Locale.System.Faild}！`)
		}
	};

	// Prompt: 处理复制
	const handlePromptCopy = async (data: Prompt) => {
		const localData = await GetLocalAuthDataService();
		const user = localData.domain + localData.uuid
		const item: Prompt = {
			id: 0,
			like: 0,
			status: 1,
			agent: 'user',
			author: user,
			name: data.name,
			content: data.content,
			origin: data.origin,
			target: data.target,
		}
		try {
			// 增加收藏数
			await LikePostService(data)
			// 新增/修改
			const result = await PostPromptService(item)
			// 选中此项
			setSelectedPrompt(result)
			// 刷新列表
			await handlePromptsRefresh()
			// 提示
			messageApi.info(`${Locale.System.Add}[${item.name}]${Locale.System.Success}！`)
		} catch (error) {
			messageApi.warning(`${Locale.System.Error}，${Locale.System.Add}${item.name}${Locale.System.Faild}！`)
		}
	};

	// Prompt: 处理发布
	const handlePromptPublish = async (data: Prompt) => {
		try {
			// 新增Post
			const item = JSON.parse(JSON.stringify(data))
			item.id = 0
			item.status = 1
			const result = await AddPostService(item)
			if (!result) {
				return messageApi.warning(Locale.Share.Repeat)
			}
			messageApi.info(Locale.Share.Done)
		} catch (error) {
			messageApi.warning(Locale.Share.Faild)
		}
	};

	// Prompt: 处理删除
	const handlePromptDelete = async (data: Prompt) => {
		if (data.id) {
			// 删除
			const result = await DeletePromptService(data)
			// 切换
			if (data.id === selectedPrompt.id) {
				const newList = [...promptList, ...DEFAULT_PROMPTS].filter(it => it.id !== data.id)
				const item = newList[0]
				setSelectedPrompt(item)
			}
			// 刷新列表
			await handlePromptsRefresh()
			// 提示
			messageApi.info(`${Locale.System.Delete}[${data.name}]${Locale.System.Success}!`);
		} else {
			messageApi.info(`${Locale.System.Error}，${Locale.System.Delete}${Locale.System.Faild}!`);
		}
	};

	// Handle History////////////////////////////////
	const handleHistory = () => {
		if (!historyList.length) {
			return messageApi.info(Locale.History.Empty);
		}
		setIsHistorydrawerOpen(true);
	};

	// History: Add
	const handleHistoryAdd = (item: History) => {
		const newList = [...historyList, item];
		UpdateHistorysService(newList);
		setHistoryList(newList);
	};

	// History: Delete
	const handleHistoryDelete = (item: History) => {
		if (item.id) {
			const newList = historyList.filter((it) => it.id !== item.id);
			UpdateHistorysService(newList);
			setHistoryList(newList);
		} else {
			messageApi.warning(Locale.History.Error);
		}
	};

	// Hsitory: Rollback
	const handleHistoryRollback = (item: History) => {
		try {
			// set language
			setOriginLanguage(item.origin);
			setTargetLanguage(item.target);
			// set prompt，没有则新增
			const existPrompt = [...DEFAULT_PROMPTS, ...promptList].find(
				(it) => it.id == item.prompt.id && it.content == item.prompt.content
			);
			if (!existPrompt) {
				const newPrompt: Prompt = JSON.parse(JSON.stringify(item.prompt));
				newPrompt.id = 0;
				handlePromptConfirm(newPrompt);
			} else {
				// 选中
				setSelectedPrompt(existPrompt);
			}
			// set text, 暂不根据action来
			setInputText(item.input);
			setOutputText(item.output);
			// 关闭抽屉
			setIsHistorydrawerOpen(false);
			// 通知状态
			messageApi.info(Locale.History.RollbackSuccess);
		} catch (error) {
			messageApi.warning(Locale.History.RollbackFaild);
		}
	};

	// History: Clear
	const handleHistoryClear = () => {
		UpdateHistorysService([]);
		setHistoryList([]);
		setIsHistorydrawerOpen(false);
		messageApi.info(Locale.History.ClearSuccess);
	};


	// Handle Question//////////////////////////////
	const handleQuestion = async () => {
		try {
			// const result = await LoginService({ domain: 'ergou-translate', code: '', remember: true })
			const result = await LoginService({
				uuid: authData.uuid,
				domain: authData.domain,
				code: authData.code,
				remember: authData.remember
			})
			setAuthData(result)
			setIsQuestiondrawerOpen(true);
		} catch (error: any) {
			return messageApi.warning(error.message);
		}
	}


	// Handle Translate///////////////////////////
	// 处理翻译类型要求,角色跟行为
	const handleTransfer = async (
		roleSymbol: RoleSymbol,
		currentAction: TransferAction
	) => {
		// check deepl
		let isDeepl = false
		if (model.includes('deepl')) {
			isDeepl = true
		}
		// check connect
		if (isConnect) {
			return messageApi.warning(Locale.System.Wait);
		}
		// set action
		setactionType(currentAction);
		// reset message
		setTextContent("");
		// get text
		let currentText = "";
		switch (currentAction) {
			case "left-to-left":
				currentText = inputText;
				setInputText("");
				break;
			case "left-to-right":
				currentText = inputText;
				setOutputText("");
				break;
			case "right-to-right":
				currentText = outputText;
				setOutputText("");
				break;
			default:
				break;
		}
		if (!currentText) {
			return messageApi.info(Locale.Translate.Empty);
		}
		// get role
		const selectRole =
			roleList.find((it) => it.symbol == roleSymbol) || DEFAULT_ROLES[0];
		// get command
		const command = await GetCommandService({
			role: selectRole,
			prompt: selectedPrompt,
			origin: originLanguage,
			target: targetLanguage,
		});

		try {
			// set connect
			setIsConnect(true);
			// init fetch
			fetchWithAbortRef.current = new FetchWithAbort();
			// init payload
			// fix: qq browser fetch
			const userAgent = navigator.userAgent.toLowerCase();
			const isStream = !(userAgent.includes('mqqbrowser') && userAgent.includes('mobile'))
			let fetUrl = `${process.env.NEXT_PUBLIC_302AI_FETCH}chat/completions`
			let headers = {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${authData.key}`,
			} as any;
			let payload = {
				messages: [
					{ role: "system", content: command } as ChatGPTMessage,
					{ role: "user", content: currentText } as ChatGPTMessage,
				],
				stream: isStream,
				model: authData.model,
			} as any;

			// deepl
			if (isDeepl) {
				fetUrl = `${process.env.NEXT_PUBLIC_302AI_FETCH?.replace('v1', 'deepl')}v2/translate`
				headers = {
					"Content-Type": "application/json",
					'Accept': 'application/json',
					"Authorization": `Bearer ${authData.key}`,
				}
				payload = {
					text: [currentText],
					source_lang: '',
					target_lang: targetLanguage.symbol.toUpperCase(),
				}
			}

			// use fetch
			const result = await fetchWithAbortRef.current.fetch(fetUrl,
				model,
				(chunk: string) => {
					// 处理数据流
					setTextContent((text) => text + chunk);
				},
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						'Accept': 'application/json',
						"Authorization": `Bearer ${authData.key}`,
					},
					body: JSON.stringify(payload),
				}
			);

			// 保存记录
			handleHistoryAdd({
				id: Date.now(),
				action: currentAction,
				origin: originLanguage,
				target: targetLanguage,
				role: selectRole,
				prompt: selectedPrompt,
				input: inputText,
				output: result || "",
			});
			// 自动复制数据到剪切板
			if (result) {
				// handleCopyText(result);
				handleAutoCopy()
			}
			// debug:start
			// setNotifyData({
			// 	title: Locale.Error.HourCostTip,
			// 	desc: Locale.Error.HourCostOut,
			// })
			// setIsNotifydrawerOpen(true)
			// debug:end
		} catch (error) {
			if (error === '-10001') {
				messageApi.warning(Locale.Error.TokenMiss)
			}
			else if (error === '-10002') {
				// messageApi.warning('账号已失效，请联系管理员恢复！')
				setNotifyData({
					title: Locale.Error.AccountError,
					desc: Locale.Error.AccountUnvalid
				})
				setIsNotifydrawerOpen(true)
			}
			else if (error === '-10003') {
				messageApi.warning(Locale.Error.InternalError)
			}
			else if (error === '-10004') {
				messageApi.warning(Locale.Error.BalanceOut)
			}
			else if (error === '-10005') {
				messageApi.warning(Locale.Error.TokenExpire)
			}
			else if (error === '-10006') {
				// messageApi.warning('账号总额度已用完，请联系管理员进行充值！')
				setNotifyData({
					title: Locale.Error.TotalCostTip,
					desc: Locale.Error.TotalCostOut
				})
				setIsNotifydrawerOpen(true)
			}
			else if (error === '-10007') {
				// messageApi.warning('账号单日额度已用完，请联系管理员进行充值！')
				setNotifyData({
					title: Locale.Error.TodayCostTip,
					desc: Locale.Error.TodayCostOut
				})
				setIsNotifydrawerOpen(true)
			}
			else if (error === '-10012') {
				setNotifyData({
					title: Locale.Error.HourCostTip,
					desc: Locale.Error.HourCostOut,
				})
				setIsNotifydrawerOpen(true)
			}
			else if (error === '-10018') {
				setNotifyData({
					title: Locale.Error.MonthCostTip,
					desc: Locale.Error.MonthCostOut,
				})
				setIsNotifydrawerOpen(true)
			}
			else if (error === "aborted") {
				messageApi.warning(Locale.Error.FetchCancel);
			}
			else {
				// messageApi.warning(Locale.Error.FetchError);
				messageApi.warning(JSON.stringify(error));
			}
		} finally {
			setIsConnect(false);
		}
	};

	// Handle TTS
	const textToSpeech = async (text: string, type: string) => {
		try {
			if (type === 'input') {
				setIsLoadInput(true)
			} else {
				setIsLoadOutput(true)
			}
			const response = await fetch(`${process.env.NEXT_PUBLIC_302AI_FETCH}audio/speech`, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${authData.key}`,
				},
				body: JSON.stringify({
					"model": "tts-1",
					"input": text,
					"voice": "shimmer"
				})
			});

			const audioData = await response.blob();
			const audioUrl = URL.createObjectURL(audioData);

			// 在页面上播放语音
			const audioElement = new Audio(audioUrl);
			audioElement.play();

		} catch (error) {
			// todo
			messageApi.warning(Locale.Error.FetchError);
		} finally {
			if (type === 'input') {
				setIsLoadInput(false)
			} else {
				setIsLoadOutput(false)
			}
		}
	}

	// Handle Detect
	const handleDetect = async () => {
		if (!inputText) {
			return messageApi.warning(Locale.Detect.Empty);
		}
		try {
			setIsDetect(true);
			// set origin
			const input = await DetectLanguageService(inputText.slice(0, 20));
			const origin = languageList.find((it) => it.symbol == input.symbol);
			if (!origin) {
				setIsDetect(false);
				return messageApi.warning(Locale.Detect.Faild);
			}
			setOriginLanguage(origin);
			// set target
			const local = navigator.language.split('-')[0]
			const target = languageList.find((it) => it.symbol == local);
			if (target && target.symbol !== origin.symbol) {
				setTargetLanguage(target);
			}
			// show msg
			setIsDetect(false);
			messageApi.info(Locale.Detect.Done);
		} catch (error) {
			setIsDetect(false);
			return messageApi.warning(Locale.Detect.Error);
		}
	};


	// Handler Translator Button click
	const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		handleTransfer("translate", "left-to-right")
	};

	// Handle Other transffer Button Click
	const handleMenuClick: MenuProps['onClick'] = (e) => {
		handleTransfer(e.key as RoleSymbol, 'left-to-right')
	};

	// Handle form submit
	const handleLogin = async (values: any) => {
		// return
		try {
			const result = await LoginService(values)
			// const result = await LoginService({ domain: 'ergou-translate', code: '555', remember: true, uuid: '' })

			// save model
			setModel(result.model)

			// 如果没有验证码并且还没存在uuid，写入uuid
			if (!result.code && !result.uuid) {
				// const uuid = uuidv4();
				const uuid = '-' + uuidv4().split('-')[0];
				result.uuid = uuid
			}
			// 根据地区设施全局数据
			if (result.region === 1) {
				setGlobalState({ ...GLOBAL_INTERNATIONAL_DATA, showBrand: result.showBrand })
			} else {
				setGlobalState({ ...GLOBAL_DOMESTIC_DATA, showBrand: result.showBrand })
			}

			setAuthData(result)
			// const localData
			await UpdateLocalAuthDataService(result)
			// 刷新prompts数据
			await handlePromptsRefresh()
			// 刷新posts数据
			// await handlePostsRefresh()
			// 设置默认prompt
			setDefaultPrompt(
				(preItem) => {
					return { ...preItem, author: result.domain + result.uuid }
				}
			)
			// messageApi.info("验证成功!")
			setIsShowAuth(false);
			// fix: quark browser unless reflesh
			const userAgent = navigator.userAgent.toLowerCase();
			if (!userAgent.includes('quark')) {
				router.replace(window.location.pathname)
			}
		} catch (error: any) {
			setErrMessage(error.message)
			setIsShowFrom(true)
			if (error?.message === 'Failed to fetch') {
				messageApi.warning(Locale.Error.NetworkError);
			} else {
				messageApi.warning(error.message);
			}
		}
	};

	// Effect/////////////////////////////////////
	// 初始化全局数据
	useEffect(() => {
		// console.log('global::init::::')
		const params = new URLSearchParams(window.location.search)
		const region = params.get('region')
		if (region && region === '0') {
			setGlobalState(GLOBAL_DOMESTIC_DATA)
		}
	}, [])

	// 初始化客服
	useEffect(() => {
		const hostname = window.location.hostname;
		const domain = hostname.split('.')[0];
		if (!['demo', 'demo2', 'drawing-demo'].includes(domain) && globalState.showBrand === "true") {
			if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
				var script = document.createElement("script");
				script.src = "https://plugin-code.salesmartly.com/js/project_511917_530775_1761892972.js";
				document.head.appendChild(script);
			}
		}

		// 清除脚本
		return () => {
			const existingScript = document.querySelector("[src='https://plugin-code.salesmartly.com/js/project_511917_530775_1761892972.js']");
			existingScript && document.head.removeChild(existingScript);
		};
	}, [globalState.showBrand]);

	// 初始化数据
	useEffect(() => {
		// 定义异步函数
		const fetchData = async () => {
			try {

				// int auth data::::::start
				// 没登录初始化验证数据, 默认记住验证码
				const localData = await GetLocalAuthDataService();
				const newData = loginData
				// 写入UUID
				newData.uuid = localData.uuid
				// 写入当前域名
				newData.domain = window.location.hostname.split('.')[0]
				// 如果缓存开启记住验证码，从缓存获取
				if (localData.remember) {
					newData.code = localData.code
				}
				// 如果链接有验证码参数，从链接取
				const pwd = new URLSearchParams(window.location.search).get('pwd');
				if (pwd) { newData.code = pwd }
				// 重置语言
				// const lang = new URLSearchParams(window.location.search).get('lang');
				// if (lang) {
				// 	setLang(lang as any)
				// }
				// 重置验证数据
				setLoginData(newData);
				// init auth data::::::end

				// fetch
				// await handlePromptsRefresh()
				const languages = await GetLanguagesService();
				const roles = await GetRolesService();
				const historys = await GetHistorysService();

				// set
				if (languages) {
					setLanguageList(languages);
					setOriginLanguage(languages[0]);
					setTargetLanguage(languages[1]);
				}
				if (roles) {
					setRoleList(roles);
				}
				if (historys) {
					setHistoryList(historys);
				}
			} catch (error) {
				// console.log('error::,', error)
				messageApi.warning(Locale.Error.InitError)

			}
		};
		// 获取数据
		fetchData();
	}, [loginData, messageApi]);

	// 初始化页面
	useEffect(() => {
		// title
		document.title = Locale.Title;
		// Resize
		const handleResize = () => {
			// mobile
			if (Number(window.innerWidth) < 650) {
				setIsMobile(true);
				// setTextRow(6);
				setTextAreaHeight('140px')
				// device height
				if (Number(window.innerHeight) > 600) {
					// setTextRow(7);
					setTextAreaHeight('160px')
				}
				if (Number(window.innerHeight) > 670) {
					// setTextRow(8);
					setTextAreaHeight('180px')
				}
				if (Number(window.innerHeight) > 720) {
					// setTextRow(9);
					setTextAreaHeight('200px')
				}
			} else {
				setIsMobile(false);
				// setTextRow(18);
				setTextAreaHeight('360px')
			}
		};

		// 监听窗口缩放
		handleResize();
		window.addEventListener("resize", handleResize);
		// 禁止页面缩放
		document
			.getElementsByName("viewport")[0]
			.setAttribute(
				"content",
				"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
			);
		// 组件销毁解绑事件
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// 响应数据
	useEffect(() => {
		if (textContent) {
			if (actionType == "left-to-left") {
				setInputText(textContent);
			} else {
				setOutputText(textContent);
			}
		}
	}, [textContent, actionType]);

	// 响应input：自动切换字体大小
	useEffect(() => {
		if (!inputText.length && !outputText.length) {
			setTextAreaFontSize('24px')
		}
		if (inputText.length > 10 || outputText.length > 10) {
			setTextAreaFontSize((preSize) => preSize < '22px' ? preSize : '22px')
		}
		if (inputText.length > 20 || outputText.length > 20) {
			setTextAreaFontSize((preSize) => preSize < '20px' ? preSize : '20px')
		}
		if (inputText.length > 30 || outputText.length > 30) {
			setTextAreaFontSize((preSize) => preSize < '18px' ? preSize : '18px')
		}
		if (inputText.length > 50 || outputText.length > 30) {
			setTextAreaFontSize((preSize) => preSize < '16px' ? preSize : '16px')
		}
	}, [inputText, outputText])

	// 响应textArea：自动滚动底部 && 同步文本框高度
	useEffect(() => {
		// input
		if (inputTextAreaRef.current) {
			const inputDom = inputTextAreaRef.current.resizableTextArea.textArea
			// 创建一个新的ResizeObserver实例，监听尺寸变化
			const resizeObserver = new ResizeObserver(entries => {
				for (let entry of entries) {
					// 当textarea的尺寸变化时，这里的代码会被执行
					const minHeight = isMobile ? 140 : 360
					const newHeight = entry.target.clientHeight > minHeight ? entry.target.clientHeight : minHeight
					setTextAreaHeight(newHeight + 'px')
				}
			});
			// 开始监听textarea的尺寸变化
			resizeObserver.observe(inputDom);
		}
		// output
		if (outputTextAreaRef.current) {
			const outputDom = outputTextAreaRef.current.resizableTextArea.textArea
			const scrollHeight = outputDom.scrollHeight;
			outputDom.scrollTop = scrollHeight;
			// 创建一个新的ResizeObserver实例，监听尺寸变化
			const resizeObserver = new ResizeObserver(entries => {
				for (let entry of entries) {
					// 当textarea的尺寸变化时，这里的代码会被执行
					const minHeight = isMobile ? 140 : 360
					const newHeight = entry.target.clientHeight > minHeight ? entry.target.clientHeight : minHeight
					setTextAreaHeight(newHeight + 'px')
				}
			});
			// 开始监听textarea的尺寸变化
			resizeObserver.observe(outputDom);
		}
		// markdown
		if (outputMarkdownRef.current) {
			const outputDom = outputMarkdownRef.current
			const scrollHeight = outputDom.scrollHeight;
			outputDom.scrollTop = scrollHeight;
			// 创建一个新的ResizeObserver实例，监听尺寸变化
			// const resizeObserver = new ResizeObserver(entries => {
			// 	for (let entry of entries) {
			// 		// 当textarea的尺寸变化时，这里的代码会被执行
			// 		setTextAreaHeight(entry.target.clientHeight + 'px')
			// 	}
			// });
			// 开始监听textarea的尺寸变化
			// resizeObserver.observe(outputDom);
		}
	});

	// 要求列表变化
	useEffect(() => {
		const config = GetConfigService()
		if (config.prompt) {
			const item = [...promptList, ...DEFAULT_PROMPTS].find((it) => it.id === config.prompt.id && it.agent === config.prompt.agent)
			if (item) {
				setSelectedPrompt(item)
			}
		} else {
			const item = [...promptList, ...DEFAULT_PROMPTS][0]
			setSelectedPrompt(item)
		}
	}, [promptList, setSelectedPrompt])

	// 选中要求变化
	useEffect(() => {
		// savelocal
		if (selectedPrompt.id < 0) return
		const config = GetConfigService()
		UpdateConfigService({ ...config, prompt: selectedPrompt })
		// set lang
		if (selectedPrompt.origin) {
			const item = languageList.find((it) => it.symbol == selectedPrompt.origin);
			if (item) {
				setOriginLanguage(item);
			}
		}
		if (selectedPrompt.target) {
			const item = languageList.find((it) => it.symbol == selectedPrompt.target);
			if (item) {
				setTargetLanguage(item);
			}
		}
	}, [selectedPrompt, languageList, setOriginLanguage, setTargetLanguage])




	// 渲染页面
	if (isShowAuth) {
		return (
			<AppContext.Provider value={globalState}>
				<ConfigProvider
					theme={{
						"token": {
							"colorPrimary": "#000",
							"colorInfo": "#7728f5",
						}
					}}
				>
					<StyleProvider layer hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
						<div id="auth-container" className='relative flex h-screen flex-col bg-[#f5f5f5] h-100vh w-full justify-center'>
							<div className="relative w-full h-full flex flex-col sm:p-6 justify-center bg-white sm:border-[1px] sm:border-solid sm:border-[rgba(222,222,222,1)] sm:rounded-2xl sm:shadow-xl max-w-[1200px] items-center m-auto">
								<div className="flex text-xl">{isShowFrom}</div>
								{globalState.showBrand === "true" &&
									<div className="absolute left-6 top-6 w-[120px]">
										<a href={globalState.domain} target="_blank">
											<img width="100%" height="auto" src="/images/banner.png" alt="logo" />

										</a>
									</div>
								}

								{

									loginData.domain && <div className={isShowFrom ? '' : 'opacity-0'}>
										<LoginForm data={loginData} msg={errMessage} onSubmit={handleLogin} />
									</div>
								}

								{!isShowFrom && <div className="absolute w-full">
									<PageLoading />
								</div>}
							</div>
						</div>
						<>{contextHolder}</>
					</StyleProvider>
				</ConfigProvider>
			</AppContext.Provider>
		)
	}
	return (
		<AppContext.Provider value={globalState}>
			<StyleProvider layer hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
				<div className="flex w-full flex-col">
					<Header />
					<div id="tanslator-container" className="flex w-full justify-center sm:mt-6">
						<div className="w-full flex flex-col  p-4 sm:p-6 justify-center bg-white border-y-[1px] border-x-[1px] sm:border-[1px] border-solid border-[rgba(222,222,222,1)] sm:rounded-2xl shadow-xl max-w-[1200px] relative">
							<div className="absolute right-2 top-2 flex space-x-4 items-center">
								{/* <LangMenu /> */}
								{globalState.showBrand === "true" &&
									<QuestionCircleOutlined onClick={handleQuestion} className="my-button my-icon" />
								}
							</div>
							<div className="flex w-full items-center justify-between">
								<div className="flex-1">
									<Space>
										<Select
											size="large"
											virtual={false}
											showSearch
											optionFilterProp="name"
											value={originLanguage.symbol}
											variant="borderless"
											style={{ width: 100 }}
											popupMatchSelectWidth={false}
											onChange={handleChangeOrigin}
											options={languageList}
											fieldNames={{ label: "name", value: "symbol" }}
										/>

									</Space>
								</div>
								<div className="w-6 my-button">
									<SwapOutlined onClick={handleSwitch} className="my-icon" />
								</div>
								<div className="flex-1 flex justify-end sm:justify-start">
									<Select
										size="large"
										virtual={false}
										showSearch
										variant="borderless"
										style={{ width: 100, fontSize: "30px" }}
										popupMatchSelectWidth={false}
										optionFilterProp="name"
										value={targetLanguage.symbol}
										onChange={handleChangeTarget}
										options={languageList}
										fieldNames={{ label: "name", value: "symbol" }}
										disabled={lock}
									/>
								</div>
							</div>

							<div className="w-full mt-2 flex justify-between items-center">
								<div className="flex-1 flex items-start">
									<div className="text-[14px] text-[#101010]">{Locale.Translate.Request}: </div>
									<div className="flex-1 flex px-2 w-[200px]">
										<div className="w-[100px] flex-1 tags  overflow-x-scroll my-scroll">
											<div className="flex">
												<Tag
													icon={<PlusOutlined />}
													className="px-2 my-tag cursor-pointer"
													onClick={() => handlePrompts('Add')}
												/>
												{promptList.map(
													it => <Tag key={it.id}
														className={`px-6 my-tag cursor-pointer ${selectedPrompt.id === it.id && selectedPrompt.agent === it.agent ? 'my-tag-active' : ''}`}
														onClick={() => selectedPrompt.id === it.id && selectedPrompt.agent === it.agent ? handlePromptEdit(it) : setSelectedPrompt(it)}
													>
														{it.name}
														{
															selectedPrompt.id === it.id && selectedPrompt.agent === it.agent && <EditOutlined />
														}
													</Tag>
												)}
												{DEFAULT_PROMPTS.map(
													it => <Tag key={it.id}
														className={`${it.id > 0 ? 'px-6' : 'px-4'} my-tag cursor-pointer ${selectedPrompt.id === it.id && selectedPrompt.agent === it.agent ? 'my-tag-active' : ''}`}
														onClick={() => selectedPrompt.id === it.id && selectedPrompt.agent === it.agent ? handlePromptEdit(it) : setSelectedPrompt(it)}
													>
														{it.name}
													</Tag>
												)}
												<Tag
													icon={<SettingFilled />}
													className="px-2 my-tag cursor-pointer"
													onClick={() => handlePrompts('Edit')}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>

							<form action="" className="relative mt-2 flex space-x-0 space-y-3 sm:space-x-6 sm:space-y-0 flex-wrap">
								<div className="sm:flex-1 w-full">
									<div className="w-full h-auto relative my-text-box">
										<TextArea
											ref={inputTextAreaRef}
											style={{ border: "none", fontSize: textAreaFontSize, height: textAreaHeight, minHeight: isMobile ? '140px' : '360px' }}
											value={inputText}
											onChange={handleInputText}
											onKeyDown={handleEnterPress}
											placeholder={Locale.Translate.Input}
											// rows={textRow}
											maxLength={authData.tokenLimit}
										/>
										<div className="flex w-full justify-between px-2 py-1 flex-row-reverse items-end">
											<Space>
												<Button
													size="middle"
													style={{ fontSize: "13px" }}
													icon={isDetect && <SyncOutlined spin hidden={isDetect} />}
													type="primary"
													ghost
													onClick={() => handleDetect()}
												>
													{Locale.Translate.Detect}
												</Button>

												<Dropdown.Button
													arrow
													size="middle"
													type="primary"
													style={{ fontSize: "13px", opacity: "0.7" }}
													icon={isConnect ? <SyncOutlined spin /> : <CaretDownOutlined />}
													menu={{
														items,
														onClick: handleMenuClick,
													}}
													onClick={handleButtonClick}
												>
													<span className="px-2">{Locale.Translate.Start}</span>

												</Dropdown.Button>
											</Space>
											<Space>
												{inputText && isLoadInput && <SyncOutlined spin className="my-button my-icon" />}
												{inputText && !isLoadInput && <PlayCircleOutlined onClick={() => textToSpeech(inputText, 'input')} className="my-button my-icon" />}

												{inputText && <ClearOutlined onClick={handleClerText} className="my-button my-icon" />}
												{inputText && <span className="text-sm text-[#bbb]">{inputText.length} / {authData.tokenLimit}</span>}
											</Space>
										</div>

									</div>
								</div>

								<div className="sm:flex-1 w-full">
									<div className="w-full h-auto relative my-text-box bg-[#f5f5f5]">
										<TextArea
											ref={outputTextAreaRef}
											// value={outputText}
											value=''
											onChange={handleOutputText}
											placeholder=""
											rows={textRow}
											style={{ background: '#f5f5f5', border: "none", fontSize: textAreaFontSize, height: textAreaHeight, minHeight: isMobile ? '140px' : '360px' }}
											onClick={() => handleCopyText(outputText)}
										/>

										<div
											ref={outputMarkdownRef}
											className="absolute top-0 left-0 bottom-12 w-full p-2 rounded-sm"
											style={{ background: '#f5f5f5', border: "none", fontSize: textAreaFontSize, overflowY: 'scroll' }}
										>
											<ReactMarkdown remarkPlugins={[remarkBreaks]}>
												{outputText}
											</ReactMarkdown>
										</div>
										<div className="flex w-full justify-between p-2 flex-row-reverse ">
											<HistoryOutlined onClick={handleHistory} className="my-button my-icon" />

											<Space>
												{isConnect && actionType !== "left-to-left" ? (
													<Space className="" onClick={handleCancelFetch}>
														{/* <SyncOutlined spin style={{ color: "#7728f5", cursor: "pointer" }} /> */}
														<StopIcon className="my-button" />
													</Space>
												) : null}
												{!isConnect && outputText && isLoadOuput && <SyncOutlined spin className="my-button my-icon" />}
												{!isConnect && outputText && !isLoadOuput && <PlayCircleOutlined onClick={() => textToSpeech(outputText, 'output')} className="my-button my-icon" />}

												{!isConnect && outputText && <CopyOutlined onClick={() => handleCopyText(outputText)} className="my-button my-icon" />}
												{outputText && <span className="text-sm text-[#bbb]">{outputText.length}</span>}
											</Space>
										</div>

									</div>


								</div>

							</form>
						</div>

						<div className="fixed top-4 right-4">
							<LangMenu />
						</div>

						<>
							{contextHolder}
						</>
						<NotifyDrawer
							title={Locale.System.Title}
							data={notifyData}
							isOpen={isNotifyDrawerOpen}
							onClose={() => setIsNotifydrawerOpen(false)}
						/>
						<QuestionDrawer
							title={Locale.About.Title}
							data={authData}
							isOpen={isQuestionDrawerOpen}
							onClose={() => setIsQuestiondrawerOpen(false)}
						/>
						<HistoryDrawer
							title={Locale.History.Title}
							list={historyList}
							roles={DEFAULT_ROLES}
							isOpen={isHistoryDrawerOpen}
							onClose={() => setIsHistorydrawerOpen(false)}
							onClear={handleHistoryClear}
							onRollback={handleHistoryRollback}
							onDelete={handleHistoryDelete}
						/>

						<PromptDrawer
							title=""
							type={showType}
							item={defaultPrompt}
							list={[...promptList, ...DEFAULT_PROMPTS.slice(1, DEFAULT_PROMPTS.length)]}
							langs={languageList}
							isOpen={isPromptDrawerOpen}
							onTab={handleTabChange}
							onClose={() => setIsPromptdrawerOpen(false)}
							onAdd={handlePromptConfirm}
							onEdit={handlePromptEdit}
							onPublish={handlePromptPublish}
							onDelete={handlePromptDelete}
							onSelect={setSelectedPrompt}
							onCopy={handlePromptCopy}
							onData={GetPostsService}
						/>
						<PromptModal
							title={Locale.Prompt.Title}
							data={showPrompt}
							langs={languageList}
							isOpen={isPromptModalOpen}
							onClose={() => setIsPromptModalOpen(false)}
							onConfirm={handlePromptConfirm}
						/>
					</div >
					<Footer />
				</div>
			</StyleProvider>
		</AppContext.Provider>
	);
}
