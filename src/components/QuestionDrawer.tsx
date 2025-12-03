import React, { useContext } from 'react';
import AppContext from '../store';
import { Modal } from "antd";
import { TAuthData } from "@/app/translate/type";
// Locales
import Locale from "../locales";

export default function PromptDrawer(props: {
	title: string;
	data: TAuthData;
	isOpen: boolean;
	onClose: () => void;
}) {

	const globalState = useContext(AppContext);
	return (
		<>
			<Modal
				title={props.title}
				open={props.isOpen}
				onCancel={props.onClose}
				footer={null}
				width={800}
			>
				<div className="mt-2 flex w-full">
				</div>
				<div className="flex w-full justify-between flex-row items-center">
					<span className="text-sm text-[#bbb]">{Locale.About.Name}</span>
				</div>
				<div className="text-sm" dangerouslySetInnerHTML={{ __html: props.data.info, }}></div>
			</Modal >
		</>
	);
}
