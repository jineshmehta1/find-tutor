/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/faq',
        destination: '/faqs',
        permanent: true,
      },
      {
        source: '/find-tutors',
        destination: '/find-tutor-nearby',
        permanent: true,
      },
      {
        source: '/find-coaches',
        destination: '/find-tutor-nearby?type=coach',
        permanent: true,
      },
      {
        source: '/how-it-works',
        destination: '/#how-it-works',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
