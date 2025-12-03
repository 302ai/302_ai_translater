import { Modal, Card, Select, Button, Popconfirm } from "antd";

import {
	ClearOutlined,
	CloseOutlined,
	RollbackOutlined,
} from "@ant-design/icons";
import { Role, History } from "@/app/translate/type";
import { useState, useEffect } from "react";
// Locales
import Locale from "../locales";

export default function HistoryDrawer(props: {
	title: string;
	list: History[];
	roles: Role[];
	isOpen: boolean;
	onClose: () => void;
	onClear: () => void;
	onRollback: (data: History) => void;
	onDelete: (data: History) => void;
}) {
	const [showList, setShowList] = useState<History[]>([]);
	const [showType, setShowType] = useState(0);

	// Handle filter
	const handleFilterChange = (value: number) => {
		setShowType(value);
	};

	// Init Data
	useEffect(() => {
		// 倒序
		let result = props.list.sort((a, b) => b.id - a.id);
		// 过滤
		if (showType) {
			result = result.filter((it) => it.role.id == showType);
		}
		// 设置
		setShowList(result);
	}, [props.list, showType]);

	return (
		<>
			<Modal
				title={props.title}
				open={props.isOpen}
				onCancel={props.onClose}
				footer={null}
				width={800}
			>
				<div className="flex w-full mt-2 justify-between items-center">
					<div className="flex space-x-2">
						<Select
							virtual={false}
							// showSearch
							// allowClear
							optionFilterProp="name"
							value={showType}
							style={{ width: 100 }}
							onChange={handleFilterChange}
							options={props.roles}
							fieldNames={{ label: "name", value: "id" }}
							placeholder={Locale.History.RecordType}
						/>
						<Popconfirm
							title={Locale.History.ClearAll}
							description={Locale.History.ClearAllSure}
							onConfirm={() => {
								props.onClear();
							}}
							okText={Locale.History.Clear}
							cancelText={Locale.History.NotNow}
							placement="bottom"
						>
							<Button
								// type="primary"
								size="middle"
								shape="circle"
								// ghost
								// danger
								icon={<ClearOutlined />}
							></Button>
						</Popconfirm>
					</div>
					<span className="text-sm text-[#bbb]">{Locale.History.ItemCount(showList.length)}</span>
				</div>
				<div className="mt-4 flex flex-wrap w-full h-[500px] sm:h-[600px] overflow-y-scroll my-scroll overflow-x-hidden">
					<div className="w-full space-y-4">
						{
							showList.map((it, index) => (
								<div key={index} className="flex w-full">
									<Card
										className="w-full bg-[#F7F7F9] cursor-pointer"
										actions={[
											<RollbackOutlined
												key="rollback"
												onClick={() => {
													props.onRollback(it);
												}}
											/>,
											<CloseOutlined
												key="delete"
												onClick={() => props.onDelete(it)}
											/>,
										]}
									>
										<Card.Meta
											avatar={
												<div
													style={{
														fontSize: "18px",
														color: "#7728f5",
													}}
												>
													{it.role.name}
												</div>
											}
											title={it.input}
											description={it.output}
										/>
									</Card>
								</div>
							))
						}
					</div>
				</div>
			</Modal>
		</>
	);
}
