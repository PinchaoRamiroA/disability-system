/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

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

module.exports = withBundleAnalyzer(nextConfig)
