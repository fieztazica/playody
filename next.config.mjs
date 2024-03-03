import million from 'million/compiler'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    httpAgentOptions: {
        keepAlive: true,
    },
}

const millionConfig = {
    auto: true, // if you're using RSC: auto: { rsc: true },
}

export default million.next(nextConfig, millionConfig);
