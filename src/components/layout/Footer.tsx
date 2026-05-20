import { Github, Mail, Linkedin, Route, Instagram } from 'lucide-react';

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
  return (
    <>
      <WaveDivider />
      <footer className="bg-secondary text-white relative" role="contentinfo">
        <div className="max-w-3xl mx-auto px-4 pt-2 pb-10">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex items-center justify-center rounded-2xl bg-white/10 border border-white/15 p-4" aria-hidden="true">
              <Route size={52} className="text-white" strokeWidth={1.75} />
            </div>
            <div className="space-y-2 max-w-md">
              <p className="font-heading font-bold text-xl tracking-tight text-white">Train Doggo</p>
              <p className="text-sm text-white/85 font-body leading-relaxed">
                Find a comfortable seat for you and your dog, peek at example carriage layouts, then reserve the space that works for both of you.
              </p>
            </div>
            <p className="text-sm font-semibold text-white/95 font-heading">Kevin Klaus</p>
            <div className="flex items-center justify-center gap-4">
              <a href="https://instagram.com/traindoggo" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/12 hover:bg-white/22 text-white transition-all hover:scale-105 border border-white/15">
                <Instagram size={22} strokeWidth={2} />
              </a>
              <a href="https://github.com/kevinklaus" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/12 hover:bg-white/22 text-white transition-all hover:scale-105 border border-white/15">
                <Github size={22} strokeWidth={2} />
              </a>
              <a href="mailto:kevintheklaus@gmail.com" className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/12 hover:bg-white/22 text-white transition-all hover:scale-105 border border-white/15">
                <Mail size={22} strokeWidth={2} />
              </a>
              <a href="https://www.linkedin.com/in/kevinklaus" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/12 hover:bg-white/22 text-white transition-all hover:scale-105 border border-white/15">
                <Linkedin size={22} strokeWidth={2} />
              </a>
            </div>
            
            <div className="mt-4 border-t border-white/10 pt-6 w-full max-w-sm flex justify-center">
              <button onClick={onShowImprint} className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4">
                Impressum & Datenschutz
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}