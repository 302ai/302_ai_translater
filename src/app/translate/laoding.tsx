import { LoadingOutlined } from "@ant-design/icons";
export default function PageLoading() {
	return (
		<div id="translator-loading" className="flex-1 flex justify-center items-center">
		 	<LoadingOutlined spin/>
		</div>
	);
}
