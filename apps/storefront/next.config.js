/** @type {import('next').NextConfig} */

module.exports = {
    transpilePackages: ['@sakura/database', '@persepolis/mail', '@persepolis/regex', '@persepolis/slugify', '@persepolis/rng', '@persepolis/sms'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/product',
                destination: '/products',
                permanent: true,
            },
        ]
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}
