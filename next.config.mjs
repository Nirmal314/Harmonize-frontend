/** @type {import('next').NextConfig} */
const nextConfig = {
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
        ],
    },
};

export default nextConfig;
