'use client';

import { FileText, Home, Contact, EyeOff, Facebook, Slack, Github, Twitter, Instagram } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f5f9] font-sans text-slate-800 relative overflow-hidden">

      {/* ===== HEADER ===== */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
            <img src="/logo-header.png" alt="Université de Dschang" className="h-[46px] object-contain" />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#64748b]">
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-[6px]" onClick={() => router.push('/')}>
              <Home size={16} className="stroke-[1.5]" /> Accueil
            </button>
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-[6px]">
              <FileText size={16} className="stroke-[1.5]" /> Nos services
            </button>
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-[6px]">
              <Contact size={16} className="stroke-[1.5]" /> Contact
            </button>
            <button className="bg-[#0074A6] hover:bg-[#005f8a] text-white px-5 py-[9px] rounded font-medium transition-colors ml-2 shadow-sm">
              Se connecter
            </button>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT (LOGIN FORM) ===== */}
      <main className="flex-1 w-full flex flex-col justify-center items-center relative z-10 px-4 py-12 bg-left-top bg-no-repeat bg-cover" style={{ backgroundImage: "url('/card-11.svg')" }}>
        <div className="w-full max-w-[440px] rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Form Header */}
          <div className="bg-[#0074A6] pt-[32px] pb-[28px] px-8 text-center">
            <h1 className="text-white text-[22px] font-semibold tracking-wide mb-1">
              Connexion
            </h1>
            <p className="text-blue-100/90 text-[14.5px]">
              Connectez-vous pour administrer votre compte
            </p>
          </div>

          {/* Form Body */}
          <div className="bg-white px-8 py-8">
            <form className="space-y-[22px]" onSubmit={(e) => { 
              e.preventDefault(); 
              
              const expectedEmail = localStorage.getItem('adminEmail') || 'admin@univ-dschang.cm';
              const expectedPassword = localStorage.getItem('adminPassword') || 'admin';

              if (email === expectedEmail && password === expectedPassword) {
                localStorage.setItem('adminAuth', 'true');
                router.push('/'); 
              } else {
                setError('Identifiants incorrects.');
              }
            }}>
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                  {error}
                </div>
              )}
              {/* Email Field */}
              <div>
                <label className="block text-[#1f2937] text-[13.5px] font-medium mb-[8px]">
                  Votre email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@site.com"
                    className="w-full border border-[#e5e7eb] rounded-[4px] px-4 py-[11px] text-[14.5px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0074A6] focus:ring-1 focus:ring-[#0074A6] transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-[8px]">
                  <label className="block text-[#1f2937] text-[13.5px] font-medium">
                    Mot de passe
                  </label>
                  <a href="#" className="text-[#0074A6] text-[13px] font-semibold hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8+ caractères requis"
                    className="w-full border border-[#e5e7eb] rounded-[4px] pl-4 pr-10 py-[11px] text-[14.5px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0074A6] focus:ring-1 focus:ring-[#0074A6] transition-colors"
                  />
                  <button type="button" className="absolute right-3 text-gray-400 hover:text-gray-600">
                    <EyeOff size={18} className="stroke-[1.5]" />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#0074A6] hover:bg-[#005f8a] text-white text-[15px] font-medium py-[11px] rounded-[4px] transition-colors mt-2"
              >
                Se connecter
              </button>
            </form>

            {/* Footer Text */}
            <div className="mt-8 text-center text-[14px] text-[#596371]">
              Vous n'avez pas encore de compte ?{' '}
              {/* Force recompile to clear hydration cache */}
              <button 
                type="button"
                className="text-[#0074A6] font-semibold opacity-60 cursor-not-allowed"
                onClick={(e) => {
                  e.preventDefault();
                  alert("La création de compte est fermée. Veuillez contacter l'administrateur système.");
                }}
              >
                Inscrivez-vous ici
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ===== BLUE SEPARATOR LINE ===== */}
      <div className="h-[1px] bg-[#0074A6] w-full relative z-10" />

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#f6f8fa] pt-[30px] pb-[40px] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex flex-col items-center mb-[18px]">
            <img src="/logo-footer.png" alt="Université de Dschang" className="h-[52px] object-contain" />
          </div>
          <div className="text-[13px] text-[#8e99a8] mb-[22px] space-y-[4px]">
            <p>&copy; <span className="text-[#0074A6]">Université de Dschang</span>. Tout droit réservé.</p>
            <p>Equipe SIGES</p>
          </div>
          <div className="flex gap-[28px] text-[#94a3b8]">
            <Facebook size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer fill-current stroke-0" />
            <Slack size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer fill-current stroke-0" />
            <Github size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer fill-current stroke-0" />
            <Twitter size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer fill-current stroke-0" />
            <Instagram size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer stroke-[2]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
