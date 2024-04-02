/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    images: {
        unoptimized: true,
        domains: ['res.cloudinary.com', 'exclusive-ecommerce-client.vercel.app'],
    }
};

export default nextConfig;