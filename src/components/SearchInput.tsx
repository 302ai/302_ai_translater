"use client";

import { ChangeEvent, useState } from "react";
import { OpenaiChatService } from "@/services/chat";
import Typewriter from "./Typerwriter";
import { SystemRole } from "./interface";

const SERVER_URL = "http://localhost:3002/openai/chat-streams";
const SERVER_ROLE: SystemRole = {
	default: "",
	tranlsate: "你是一位专业的翻译，请将我接下来输入的文字翻译为英文",
	summary: "你是AI助手，主要功能是将用户的输入概括总结为更加简练的文字",
	factory:
		"你是一位资深小说作家，请使用用户输入的主角名称,性别写一篇800字的玄幻小说",
};

export default function SearchInput() {
	const [input, setInput] = useState("");
	const [isConnect, setIsConnect] = useState(false);

	const mathRole = (role: string) => {
		switch (role) {
			case "translate":
				return SERVER_ROLE.tranlsate;
			case "summary":
				return SERVER_ROLE.summary;
			case "factory":
				return SERVER_ROLE.factory;
			default:
				return SERVER_ROLE.default;
		}
	};

	const onChangeInputHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value);
	};

	const onClickButtonHandler = async (role: string) => {
		const selectRole = mathRole(role);
		setIsConnect(true);

		try {
			const result = await OpenaiChatService(
				// SERVER_ROLE.translater,
				selectRole,
				input
			);
		} catch (error) {
			console.log(error);
		}
		setIsConnect(false);
	};

	return (
		<>
			<textarea
				className="w-full sm:max-w-md p-2 my-4 border rounded-lg"
				id="input"
				name="input-openai"
				rows={6}
				onChange={onChangeInputHandler}
				value={input}
			/>

			<button
				className={`
          py-2 w-full sm:max-w-md rounded-md
          bg-blue-500 disabled:bg-gray-200 text-white hover:shadow-md
          hover:brightness-105 transition-shadow`}
				disabled={isConnect}
				onClick={() => onClickButtonHandler("")}
			>
				Submit
			</button>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<button
					style={{ display: "inline-block", padding: "10px" }}
					disabled={isConnect}
					onClick={() => onClickButtonHandler("translate")}
				>
					翻译
				</button>
				<button
					style={{ display: "inline-block", padding: "10px" }}
					disabled={isConnect}
					onClick={() => onClickButtonHandler("summary")}
				>
					汇总
				</button>
				<button
					style={{ display: "inline-block", padding: "10px" }}
					disabled={isConnect}
					onClick={() => onClickButtonHandler("factory")}
				>
					小说
				</button>
			</div>

			<h2 className="pt-8 pb-4 text-lg">Generated OpenAI Chat Response</h2>

			<Typewriter
				serverUrl={SERVER_URL}
				isConnect={isConnect}
				writeSpeed={20}
			/>
		</>
	);
}
