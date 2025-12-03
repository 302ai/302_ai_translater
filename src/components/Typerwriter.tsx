import React, { useState, useEffect } from "react";

function Typewriter(props: { serverUrl: string; isConnect: boolean, writeSpeed: number }) {
	const [textList, setTextList] = useState([""]);
	const [displayText, setDisplayText] = useState("");

	useEffect(() => {
		if (props.isConnect) {
			// 清空输入输出
			setTextList([""]);
			setDisplayText("");
			const eventSource = new EventSource(props.serverUrl);

			const listener = ({ data }: { data: string }) => {
				const resp = JSON.parse(data);
                console.log('resP: ', resp)
				if (resp?.delta?.content) {
					const item: string = resp?.delta?.content || "";
					setTextList((oldList: string[]) => [...oldList, item]);
				}
			};
			eventSource.addEventListener("chat.completion.chunk", listener);
			eventSource.onerror = (event) => {
				console.log(event);
				eventSource.removeEventListener(
					"chat.completion.chunk",
					listener
				);
				eventSource.close();
			};
			//清理函数，告诉React在组件卸载及更新时取消事件流
			return () => {
				eventSource.close();
			};
		}
	}, [props.serverUrl, props.isConnect]);

	// 逐个展示每条消息，然后从列表中删除它
	useEffect(() => {
		const intervalId = setInterval(() => {
			if (textList.length) {
				const newMessage = textList[0];
				setTextList((oldList) => oldList.slice(1));
				setDisplayText((oldText) => oldText + newMessage);
			}
		}, props.writeSpeed);

		return () => {
			clearInterval(intervalId);
		};
	}, [textList, props.writeSpeed]);

	return (
		<p className="w-full sm:max-w-md whitespace-pre-wrap">{displayText}</p>
	);
}

export default Typewriter;
