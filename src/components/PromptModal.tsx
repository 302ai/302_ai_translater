import { Modal, Form, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { Prompt, Language } from "@/app/translate/type";
import {
	ArrowRightOutlined,
} from "@ant-design/icons";
// Locales
import Locale from "../locales";

const DEFAULT_ORIGIN_LANGUAGE: Language = {
	id: 0,
	name: Locale.Prompt?.IsAuto,
	symbol: "",
}
const DEFAULT_TARGET_LANGUAGE: Language = {
	id: 0,
	name: Locale.Prompt?.IsAuto,
	symbol: "",
}

export default function PromptModal(props: {
	title: string;
	data: Prompt;
	langs: Language[];
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (data: Prompt) => void;
}) {
	const [showTitle, setShowTitle] = useState("");
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		if (props.data.id) {
			setShowTitle(`${Locale.System.Modify} ${props.title}`);
		} else {
			setShowTitle(`${Locale.System.Add} ${props.title}`);
		}
		form.resetFields();
		form.setFieldsValue(props.data);
	}, [props.title, props.data, form]);

	const handleOk = async () => {
		if (props.data.id && props.data.id <= 5) {
			props.onClose()
			return
		}
		setConfirmLoading(true);
		form
			.validateFields()
			.then((values) => {
				props.onConfirm(values);
				props.onClose();
			})
			.catch((info) => { });
		setConfirmLoading(false);
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
				cancelText={Locale.System.Cancel}
				okText={Locale.System.Confirm}
			>
				<Form form={form} name="prompt-form">
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
						<div
							className="w-full flex justify-between items-start"
						>

							<Form.Item
								name="origin"
							>
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
				</Form>
			</Modal >
		</>
	);
}
