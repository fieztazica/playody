/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    httpAgentOptions: {
        keepAlive: true,
    },
}

module.exports = nextConfig
