import { Github } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Research', href: '#research' },
  { label: 'Dashboard', href: '/designer' },
  { label: 'API Docs', href: '/docs' },
  { label: 'GitHub', href: 'https://github.com/Jashudhar/MultiSow' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0A0F0A' }} className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: Logo */}
          <div>
            <span className="text-green-400 font-bold text-xl">
              🌿 MultiSow
            </span>
            <p className="text-neutral-500 text-sm mt-1">
              Intelligent Intercropping
            </p>
          </div>

          {/* Center: Nav Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-neutral-400 hover:text-green-400 transition-colors"
                {...(link.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: License + GitHub */}
          <div className="flex items-center justify-end gap-3">
            <span className="text-sm text-neutral-500">
              MIT Licensed • Open Source
            </span>
            <a
              href="https://github.com/Jashudhar/MultiSow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-green-400 transition-colors"
              aria-label="View MultiSow on GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-neutral-600">
            © 2026 MultiSow. Built for Indian farmers with ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}
