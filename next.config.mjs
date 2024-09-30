/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
            },
            {
                protocol: 'https',
                hostname: 'mosaic.scdn.co',
            },
            {
                protocol: 'https',
                hostname: 'wrapped-images.spotifycdn.com',
            },
            {
                protocol: 'https',
                hostname: 'developers.elementor.com',
            },
            {
                protocol: 'https',
                hostname: 'image-cdn-ak.spotifycdn.com',
            },
            {
                protocol: 'https',
                hostname: 'seed-mix-image.spotifycdn.com',
            },
            {
                protocol: 'https',
                hostname: 'image-cdn-fa.spotifycdn.com',
            },
        ],
    },
};

export default nextConfig;
