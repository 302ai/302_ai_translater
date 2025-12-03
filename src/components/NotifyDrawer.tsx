import React, { useContext } from 'react';
import AppContext from '../store';
import { Modal } from "antd";
// Locales
import Locale from "../locales";

export default function PromptDrawer(props: {
	title: string;
	data: { title: string, desc: string };
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
				width={480}
			>
				<div className="mt-2 flex w-full">
				</div>
				{/* <div className="flex w-full justify-between flex-row items-center"> */}
					{/* <span className="text-sm text-[#bbb]">{Locale.System.BalanceOut}</span> */}
				{/* </div> */}
				<div className="mt-4 flex w-full overflow-y-scroll">
					<div className="w-full">
						<p>
							{props.data.desc}
						</p>
						<span>
							{Locale.System.Visit}
						</span>
						<a className="text-primary, underline" href={globalState.domain} target="_blank"> 302.AI </a>
						<span>
							{Locale.System.Create}
						</span>
					</div>
				</div>

			</Modal >
		</>
	);
}
