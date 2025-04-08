import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    env: {
        NEXT_PUBLIC_PORT: "3001",  // Make sure it's a string, not a number
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost', // Allow localhost
                port: '4000',          // Specify the port your server uses
                pathname: '/uploads/**', // Match all images in the /uploads directory
            },
            {
                protocol: 'http',
                hostname: 'localhost', // Allow localhost
                port: '3000',          // Specify the port your server uses
                pathname: '/uploads/**', // Match all images in the /uploads directory
            },
            {
                protocol: 'https',
                hostname: 'gwpapi.kontic.xyz',
                pathname: '/uploads/**', // Match all images in the uploads directory
            },
            {
                protocol: 'https',
                hostname: 'api.globalwaterpolo.com',
                pathname: '/uploads/**', // Match all images in the uploads directory
            }
        ],
    },
};

export default nextConfig;
