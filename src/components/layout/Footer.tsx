import { Github, Linkedin, Instagram, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LogoMark } from '../ui/Primitives'; 

export function WaveDivider() {
  return (
    <svg viewBox="0 0 1440 72" className="w-full block h-12 sm:h-16 -mb-px text-secondary" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill="currentColor"
        transform="translate(0 72) scale(1 -1)"
        d="M0,48 C240,72 480,24 720,48 C960,72 1200,24 1440,52 L1440,0 L0,0 Z"
      />
    </svg>
  );
}

interface Props {
  onShowImprint: () => void;
}

export default function Footer({ onShowImprint }: Props) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <WaveDivider />
      <footer className="bg-secondary text-white relative" role="contentinfo">
        <div className="max-w-4xl mx-auto px-4 pt-2 pb-10">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="hover:scale-105 transition-transform">
              <LogoMark size="large" />
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-lg font-bold font-body">Train Doggo</h2>
              <p className="text-xs sm:text-sm text-white/80 font-body leading-relaxed">
                {t('footer.text')}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a href="https://instagram.com/traindoggo" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-highlight text-secondary transition-all hover:scale-105">
                <Instagram size={22} strokeWidth={2} />
              </a>
              <a href="https://github.com/kevinklaus/traindoggo" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-highlight text-secondary transition-all hover:scale-105">
                <Github size={22} strokeWidth={2} />
              </a>
              <a href="https://kevinklaus.github.io" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-highlight text-secondary transition-all hover:scale-105">
                <Globe size={22} strokeWidth={2} />
              </a>
              {/* <a href="mailto:kevintheklaus@gmail.com" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-highlight text-secondary transition-all hover:scale-105">
                <Mail size={22} strokeWidth={2} />
              </a> */}
              <a href="https://www.linkedin.com/in/kevinklaus" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-highlight text-secondary transition-all hover:scale-105">
                <Linkedin size={22} strokeWidth={2} />
              </a>
            </div>
            
            <div className="mt-4 border-t border-white/10 pt-6 w-full max-w-sm flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70">
              <p className="whitespace-nowrap">© {currentYear}  {t('footer.rights')}</p>
              <button 
                onClick={onShowImprint} 
                className="hover:text-white underline decoration-white/30 hover:decoration-white transition-all whitespace-nowrap"
              >
                {t('footer.imprint')}
              </button>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}
