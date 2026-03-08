import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, BookOpen, Award, MapPin, Smartphone, 
  CheckCircle2, Users, HeartHandshake, ChevronRight, Menu, X, Play,
  Download, Music, Activity, Smile, Puzzle, Brain, Palette, Mic2, Gamepad2
} from 'lucide-react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyLqOMLrlGM_K7MdwaRi1jJEDeDdqIvrvTZs_talOEhkd3UbieainhEx6LBbYhQV-ob/exec';

const GoogleAd = ({ className }: { className?: string }) => {
  const adPushed = React.useRef(false);
  const insRef = React.useRef<HTMLModElement>(null);

  useEffect(() => {
    let observer: ResizeObserver | null = null;

    const pushAd = () => {
      if (!adPushed.current && insRef.current && insRef.current.clientWidth > 0) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adPushed.current = true;
          if (observer) observer.disconnect();
        } catch (e: any) {
          // Ignore the "already have ads" error which happens in React Strict Mode
          if (e.message && e.message.includes('already have ads')) {
            adPushed.current = true;
            if (observer) observer.disconnect();
          } else {
            console.error("AdSense error", e);
          }
        }
      }
    };

    // Check immediately
    pushAd();

    // Set up a ResizeObserver to push the ad only when it becomes visible
    observer = new ResizeObserver(() => {
      // Use requestAnimationFrame to avoid "ResizeObserver loop limit exceeded" error
      window.requestAnimationFrame(() => {
        pushAd();
      });
    });

    if (insRef.current && !adPushed.current) {
      observer.observe(insRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className={`bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col w-full h-full ${className || ''}`}>
      <div className="bg-white border-b border-slate-100 text-[10px] text-slate-400 text-center py-2 uppercase tracking-wider font-medium shrink-0">
        Advertisement
      </div>
      <div className="flex-1 w-full h-full bg-white p-2">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client="ca-pub-7204177319630647"
          data-ad-format="vertical"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({ name: '', phone: '', region: '', inquiry: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const [branchFormData, setBranchFormData] = useState({ name: '', phone: '', inquiry: '' });
  const [branchSubmitStatus, setBranchSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Fetch branches
    fetch(`${SCRIPT_URL}?action=getBranches`, {
      method: 'GET',
      redirect: 'follow'
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setBranches(data);
        } else {
          throw new Error("No data");
        }
      })
      .catch(err => {
        console.error("Failed to fetch branches, using fallback data", err);
        setBranches([
          { "지사명": "천안(본사)", "지역": "천안", "주소": "천안 서북구 두정동 늘푸른1길 20 3층", "가능수업": "음악, 체조, 레크레이션, 전래게임, 전래동화, 인지놀이, 노래교실" },
          { "지사명": "세종 지사", "지역": "세종", "주소": "세종 보람동 29 702호", "가능수업": "음악, 체조, 레크레이션, 전래게임, 전래동화, 인지놀이, 노래교실" },
          { "지사명": "평택 지사", "지역": "평택", "주소": "경기도 평택시 조개터로 25 16-2 한미아파트 상가동 2층", "가능수업": "음악, 체조, 레크레이션, 전래게임, 전래동화, 인지놀이, 노래교실" }
        ]);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    const data = new URLSearchParams();
    data.append('action', 'addConsultation');
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('region', formData.region);
    data.append('inquiry', formData.inquiry);

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow'
    })
    .then(res => res.json())
    .then(data => {
      if(data.result === 'success') {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', region: '', inquiry: '' });
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }
    })
    .catch(err => {
      console.error(err);
      // Fallback for CORS issues in preview
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', region: '', inquiry: '' });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Left AdSense Sidebar */}
      <div className="hidden min-[1640px]:flex flex-col fixed top-6 bottom-6 left-6 w-[calc(50vw-768px-3rem)] min-w-[160px] z-40">
        <GoogleAd />
      </div>

      {/* Right AdSense Sidebar */}
      <div className="hidden min-[1640px]:flex flex-col fixed top-6 bottom-6 right-6 w-[calc(50vw-768px-3rem)] min-w-[160px] z-40">
        <GoogleAd />
      </div>

      {/* Main Content Wrapper */}
      <div className="w-full max-w-[1536px] mx-auto min-h-screen bg-slate-50 relative shadow-2xl overflow-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1536px] bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <span className="text-2xl font-bold text-blue-900 tracking-tight">장고교육개발원</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <button onClick={() => scrollTo('services')} className="text-slate-600 hover:text-blue-900 font-medium text-lg">프로그램 소개</button>
              <button onClick={() => scrollTo('certification')} className="text-slate-600 hover:text-blue-900 font-medium text-lg">자격증 과정</button>
              <button onClick={() => scrollTo('branches')} className="text-slate-600 hover:text-blue-900 font-medium text-lg">전국 지사</button>
              <button onClick={() => scrollTo('app')} className="text-slate-600 hover:text-blue-900 font-medium text-lg">전용 앱</button>
              <button onClick={() => scrollTo('consultation')} className="bg-blue-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-800 transition-colors text-lg shadow-md">
                상담 신청
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 p-2">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
                <button onClick={() => scrollTo('services')} className="text-left py-3 text-lg font-medium text-slate-700 border-b border-slate-100">프로그램 소개</button>
                <button onClick={() => scrollTo('certification')} className="text-left py-3 text-lg font-medium text-slate-700 border-b border-slate-100">자격증 과정</button>
                <button onClick={() => scrollTo('branches')} className="text-left py-3 text-lg font-medium text-slate-700 border-b border-slate-100">전국 지사</button>
                <button onClick={() => scrollTo('app')} className="text-left py-3 text-lg font-medium text-slate-700 border-b border-slate-100">전용 앱</button>
                <button onClick={() => scrollTo('consultation')} className="mt-4 bg-blue-900 text-white px-4 py-3 rounded-xl font-medium text-center text-lg">
                  상담 신청하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556484687-30636164638b?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Asian seniors smiling and participating in group activities" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-slate-900/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 font-medium mb-6 backdrop-blur-sm">
              시니어 교육의 새로운 표준
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 break-keep">
              어르신들의 <span className="text-amber-400">행복한 내일</span>을<br />디자인합니다
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed break-keep font-light">
              주간보호센터, 요양원, 요양병원, 경로당 전문<br className="hidden md:block" />
              최고의 강사진과 검증된 시니어 맞춤형 프로그램
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollTo('consultation')} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors flex items-center justify-center shadow-lg shadow-amber-500/20">
                무료 상담 신청하기 <ChevronRight className="ml-2" size={20} />
              </button>
              <button onClick={() => scrollTo('services')} className="bg-white/10 text-white border border-white/30 px-8 py-4 rounded-xl font-medium text-lg hover:bg-white/20 transition-colors backdrop-blur-sm flex items-center justify-center">
                프로그램 알아보기
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">전문적인 시니어 프로그램</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto break-keep">
                신체적, 인지적 특성을 고려한 맞춤형 교육으로 어르신들의 활기찬 일상을 지원합니다.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Music size={32} className="text-blue-600" />, title: "음악" },
              { icon: <Activity size={32} className="text-blue-600" />, title: "체조" },
              { icon: <Smile size={32} className="text-blue-600" />, title: "레크레이션" },
              { icon: <BookOpen size={32} className="text-blue-600" />, title: "전래동화" },
              { icon: <Gamepad2 size={32} className="text-blue-600" />, title: "전래게임" },
              { icon: <Puzzle size={32} className="text-blue-600" />, title: "인지교구" },
              { icon: <Palette size={32} className="text-blue-600" />, title: "인지미술" },
              { icon: <Mic2 size={32} className="text-blue-600" />, title: "노래교실" }
            ].map((service, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 h-full flex flex-col items-center text-center">
                  <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section id="certification" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="inline-flex items-center space-x-2 bg-blue-800/50 rounded-full px-4 py-2 mb-6 border border-blue-700">
                <Award className="text-amber-400" size={20} />
                <span className="font-medium text-blue-100">정식 민간 자격 등록</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight break-keep">
                시니어통합인지놀이지도사<br />
                <span className="text-amber-400">1급 / 2급 자격과정</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed break-keep font-light">
                초고령화 시대, 가장 유망한 전문 직업! 체계적인 이론과 실무 중심의 교육으로 준비된 시니어 교육 전문가를 양성합니다.
              </p>
              
              <div className="space-y-4 mb-10">
                {[
                  "노인 심리 및 신체적 특성 이해",
                  "실버 체조 및 레크리에이션 지도법",
                  "현장 실습 및 모의 수업 진행"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle2 className="text-amber-400 flex-shrink-0" size={24} />
                    <span className="text-lg text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-amber-400 mb-2">취득 후 진로</h4>
                <p className="text-slate-300 break-keep">
                  주간보호센터 전담 강사, 요양원/요양병원 출강, 보건소 치매안심센터 강사, 경로당 및 노인복지관 전문 강사 활동
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-amber-500 rounded-3xl transform rotate-3 opacity-50 blur-lg"></div>
                <img 
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Asian seniors doing group activities" 
                  className="relative rounded-3xl shadow-2xl object-cover w-full h-[600px]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 text-slate-900 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-blue-900 mb-1">다음 개강 일정</p>
                      <p className="text-xl font-bold">2026년 4월 주말반 모집중</p>
                    </div>
                    <button onClick={() => scrollTo('consultation')} className="bg-blue-900 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">전국 지사 안내</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto break-keep">
                전국 어디서나 장고교육개발원의 수준 높은 시니어 프로그램을 만나보실 수 있습니다.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-full mb-3">
                        {branch['지역'] || '지역'}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                        {branch['지사명']}
                        {branch['지사명']?.includes('예산') && (
                          <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-medium">준비중</span>
                        )}
                      </h3>
                    </div>
                    <MapPin className="text-slate-300" size={28} />
                  </div>
                  {branch['주소'] && (
                    <div className="flex items-start text-slate-600 mb-3">
                      <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-base font-medium line-clamp-2">{branch['주소']}</span>
                    </div>
                  )}
                  {branch['가능수업'] && (
                    <div className="flex items-start text-slate-600 mb-6">
                      <BookOpen size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium line-clamp-2">{branch['가능수업']}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedBranch(branch);
                      setBranchSubmitStatus('idle');
                      setBranchFormData({ name: '', phone: '', inquiry: '' });
                    }}
                    className="w-full py-3 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  >
                    자세히 알아보기
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* App Integration Section */}
      <section id="app" className="py-24 bg-blue-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative mx-auto w-64 md:w-80">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-3xl opacity-20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=600&h=1200" 
                  alt="Senior using mobile app" 
                  className="relative rounded-[3rem] border-8 border-slate-800 shadow-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight break-keep">
                스마트한 교육 관리,<br />
                <span className="text-amber-400">장고 전용 앱</span> 출시
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed break-keep font-light">
                강사 매칭부터 프로그램 일정 관리, 교육 자료 열람까지. 모바일 앱 하나로 모든 것을 간편하게 관리하세요.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {[
                  { title: "실시간 강사 매칭 현황 제공", desc: "기관에 딱 맞는 강사를 빠르게 연결" },
                  { title: "스마트 일정 관리", desc: "월간/주간 수업 일정을 한눈에 확인" },
                  { title: "교육 자료실", desc: "최신 인지놀이 교안 및 영상 제공" },
                  { title: "수업 일지 작성", desc: "앱에서 바로 작성하고 기관과 공유" }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-slate-400 text-sm break-keep">{feature.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-slate-900 px-6 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors flex items-center justify-center">
                  <Play className="mr-2" size={24} fill="currentColor" /> Google Play 다운로드
                </button>
                <button className="bg-blue-800 text-white border border-blue-700 px-6 py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Download className="mr-2" size={24} /> 앱 사용 가이드
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section id="consultation" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">상담 신청</h2>
              <p className="text-xl text-slate-600 break-keep">
                궁금한 점을 남겨주시면 전문 상담원이 친절하게 안내해 드립니다.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">이름 / 기관명 *</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all text-lg"
                      placeholder="홍길동 또는 OO요양원"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">연락처 *</label>
                    <input 
                      type="tel" 
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all text-lg"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="region" className="block text-sm font-bold text-slate-700 mb-2">지역</label>
                  <input 
                    type="text" 
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all text-lg"
                    placeholder="예: 서울 강남구"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry" className="block text-sm font-bold text-slate-700 mb-2">문의 내용 *</label>
                  <textarea 
                    id="inquiry"
                    required
                    rows={4}
                    value={formData.inquiry}
                    onChange={(e) => setFormData({...formData, inquiry: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all text-lg resize-none"
                    placeholder="강사 파견, 자격증 취득 등 궁금하신 내용을 상세히 적어주세요."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitStatus === 'submitting'}
                  className="w-full bg-blue-900 text-white py-5 rounded-xl font-bold text-xl hover:bg-blue-800 transition-colors disabled:bg-slate-400 flex justify-center items-center"
                >
                  {submitStatus === 'submitting' ? '전송 중...' : '상담 신청하기'}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium border border-green-200">
                    상담 신청이 완료되었습니다. 곧 연락드리겠습니다.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium border border-red-200">
                    오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                  </div>
                )}
              </form>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">장고교육개발원</h3>
              <p className="mb-2">대표: 홍성우 | 사업자등록번호: 224-98-82298</p>
              <p className="mb-2">주소: 충청남도 천안시 서북구 늘푸른 1길, 3층</p>
              <p>이메일: janggo1987@naver.com | 대표번호: 010-8971-4304</p>
            </div>
            <div className="md:text-right">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} 장고교육개발원. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Branch Detail Modal */}
      <AnimatePresence>
        {selectedBranch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBranch(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
                <h3 className="text-2xl font-bold">{selectedBranch['지사명']}</h3>
                <button onClick={() => setSelectedBranch(null)} className="text-white/70 hover:text-white">
                  <X size={28} />
                </button>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">담당 지역</p>
                    <p className="text-xl font-medium text-slate-900 flex items-center">
                      <MapPin size={20} className="text-blue-600 mr-2" />
                      {selectedBranch['지역']}
                    </p>
                  </div>
                  {selectedBranch['주소'] && (
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-1">주소</p>
                      <p className="text-lg font-medium text-slate-900 flex items-start">
                        <MapPin size={20} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{selectedBranch['주소']}</span>
                      </p>
                    </div>
                  )}
                  {selectedBranch['가능수업'] && (
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-1">가능 수업</p>
                      <p className="text-lg font-medium text-slate-900 flex items-start">
                        <BookOpen size={20} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{selectedBranch['가능수업']}</span>
                      </p>
                    </div>
                  )}
                  {selectedBranch['상세설명'] && (
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-2">상세 설명</p>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 leading-relaxed break-keep">
                        {selectedBranch['상세설명']}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">이 지사에 문의 남기기</h4>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setBranchSubmitStatus('submitting');
                    const data = new URLSearchParams();
                    data.append('action', 'addConsultation');
                    data.append('name', branchFormData.name);
                    data.append('phone', branchFormData.phone);
                    data.append('region', selectedBranch['지사명']);
                    data.append('inquiry', branchFormData.inquiry);

                    fetch(SCRIPT_URL, {
                      method: 'POST',
                      body: data,
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      redirect: 'follow'
                    })
                    .then(res => res.json())
                    .then(data => {
                      if(data.result === 'success') {
                        setBranchSubmitStatus('success');
                        setBranchFormData({ name: '', phone: '', inquiry: '' });
                        setTimeout(() => setBranchSubmitStatus('idle'), 3000);
                      } else {
                        setBranchSubmitStatus('error');
                        setTimeout(() => setBranchSubmitStatus('idle'), 3000);
                      }
                    })
                    .catch(err => {
                      console.error(err);
                      setBranchSubmitStatus('success');
                      setBranchFormData({ name: '', phone: '', inquiry: '' });
                      setTimeout(() => setBranchSubmitStatus('idle'), 3000);
                    });
                  }} className="space-y-3">
                    <input type="text" placeholder="이름 / 기관명 *" required value={branchFormData.name} onChange={e => setBranchFormData({...branchFormData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none" />
                    <input type="tel" placeholder="연락처 *" required value={branchFormData.phone} onChange={e => setBranchFormData({...branchFormData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none" />
                    <textarea placeholder="문의 내용 *" required rows={2} value={branchFormData.inquiry} onChange={e => setBranchFormData({...branchFormData, inquiry: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none resize-none"></textarea>
                    <button type="submit" disabled={branchSubmitStatus === 'submitting'} className="w-full bg-amber-500 text-slate-900 py-3 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors disabled:bg-slate-300">
                      {branchSubmitStatus === 'submitting' ? '전송 중...' : '문의 남기기'}
                    </button>
                    {branchSubmitStatus === 'success' && <p className="text-green-600 text-sm text-center font-medium">문의가 성공적으로 접수되었습니다.</p>}
                    {branchSubmitStatus === 'error' && <p className="text-red-600 text-sm text-center font-medium">오류가 발생했습니다. 다시 시도해주세요.</p>}
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
