export const runtime = "edge";

// get
export const POST = async (req: Request) => {
	const body = await req.json();
	const url =
		`https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GOOGLE_API_KEY}`;
	const headers = new Headers({
		"Content-Type": "application/json",
		Accept: "application/json",
	});

	const fetchOptions: RequestInit = {
		method: "POST",
		headers: headers,
		body: JSON.stringify(body),
	};

	return fetch(url, fetchOptions)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw new Error(`Server responded with status ${res.status}`);
			}
		})
		.then((data) => {
			if (
				data.data &&
				data.data.detections &&
				data.data.detections.length > 0
			) {
				const symbol = data.data.detections[0][0].language.split("-")[0];
				return new Response(JSON.stringify({ symbol: symbol }));
			} else {
				throw new Error("Cannot detect language");
			}
		})
		.catch((error) => {
			return new Response(JSON.stringify({ message: "Error" }), {
				status: 500,
				statusText: "Detect Language Error",
				headers: { "Content-Type": "application/json" },
			});
		});
};
