/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	devIndicators: {
		buildActivity: false,
	},
	async redirects() {
		return [
			{
				source: '/about',
				destination: '/',
				permanent: true,
			},
		]
	},
}

module.exports = nextConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({})
