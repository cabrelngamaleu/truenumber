'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Play, Trophy, Users, Zap, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Arriere-plan avec particules */}
      <div className="absolute inset-0 bg-particles-bg opacity-50"></div>
      
      {/* Elements decoratifs flottants */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-cameroon-green/20 rounded-full animate-float blur-sm"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-cameroon-yellow/20 rounded-full animate-float blur-sm" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-cameroon-red/20 rounded-full animate-float blur-sm" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-40 w-24 h-24 bg-cameroon-green/10 rounded-full animate-float blur-sm" style={{ animationDelay: '3s' }}></div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-4 sm:p-6 lg:px-8">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cameroon-green to-cameroon-yellow rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-white">TrueNumber</span>
        </div>
        <div className="flex space-x-2 sm:space-x-4">
          <Link href="/login" className="btn-outline text-sm sm:text-base">
            Connexion
          </Link>
          <Link href="/register" className="btn-primary text-sm sm:text-base">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          {/* Logo principal anime */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-cameroon-green via-cameroon-yellow to-cameroon-red rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                <Zap className="h-12 w-12 sm:h-16 sm:w-16 text-white animate-bounce-in" />
              </div>
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-cameroon-green via-cameroon-yellow to-cameroon-red rounded-2xl sm:rounded-3xl blur-lg opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 animate-fade-in">
            <span className="cameroon-gradient-text">TrueNumber</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-6 sm:mb-8 max-w-3xl mx-auto animate-slide-up px-4">
            Le jeu de nombres aleatoires le plus excitant du Cameroun ! 
            Testez votre chance et gagnez gros avec les couleurs de notre nation.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 animate-bounce-in px-4">
            <Link href="/register" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 group">
              <Play className="mr-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
              Commencer à Jouer
              <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              <Users className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Se Connecter
            </Link>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-4">
            <div className="futuristic-container p-6 sm:p-8 group hover:scale-105 transition-transform">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cameroon-green/20 to-cameroon-green/40 rounded-xl flex items-center justify-center border border-cameroon-green/30">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-cameroon-green" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">1000+</h3>
              <p className="text-white/70 text-sm sm:text-base">Joueurs Actifs</p>
            </div>

            <div className="futuristic-container p-6 sm:p-8 group hover:scale-105 transition-transform">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cameroon-yellow/20 to-cameroon-yellow/40 rounded-xl flex items-center justify-center border border-cameroon-yellow/30">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-cameroon-yellow" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">50,000+</h3>
              <p className="text-white/70 text-sm sm:text-base">Parties Jouees</p>
            </div>

            <div className="futuristic-container p-6 sm:p-8 group hover:scale-105 transition-transform sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cameroon-red/20 to-cameroon-red/40 rounded-xl flex items-center justify-center border border-cameroon-red/30">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-cameroon-red" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">1M+</h3>
              <p className="text-white/70 text-sm sm:text-base">FCFA Distribues</p>
            </div>
          </div>

          {/* Comment jouer */}
          <div className="futuristic-container p-6 sm:p-8 lg:p-12 text-left max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center flex items-center justify-center">
              <Play className="mr-2 sm:mr-3 text-cameroon-green" />
              Comment Jouer ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cameroon-green to-cameroon-green-dark rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg sm:text-xl">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Inscrivez-vous</h3>
                <p className="text-white/70 text-sm sm:text-base">Creez votre compte et commencez avec un solde de 0</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cameroon-yellow to-cameroon-yellow-dark rounded-full flex items-center justify-center mx-auto mb-4 text-gray-900 font-bold text-lg sm:text-xl">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Generez</h3>
                <p className="text-white/70 text-sm sm:text-base">Cliquez pour generer un nombre aleatoire entre 0 et 100</p>
              </div>
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cameroon-red to-cameroon-red-dark rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg sm:text-xl">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Resultat</h3>
                <p className="text-white/70 text-sm sm:text-base">Si > 70 : +50 points | Si <= 70 : -35 points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-white/60">
              © 2025 Cabrel Ngamaleu. Fait avec ❤️ au Cameroun 🇨🇲
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}