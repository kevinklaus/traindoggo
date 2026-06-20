import { useTranslation } from 'react-i18next';
import { Compass, TrainFront, Github } from 'lucide-react';
import HeroImage from '../layout/HeroImage';
import InfoCard from './InfoCard';

// Lege hierfür einfach ein passendes Foto von euch beiden ab!
import AboutImg from './images/about.jpg'; 
import AboutEndImg from './images/aboutEnd.jpg'; 
import KevinImg from './images/kevin.jpg'; 
import { LogoMark } from '../ui/Primitives';


export default function AboutUs() {
  const { t } = useTranslation();
  const roadmapItems = t('contentPages.aboutUs.roadmapItems', { returnObjects: true }) as string[];

  const linkStyles = "font-semibold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 -mx-1 transition-colors";

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in pb-16">
      <HeroImage 
        src={AboutImg} 
        alt="Kevin & Aslan" 
        title={t('contentPages.aboutUs.title')}
        subtitle={t('contentPages.aboutUs.subtitle')}
        imagePositionClass="object-cover object-[center_65%] sm:object-[center_60%] md:object-[center_51%]"
      />

      <div className="max-w-3xl justify-center px-4 sm:px-0 space-y-6 w-full w-[92%] sm:w-[88%] md:w-[85%] relative z-10 -mt-12 sm:-mt-16 md:-mt-20">
        {/* Das ist Train Doggo */}
        <div className="bg-white rounded-3xl p-5 sm:p-8">
            <LogoMark size='large'/>
          <h2 className="mt-6 text-xl font-bold text-slate-800 font-heading mb-4">
            {t('contentPages.aboutUs.whatIsTitle')}
          </h2>
          <p className="text-slate-700 leading-relaxed text-[15px] sm:text-[16px] mb-4">
            {t('contentPages.aboutUs.whatIsText1')}
          </p>
          <p className="text-slate-700 leading-relaxed text-[15px] sm:text-[16px]">
            {t('contentPages.aboutUs.whatIsText2')} <br className="hidden sm:block" />
            <a href="mailto:hi.traindoggo@gmail.com" title="E-Mail an Train Doggo schreiben" className={linkStyles  + ' mr-1'}>
              hi.traindoggo@gmail.com
            </a> 
             oder 
            <a href="https://www.linkedin.com/me/kevin-klaus" target="_blank" rel="noopener noreferrer" title="Kevins LinkedIn Profil aufrufen" className={linkStyles + ' ml-1'}>
                LinkedIn
            </a>.
          </p>
        </div>

        {/* Intro Section */}
        <div className="bg-white rounded-3xl p-5 sm:p-8">
          <img src={KevinImg} alt="Kevin" className='mb-4 md:mb-6 rounded-full object-cover h-[90px] w-[90px] md:h-[130px] md:w-[130px]' />
          <p className="text-slate-700 leading-relaxed text-[15px] sm:text-[16px] mb-4">
            {t('contentPages.aboutUs.intro1')}
          </p>
          <p className="text-slate-700 leading-relaxed text-[15px] sm:text-[16px]">
            {t('contentPages.aboutUs.intro2')}
          </p>
        </div>

        {/* InfoCards für die Himmelsrichtungen und Bahnmomente */}
        <div className="grid md:grid-cols-2 gap-6">
            <InfoCard 
                icon={<Compass className="text-primary" />} 
                title={t('contentPages.aboutUs.compassTitle')} 
                text={t('contentPages.aboutUs.compassText')} 
            />
            <InfoCard 
                icon={<TrainFront className="text-primary" />} 
                title={t('contentPages.aboutUs.trainTitle')} 
                text={t('contentPages.aboutUs.trainText')} 
            />
        </div>

        

        {/* Roadmap List */}
        <div className="bg-white rounded-3xl p-5 sm:p-8">
          <h2 className="text-xl font-bold text-slate-800 font-heading mb-4">
            {t('contentPages.aboutUs.roadmapTitle')}
          </h2>
          <p className="text-slate-700 leading-relaxed text-[15px] sm:text-[16px] mb-6">
            {t('contentPages.aboutUs.roadmapIntro')}
          </p>
          <ul className="space-y-4">
            {roadmapItems.map((item, idx) => {
              const [boldPart, ...rest] = item.split(': ');
              return (
                <li key={idx} className="flex gap-3 text-slate-700 leading-relaxed text-[15px] sm:text-[16px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></div>
                  <div>
                    <span className="font-semibold text-slate-800">{boldPart}: </span>
                    {rest.join(': ')}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mach mit Section */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 md:flex md:grid-cols-2 gap-10">
            <div className=''>
                <h2 className="text-xl font-bold text-slate-800 font-heading mb-4">
                    {t('contentPages.aboutUs.joinTitle')}
                </h2>
                <p className="text-slate-700 leading-relaxed text-[15px] sm:text-[16px] mb-6">
                    {t('contentPages.aboutUs.joinText')}
                </p>
                <div className="flex gap-4">
                    <a 
                    href="https://github.com/kevinklaus/traindoggo" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="Train Doggo Quellcode auf GitHub ansehen"
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    >
                    <Github size={20} />
                    <span>GitHub</span>
                    </a>
                </div>

                <div className="mt-8 pt-6">
                    <p className="text-slate-700 text-[15px] sm:text-[16px] mb-2">
                    {t('contentPages.aboutUs.outro')}
                    </p>
                    <p className="font-heading text-primary italic">
                    {t('contentPages.aboutUs.signatures')}
                    </p>
                </div>
          </div>
          <img src={AboutEndImg} alt="Kevin & Aslan" className='md:mt-0 mt-6 rounded-2xl object-cover sm:h-[400px] w-full sm:w-auto' />
        </div>

      </div>
    </div>
  );
}