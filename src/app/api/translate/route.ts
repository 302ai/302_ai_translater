import {
	ChatGPTMessage,
	OpenAIStream,
	OpenAIStreamPayload,
} from "../../../../utils/OpenAiStream";

// export const config = {
// 	runtime: "edge",
// };

export const runtime = "edge";

// get
export const GET = (req: Request) => {
	return new Response("Get translate success!");
};

// post
export const POST = async (req: Request): Promise<Response> => {
	try {
		const body = await req.json();

		const messages: ChatGPTMessage[] = [];
		messages.push(...body?.messages);

		// const requestHeaders: Record<string, string> = {
		// 	"Content-Type": "application/json",
		// 	Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		// };

		// if (process.env.OPENAI_API_ORG) {
		// 	requestHeaders["OpenAI-Organization"] = process.env.OPENAI_API_ORG;
		// }

		const payload: OpenAIStreamPayload = {
			model: process.env.OPENAI_API_MODEL || "gpt-4",
			messages: messages,
			temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
			max_tokens: process.env.AI_MAX_TOKENS
				? parseInt(process.env.AI_MAX_TOKENS)
				: 1000,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			stream: true,
			// stream: false,
			user: body?.user,
			n: 1,
		};


		const stream = await OpenAIStream(payload);
		return new Response(stream);
	} catch (error) {
		return new Response(JSON.stringify({ message: "Error" }), {
			status: 500,
			statusText: "Get Stream Error",
			headers: { "Content-Type": "application/json" },
		});
	}
};
