import SearchInput from "@/components/SearchInput";
import './page.css'

export default function Chat() {
	return (
		<main className="flex flex-col min-h-screen items-center p-8 bg-[#f1f1f1]">
			<h1 className="text-lg">OpenAI Chat</h1>

			<SearchInput />
		</main>
	);
}
