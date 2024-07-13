/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.yandex.net',
            },
            {
                protocol: 'https',
                hostname: 'sun6-20.userapi.com',
            },
            {
                protocol: 'https',
                hostname: 'sun6-23.userapi.com',
            },
        ],
    }
};


export default nextConfig;
