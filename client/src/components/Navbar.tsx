'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, Home, History, Users, Zap, Shield, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Composant Navbar - Barre de navigation principale de l'application
 * 
 * Fonctionnalités :
 * - Navigation responsive (desktop et mobile)
 * - Logo cliquable qui redirige vers l'accueil
 * - Menu hamburger pour mobile
 * - Liens de navigation contextuels selon le rôle utilisateur
 * - Informations utilisateur et déconnexion
 */
const Navbar: React.FC = () => {
  // Récupération des données utilisateur et fonctions d'authentification
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  
  // État pour contrôler l'affichage du menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Gère la déconnexion de l'utilisateur
   * Redirige vers la page de connexion après déconnexion
   */
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  /**
   * Ferme le menu mobile lors du clic sur un lien
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Si aucun utilisateur connecté, ne pas afficher la navbar
  if (!user) return null;

  return (
    <nav className="futuristic-container border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Section Logo et Titre - Cliquable pour retourner à l'accueil */}
          <div className="flex items-center">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 sm:space-x-3 group"
              onClick={closeMobileMenu}
            >
              {/* Logo avec animation */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse-glow">
                <Image
                  src="/logo-futuristic.svg"
                  alt="TrueNumber Logo"
                  width={40}
                  height={40}
                  className="w-full h-full"
                />
              </div>
              {/* Titre avec effet de gradient */}
              <span className="text-lg sm:text-2xl font-bold cameroon-gradient-text group-hover:scale-105 transition-transform">
                TrueNumber
              </span>
            </Link>
          </div>

          {/* Navigation Desktop - Cachée sur mobile */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Bouton Accueil */}
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-white hover:text-cameroon-green hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-cameroon-green/30"
            >
              <Home size={16} />
              <span>Accueil</span>
            </Link>
            
            {/* Bouton Historique */}
            <Link
              href="/history"
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-white hover:text-cameroon-yellow hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-cameroon-yellow/30"
            >
              <History size={16} />
              <span>Historique</span>
            </Link>

            {/* Bouton Administration - Visible uniquement pour les admins */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-white hover:text-cameroon-red hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-cameroon-red/30"
              >
                <Users size={16} />
                <span>Administration</span>
              </Link>
            )}
          </div>

          {/* Section Utilisateur et Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Informations Utilisateur - Adaptées pour mobile */}
            <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              {/* Avatar utilisateur */}
              <div className="w-8 h-8 bg-gradient-to-br from-cameroon-green/20 to-cameroon-yellow/20 rounded-full flex items-center justify-center border border-cameroon-green/30">
                <User size={16} className="text-cameroon-green" />
              </div>
              {/* Nom et badge admin */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white truncate max-w-24">{user.username}</span>
                {isAdmin && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-cameroon-red/20 text-cameroon-red rounded-full border border-cameroon-red/30 flex items-center">
                    <Shield size={10} className="mr-1" />
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Version mobile des infos utilisateur */}
            <div className="sm:hidden flex items-center space-x-2 px-2 py-1 rounded-lg bg-white/5">
              <div className="w-6 h-6 bg-gradient-to-br from-cameroon-green/20 to-cameroon-yellow/20 rounded-full flex items-center justify-center border border-cameroon-green/30">
                <User size={12} className="text-cameroon-green" />
              </div>
              {isAdmin && (
                <Shield size={12} className="text-cameroon-red" />
              )}
            </div>

            {/* Bouton Déconnexion - Adapté pour mobile */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-white hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-transparent hover:border-red-400/30"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Déconnexion</span>
            </button>

            {/* Bouton Menu Mobile - Visible uniquement sur mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile - Affiché uniquement sur mobile avec animation */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-100 border-t border-white/10' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 py-3 space-y-2 bg-black/20 backdrop-blur-sm">
          
          {/* Informations utilisateur en mobile */}
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cameroon-green/20 to-cameroon-yellow/20 rounded-full flex items-center justify-center border border-cameroon-green/30">
              <User size={18} className="text-cameroon-green" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-base font-medium text-white">{user.username}</span>
              {isAdmin && (
                <span className="px-2 py-1 text-xs font-bold bg-cameroon-red/20 text-cameroon-red rounded-full border border-cameroon-red/30 flex items-center w-fit mt-1">
                  <Shield size={12} className="mr-1" />
                  Administrateur
                </span>
              )}
            </div>
          </div>

          {/* Liens de navigation mobile */}
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-white hover:text-cameroon-green hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-cameroon-green/30"
          >
            <Home size={20} />
            <span>Accueil</span>
          </Link>
          
          <Link
            href="/history"
            onClick={closeMobileMenu}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-white hover:text-cameroon-yellow hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-cameroon-yellow/30"
          >
            <History size={20} />
            <span>Historique</span>
          </Link>

          {/* Lien Administration - Visible uniquement pour les admins */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-white hover:text-cameroon-red hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-cameroon-red/30"
            >
              <Users size={20} />
              <span>Administration</span>
            </Link>
          )}

          {/* Séparateur visuel */}
          <div className="border-t border-white/10 my-3"></div>

          {/* Bouton déconnexion en mobile */}
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-white hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-transparent hover:border-red-400/30 w-full"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
export { Navbar };