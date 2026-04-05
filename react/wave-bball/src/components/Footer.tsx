import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import Logo from '../assets/logo.jpg';

const footerLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/wave.basketball/", label: "Instagram" },
    { icon: Twitter, href: "https://www.twitter.com/@wave_bball", label: "Twitter" },
    { icon: Youtube, href: "https://www.youtube.com/@Wave_Basketball", label: "YouTube" },
    { icon: Mail, href: "mailto:joshualim@wavebasketball.net", label: "Email" },
];

const SiteFooter = () => (
    <footer className="border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-10 sm:gap-12 mb-12 sm:mb-16">
                {/* Brand */}
                <div className="space-y-3 max-w-xs">
                    <a href="/" className="flex items-center gap-2.5">
                        <img src={Logo} alt="Wave Basketball" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-1 ring-white/10" />
                        <span className="font-bold text-sm sm:text-base text-white tracking-tight">WAVE</span>
                    </a>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        Elite player development in San Francisco. Building better players and better people.
                    </p>
                </div>

                {/* Links */}
                <div className="flex gap-12 sm:gap-16">
                    <div>
                        <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3 sm:mb-4">Navigate</h4>
                        <ul className="space-y-2.5 sm:space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3 sm:mb-4">Connect</h4>
                        <ul className="space-y-2.5 sm:space-y-3">
                            {socialLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target={link.href.startsWith('http') ? '_blank' : undefined}
                                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-2"
                                    >
                                        <link.icon className="w-3.5 h-3.5" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 sm:pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <p className="text-[11px] sm:text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} Wave Basketball. All rights reserved.
                </p>
                <p className="text-[11px] sm:text-xs text-gray-600">
                    San Francisco, CA
                </p>
            </div>
        </div>
    </footer>
);

export default SiteFooter;
