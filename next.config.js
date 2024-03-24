/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    images : {
        domains : ['aajnkuyxbtupfkhcnztm.supabase.co']
    }
}

module.exports = nextConfig
