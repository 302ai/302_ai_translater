
OPENAI_API_URL = "https://api.302.ai/v1"
OPENAI_API_KEY = "sk-578751D64fD79951A8Ae03318f20kYc23alqHppgvevl43Fa"

question = "翻译图片里的文字"
// url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
// url = "https://raw.githubusercontent.com/ilssn/images/main/Screenshot%202024-01-29%20at%2019.09.47.png"
url = "https://raw.githubusercontent.com/ilssn/images/main/image.png"

const messages = [
  {
    "role": "user",
    "content": [
      { "type": "text", "text": question },
      {
        "type": "image_url",
        "image_url": {
          "url": url,
        },
      },
    ],
  }
]

const payload = {
  model: "gpt-4-vision-preview",
  stream: false,
  max_tokens: 300,
  messages: messages,
};

const requestHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

const main = async () => {
  const res = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    headers: requestHeaders,
    method: "POST",
    body: JSON.stringify(payload),
  });
  // console.log("res::", res)
  const result = await res.json()
  console.log("Q: ", question)
  console.log("A: ", result?.choices[0]?.message?.content || "")
}

// start
try {
  main()
} catch (error) {
  console.log("error:: ", error)

}
