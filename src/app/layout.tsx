import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Locales
import Locale from "../locales";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: Locale.Title,
	description: "The AI Traslate Tool Powered By 302.AI",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta name="apple-mobile-web-app-capable" content="yes"></meta>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
				></meta>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							var _paq = window._paq = window._paq || [];
							/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
							_paq.push(['trackPageView']);
							_paq.push(['enableLinkTracking']);
							(function () {
								var u = "https://matomo.302.ai/";
								_paq.push(['setTrackerUrl', u + 'matomo.php']);
								_paq.push(['setSiteId', '3']);
								var d = document,
									g = d.createElement('script'),
									s = d.getElementsByTagName('script')[0];
								g.async = true;
								g.src = u + 'matomo.js';
								s.parentNode.insertBefore(g, s);
							})();
            `,
					}}
				/>

			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
