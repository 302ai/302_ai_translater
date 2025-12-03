export const OpenaiChatService = async (
	systemRole: string,
	userInput: string
) => {
	// const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/openai/chat`, {
	// console.log('env:: ', process.env.NEXT_PUBLIC_KYEE)
	const response = await fetch("http://192.168.199.13:3002/openai/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			// for this example, we only cover for stream API,
			// we can also dyamically handle in the frontend to
			// enable both use cases
			stream: true,
			messages: [
				{ role: "system", content: systemRole },
				{ role: "user", content: userInput },
			],
		}),
	});

	return response.json();
};
