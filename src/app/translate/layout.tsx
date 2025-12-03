import { Button, ConfigProvider, Space } from 'antd';
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import "./page.css";

export default function TranslaterLayout(props: { children: any }) {
	return (
		<ConfigProvider
			theme={{
				"token": {
					"colorPrimary": "#7728f5",
					"colorInfo": "#7728f5",
				}
			}}
		>
			<div
				id="translator-layout"
				className=' relative flex h-screen flex-col sm:p-12 bg-[#f5f5f5] h-100vh w-full'>
				{/* <Header /> */}
				{props.children}
				{/* <Footer /> */}
			</div>
		</ConfigProvider>

	);
}
