/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    api: {
        responseLimit: false,
        bodyParser: false,
    },
}

module.exports = nextConfig
