import {
	Modal,
	Button,
	List,
	Popconfirm,
	Tabs,
	TabsProps,
	Input,
	message,
	Divider,
	Form,
	Select,
} from "antd";
import {
	EditOutlined,
	CloseOutlined,
	ShareAltOutlined,
	SearchOutlined,
	RobotOutlined,
	ArrowRightOutlined

} from "@ant-design/icons";
import { Prompt, Language } from "@/app/translate/type";
import { useState, useEffect } from "react";
import '../app/globals.css'
// Locales
import Locale from "../locales";

const DEFAULT_ORIGIN_LANGUAGE: Language = {
	id: 0,
	name: Locale.Prompt.IsAuto,
	symbol: "",
}
const DEFAULT_TARGET_LANGUAGE: Language = {
	id: 0,
	name: Locale.Prompt.IsAuto,
	symbol: "",
}

export default function PromptDrawer(props: {
	title: string;
	type: string;
	list: Prompt[];
	item: Prompt,
	langs: Language[];
	isOpen: boolean;
	onTab: (tab: string) => void;
	onClose: () => void;
	onAdd: (data: Prompt) => void;
	onEdit: (data: Prompt) => void;
	onPublish: (data: Prompt) => void;
	onDelete: (data: Prompt) => void;
	onSelect: (data: Prompt) => void;
	onCopy: (data: Prompt) => Promise<any>
	onData: (data: any) => Promise<any>;
}) {
	const [messageApi, contextHolder] = message.useMessage();
	const [searText, setSearchText] = useState('')
	const [showPublishList, setShowPublishList] = useState<Prompt[]>([]);
	const [open, setOpen] = useState(false);
	const [copyItem, setCopyItem] = useState<Prompt>({
		id: 0,
		like: 0,
		status: 1,
		agent: 'user',
		author: '',
		name: '',
		content: '',
		origin: '',
		target: '',
	});

	const [confirmLoading, setConfirmLoading] = useState(false);

	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	})

	// user form
	const [form] = Form.useForm();

	// search
	const onSearchChange = (e: any) => {
		setSearchText(e.target.value);
		handleOnData(e.target.value);
	};


	// 获取列表
	const handleOnData = async (value: string = '') => {
		try {
			setPagination({
				current: 1,
				pageSize: 10,
				total: 0,
			})
			// setShowPublishList([])
			const { list, count } = await props.onData({ page: 1, filter: value, status: 2 });
			// if (!list.length) {
			// 	messageApi.warning('暂无数据, 敬请期待！')
			// }
			setShowPublishList(list)
			setPagination((preData) => {
				return { ...preData, total: count }
			})
		} catch (error) {
			messageApi.warning(Locale.Error.NetworkError)
		}
	}

	// 加载更多
	const handleOnMore = async () => {
		try {
			const { list, count } = await props.onData({ page: pagination.current + 1, filter: searText, status: 2 });
			// if (!list.length) {
			// 	messageApi.warning('已加载全部数据, 敬请等待更新！')
			// }
			setShowPublishList((preList) => [...preList, ...list])
			setPagination((preData) => {
				return { ...preData, current: preData.current + 1, total: count }
			})
		} catch (error) {
			messageApi.warning(Locale.Error.NetworkError)
		}
	}

	// 处理回车
	const handleEnterPress = (event: any) => {
		// shift+enter不处理
		// if (!event.shiftKey && event.key === "Enter") {
		// if (!event.shiftKey && event.keyCode === 13) {
		// event.preventDefault(); // 阻止默认行为比如换行
		form
			.validateFields()
			.then((values) => {
				props.onAdd(values);
				form.resetFields();
				setTimeout(() => {
					props.onTab('');
					props.onClose();
				}, 100)
			})
			.catch((info) => { });

		// }
	};

	const showCopyPopconfirm = (data: any) => {
		setCopyItem(data);
		setOpen(true);
	};

	const handleCopyOk = async () => {
		setConfirmLoading(true);
		await props.onCopy(copyItem);
		setConfirmLoading(false);
		setOpen(false);
		setTimeout(() => {
			props.onTab('');
			props.onClose();
		}, 100)

	};

	const handleCopyCancel = () => {
		setOpen(false);
	};



	const items: TabsProps['items'] = [
		{
			key: 'Add',
			label: <div className="">{Locale.Prompt.ToAdd}</div>,
			// children: '',
		},
		{
			key: 'Edit',
			label: Locale.Prompt.ToManage,
			// children: '',
		},
	];

	// 重置表单
	useEffect(() => {
		// handleOnData(searText);
		form.resetFields();
		form.setFieldsValue(props.item);
	},);

	// 刷新数据
	useEffect(() => {
		if (props.type === 'Add') {
			handleOnData(searText);
		}
	}, [props.type, props.list.length]);

	return (
		<>
			<Modal
				// title={props.title}
				title=''
				open={props.isOpen}
				onCancel={
					() => {
						setOpen(false);
						setTimeout(() => {
							props.onTab('');
							props.onClose();
						}, 50)
					}
				}
				footer={null}
				width={800}
			>
				<Tabs type="card"
					activeKey={props.type}
					items={items}
					onChange={(it) => {
						setOpen(false);
						props.onTab(it);
					}}
				/>
				{
					props.type === 'Edit'
						? (
							<div className="local w-full">
								<div className="mt-0 flex w-full h-[600px] sm:h-[700px] overflow-y-scroll">
									<List
										className="demo-loadmore-list w-full"
										itemLayout="horizontal"
										dataSource={props.list}
										renderItem={(it, index) => (
											<List.Item
												className=""
											>
												<div
													className="w-full px-2"
												>
													<List.Item.Meta
														avatar={<RobotOutlined className="text-xl mt-1 mycolor-primary" />}
														title={it.name}
														description={`${it.content.slice(0, 140)}${it.content.length > 140 ? '...' : ''}`}
													/>
													{
														it.agent === 'user' ? (
															<div className="flex justify-end space-x-4 space-y-0 items-center px-2">

																<Popconfirm
																	onPopupClick={(e) => e.stopPropagation()}
																	key="delete"
																	title={Locale.Prompt.ToDel}
																	description={Locale.Prompt.ToDelSure}
																	onConfirm={(e) => {
																		props.onDelete(it);
																	}}
																	okText={Locale.System.Delete}
																	cancelText={Locale.System.NotNow}
																	placement="top"
																>
																	<CloseOutlined
																		className="text-bold text-lg mycolor-danger"
																		onClick={(e) => e.stopPropagation()}
																	/>
																</Popconfirm>

																<EditOutlined
																	className="text-lg mycolor-primary"
																	key="edit"
																	onClick={(e) => {
																		e.stopPropagation()
																		props.onEdit(it);
																	}}
																/>

																<Popconfirm
																	onPopupClick={(e) => e.stopPropagation()}
																	key="share"
																	title={Locale.Share.Start}
																	description={<p className="w-[250px]">{Locale.Share.Review}</p>}
																	onConfirm={(e) => {
																		props.onPublish(it);
																	}}
																	okText={Locale.System.Confirm}
																	cancelText={Locale.System.Cancel}
																	placement="top"
																>
																	<ShareAltOutlined
																		className="text-lg mycolor-success"
																		onClick={(e) => e.stopPropagation()}
																	/>
																</Popconfirm>
															</div>
														) : null
													}


												</div>
											</List.Item>

										)}
									/>
								</div>
							</div>
						)
						: (
							<div className="local w-full">
								<div className="mt-1 flex w-full">
									<div className="w-full">
										<Form form={form} name="add-prompt-form">
											<Form.Item name="id" hidden>
												<Input />
											</Form.Item>

											<Form.Item name="like" hidden>
												<Input />
											</Form.Item>

											<Form.Item name="status" hidden>
												<Input />
											</Form.Item>

											<Form.Item name="agent" hidden>
												<Input />
											</Form.Item>

											<Form.Item name="author" hidden>
												<Input />
											</Form.Item>



											<Form.Item
												name="name"
												label={Locale.Prompt.Name}
												rules={[
													{
														required: true,
														message: Locale.Prompt.NameRequire
													},
													{
														pattern: /\S+/,
														message: Locale.Prompt.NameValid,
													},
												]}
											>
												<Input placeholder={Locale.Prompt.NamePlaceholder} maxLength={20} />
											</Form.Item>

											<Form.Item
												name="content"
												label={Locale.Prompt.Content}
												rules={[
													{
														required: true,
														message: Locale.Prompt.ContentRequire
													},
													{
														pattern: /\S+/,
														message: Locale.Prompt.ContentValid,
													},
												]}
											>
												<Input.TextArea
													rows={5}
													placeholder={Locale.Prompt.ContentPlaceholder}
												/>
											</Form.Item>
											<Form.Item
												label={<span className="ml-2">{Locale.Prompt.Language}</span>}
											>
												<div className="w-full flex justify-between items-start">
													<Form.Item name="origin">
														<Select
															size="middle"
															virtual={false}
															showSearch
															optionFilterProp="name"
															variant="borderless"
															style={{ width: 100 }}
															popupMatchSelectWidth={false}
															options={[DEFAULT_ORIGIN_LANGUAGE, ...props.langs]}
															fieldNames={{ label: "name", value: "symbol" }}
															placeholder={Locale.Prompt.Origin}
														/>
													</Form.Item>

													<ArrowRightOutlined
														className="myicon-samll mt-2 opacity-50"
													/>

													<Form.Item name="target">
														<Select
															size="middle"
															virtual={false}
															showSearch
															optionFilterProp="name"
															variant="borderless"
															style={{ width: 100 }}
															popupMatchSelectWidth={false}
															options={[DEFAULT_TARGET_LANGUAGE, ...props.langs]}
															fieldNames={{ label: "name", value: "symbol" }}
															placeholder={Locale.Prompt.Target}
														/>
													</Form.Item>
												</div>
											</Form.Item>

											<div className="flex justify-end">
												<Button
													type="primary"
													onClick={handleEnterPress}
												>
													{Locale.System.Confirm}
												</Button>

											</div>
										</Form>
									</div>
								</div>
								<Divider />
								<div className="text-center w-full ">{Locale.Share.Title}</div>
								<div className="mt-1 flex w-full">
									<div className="flex w-full justify-between flex-row items-center">
										<Input
											className="w-full"
											style={{ width: '100%' }}
											placeholder={Locale.Share.Search}
											suffix={<SearchOutlined />}
											allowClear
											onChange={(e) => onSearchChange(e)}
											value={searText}
										// onPressEnter={() => handleOnData()}
										/>
										{/* <span className="text-sm text-[#bbb]">共{showPublishList.length}项翻译要求</span> */}
									</div>
								</div>
								<Popconfirm
									className="w-full"
									open={open}
									onPopupClick={(e) => e.stopPropagation()}
									okButtonProps={{ loading: confirmLoading }}
									key="copy"
									title={Locale.Prompt.ToAdd}
									description={`${Locale.Prompt.ToAddSure}[${copyItem.name}]?`}
									onConfirm={handleCopyOk}
									onCancel={handleCopyCancel}
									okText={Locale.System.Confirm}
									cancelText={Locale.System.Cancel}
									placement="top"
								>
									<div className="mt-2 flex w-full h-[300px] sm:h-[360px] overflow-y-scroll">
										{
											showPublishList.length ? (
												<div className="w-full">

													<div className="w-full space-y-2 flex flex-wrap justify-start">
														{
															showPublishList.map((it, index) => (
																<div key={index} className="w-full" >
																	<div
																		style={{
																			width: "100%"
																		}}
																		className="w-full bg-[#F7F7F9] cursor-pointer hover:bg-[rgba(119,40,245,0.08)] px-4 py-1 border-[1px] border-solid border-[#d9d9d9] rounded-md"
																		onClick={() => showCopyPopconfirm(it)}
																	>
																		<div className="w-full">
																			<div className="text-[14px] text-bold text-[##101010]">{it.name}</div>
																			<div className="text-[14px] text-[#9A9A9A]">{`${it.content.slice(0, 140)}${it.content.length > 140 ? '...' : ''}`}</div>
																		</div>
																		<div className="action w-full flex justify-end mt-2 space-x-4">


																			<div
																				className="txt-xl"
																				key="start"

																			>
																				<div className="flex items-center space-x-1 text-[#7728f5]">
																					{/* <StarOutlined
																						className="text-md"
																					/> */}
																					{/* <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3249" width="16" height="16"><path d="M442.514286 73.142857c82.529524 64.24381 140.239238 126.610286 173.129143 187.099429 31.158857 57.295238 43.666286 115.907048 37.546666 175.835428l-1.219047 9.996191 6.095238-4.973715a174.055619 174.055619 0 0 0 49.249524-69.607619l2.681904-7.411809 7.704381-23.04c82.285714 55.734857 123.440762 150.064762 123.440762 283.062857C841.142857 823.515429 665.795048 950.857143 521.654857 950.857143c-144.11581 0-308.224-85.333333-334.750476-263.875048-26.550857-178.541714 83.480381-261.90019 158.427429-378.197333C395.288381 231.253333 427.690667 152.697905 442.514286 73.142857z m33.718857 154.575238c-17.554286 41.447619-39.424 82.407619-65.536 122.904381l-8.313905 12.653714c-8.411429 12.507429-17.310476 24.941714-28.818286 40.374858l-40.96 54.467047c-63.634286 86.869333-80.944762 136.021333-68.851809 217.526857 17.92 120.441905 128.341333 197.778286 257.901714 197.778286 120.905143 0 241.785905-110.933333 241.785905-249.344 0-61.976381-9.825524-111.323429-29.110857-149.699048-8.240762 9.411048-17.237333 18.285714-26.965334 26.59962l-159.085714 130.023619 26.697143-195.364572c6.41219-46.811429-2.462476-92.208762-27.648-138.483809-13.214476-24.30781-31.98781-49.737143-56.368762-76.166096l-8.338286-8.850285-6.387809 15.579428z" p-id="3250" fill="#7728f5"></path></svg> */}
																					<span className="tex-md ">{it.like}</span>
																					<svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3852" id="mx_n_1714385733003" width="16" height="16"><path d="M748.739048 352.865524c-32.743619-40.496762-29.915429 86.893714-68.169143 67.462095-38.253714-19.431619-27.087238-285.891048-259.169524-354.230857-92.769524-27.306667 36.766476 218.35581-104.374857 331.751619-141.165714 113.371429-340.845714 359.765333 113.615238 562.151619 0 0-235.398095-269.409524 68.144762-427.227429 69.632-36.205714-22.723048 89.941333 90.89219 179.882667 113.615238 89.965714 0 247.344762 0 247.344762s516.291048-165.059048 159.061334-607.134476z" p-id="3853" fill="#7728f5"></path></svg>

																				</div>
																			</div>
																			{/* <PlusOutlined
																		key="copy"
																		className="text-[#7728f5]"
																		onClick={(e) => {
																			e.stopPropagation()
																			props.onCopy(it);
																			setShowType('personal')
																		}}
																	/> */}
																		</div>

																	</div>
																</div>
															))
														}
													</div>
													{
														showPublishList.length < pagination.total ? (
															<div className="load-more w-full py-2">
																<Button
																	className="w-full"
																	onClick={() => handleOnMore()}
																>
																	{Locale.Share.More}
																</Button>
															</div>

														) : (
															<div className="no-more mt-2 w-full tex-sm text-center text-[#bbb]">
																{Locale.Share.All}
															</div>

														)

													}
												</div>
											) : <div className="w-full felx justify-center mt-16 text-center text-[#dedede]">{Locale.Share.Empty}</div>
										}

									</div>
								</Popconfirm>
							</div>
						)

				}
			</Modal >
			<>
				{contextHolder}
			</>
		</>
	);
}
