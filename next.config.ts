import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "25mb", 
		},
	},
	cacheComponents: true,
};

export default nextConfig;
