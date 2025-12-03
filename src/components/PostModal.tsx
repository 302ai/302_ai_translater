import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useState, useEffect } from "react";
import { IPrompt, ILanguage } from "@/app/G5mSg9DW6c4h/type";
import { DEFAULT_LANGUAGES } from "@/app/translate/constant";
import {
	ArrowRightOutlined,
} from "@ant-design/icons";

const DEFAULT_ORIGIN_LANGUAGE: ILanguage = {
	id: 0,
	name: "自动",
	symbol: "",
}
const DEFAULT_TARGET_LANGUAGE: ILanguage = {
	id: 0,
	name: "自动",
	symbol: "",
}

export default function PostModal(props: {
	title: string;
	data: IPrompt;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (data: IPrompt) => void;
}) {
	const [showTitle, setShowTitle] = useState("");
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		if (props.data.id) {
			setShowTitle(`修改${props.title}`);
		} else {
			setShowTitle(`增加${props.title}`);
		}
		form.resetFields();
		form.setFieldsValue(props.data);
	}, [props.title, props.data, form]);

	const handleOk = async () => {
		setConfirmLoading(true);
		form
			.validateFields()
			.then((values) => {
				props.onConfirm(values);
				props.onClose();
			})
			.catch((info) => { });
		setTimeout(() => {
			setConfirmLoading(false);

		}, 1000)
	};

	return (
		<>
			<Modal
				zIndex={2000}
				title={showTitle}
				open={props.isOpen}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={props.onClose}
				cancelText="取消"
				okText="确认"
			>
				<Form form={form} name="post-form">
					<Form.Item name="id" hidden>
						<Input />
					</Form.Item>

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
								options={[DEFAULT_ORIGIN_LANGUAGE, ...DEFAULT_LANGUAGES]}
								fieldNames={{ label: "name", value: "symbol" }}
								placeholder="来源"
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
								options={[DEFAULT_TARGET_LANGUAGE, ...DEFAULT_LANGUAGES]}
								fieldNames={{ label: "name", value: "symbol" }}
								placeholder="目标"
							/>
						</Form.Item>
					</div>

					<Form.Item
						name="like"
						label="热度"
						rules={[{ required: true, message: "请输入热度整数!" }]}
					>
						<InputNumber min={0} />
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
						label="标题"
						rules={[{ required: true, message: "请输入标题!" }]}
					>
						<Input placeholder="输入标题便于查找" maxLength={20} />
					</Form.Item>
					<Form.Item
						name="content"
						label="要求"
						rules={[{ required: true, message: "请输入要求!" }]}
					>
						<Input.TextArea rows={5} placeholder="输入具体要求,比如：请用最简单的单词翻译" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
