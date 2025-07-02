import { useLanguage } from "./LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <h2
            className="text-4xl md:text-5xl font-normal tracking-wider mb-0"
            style={{
              fontFamily: 'Old London, serif',
              letterSpacing: '0.08em',
              textShadow: '1px 1px 0 #222, 2px 2px 6px rgba(0,0,0,0.18)',
              lineHeight: 1.1,
            }}
          >
            Fearless
          </h2>
          {/* Social Links */}
          <div className="flex flex-row gap-6 mb-0 text-xl">
            <a
              href="https://instagram.com/fearlessgear.dz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="hover:text-white transition-colors flex items-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>
            </a>
            <a
              href="https://tiktok.com/@fearlessgear.dz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              title="TikTok"
              className="hover:text-white transition-colors flex items-center"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M41.5 17.5c-3.6 0-6.5-2.9-6.5-6.5V6h-6.5v25.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.5 0 1 .1 1.5.3v-6.6c-.5-.1-1-.1-1.5-.1-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10v-7.5c1.9 1.2 4.1 2 6.5 2v-6z" fill="white"/>
              </svg>
            </a>
          </div>
          {/* Footer Text */}
          <div className="pt-4 border-t border-gray-800 text-xs text-gray-500 w-full text-center tracking-wide">
            <p>&copy; 2024 Fearless. Designed in Algeria.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
