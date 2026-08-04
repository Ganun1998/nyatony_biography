import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-bg px-4">
      <div className="text-center">
        <div className="font-playfair text-[120px] font-bold leading-none" style={{ color: 'rgba(201,162,39,0.2)' }}>
          404
        </div>
        <h1 className="font-playfair text-3xl font-bold text-text dark:text-white mt-4 mb-3">
          Page Not Found
        </h1>
        <p className="font-inter text-text-muted dark:text-gray-400 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  )
}
