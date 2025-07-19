'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';
import { RegisterData } from '@/types';
import { Eye, EyeOff, UserPlus, User, Mail, Phone, Lock, Shield, Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await authService.register(registerData);
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      router.push('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background avec effet de particules */}
      <div className="absolute inset-0 bg-particles-bg opacity-50"></div>

      {/* Éléments décoratifs flottants */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-cameroon-green/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-cameroon-yellow/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-32 w-28 h-28 bg-cameroon-red/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Bouton retour à l'accueil */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-10 flex items-center space-x-2 text-white/70 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline-block text-sm font-medium">Retour à l'accueil</span>
        </Link>

        <div className="max-w-md w-full space-y-8">
          {/* Logo et titre */}
          <div className="text-center animate-fade-in">
            <div className="mx-auto h-24 w-24 mb-6 animate-pulse-glow">
              <div className="w-24 h-24 bg-gradient-to-br from-cameroon-green via-cameroon-yellow to-cameroon-red rounded-3xl flex items-center justify-center shadow-2xl">
                <UserPlus className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold cameroon-gradient-text mb-2">
              TrueNumber
            </h2>
            <h3 className="text-xl font-semibold text-white mb-4">
              Créer un Compte
            </h3>
            <p className="text-white/70 text-sm">
              Rejoignez l'aventure futuriste du jeu de nombres
            </p>
          </div>

          {/* Carte d'inscription */}
          <div className="futuristic-container rounded-3xl p-8 animate-slide-up">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-cameroon-green" />
                    Nom d'utilisateur
                  </label>
                  <input
                    {...register('username', {
                      required: 'Le nom d\'utilisateur est requis',
                      minLength: {
                        value: 3,
                        message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
                      },
                    })}
                    type="text"
                    autoComplete="username"
                    className={`input ${errors.username ? 'input-error' : ''}`}
                    placeholder="Votre nom d'utilisateur"
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-cameroon-red flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-cameroon-yellow" />
                    Adresse email
                  </label>
                  <input
                    {...register('email', {
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Adresse email invalide',
                      },
                    })}
                    type="email"
                    autoComplete="email"
                    className={`input ${errors.email ? 'input-error' : ''}`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-cameroon-red flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-cameroon-red" />
                    Numéro de téléphone
                  </label>
                  <input
                    {...register('phone', {
                      required: 'Le numéro de téléphone est requis',
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: 'Numéro de téléphone invalide',
                      },
                    })}
                    type="tel"
                    autoComplete="tel"
                    className={`input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="+237 6 XX XX XX XX"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-cameroon-red flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-cameroon-green" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'Le mot de passe est requis',
                        minLength: {
                          value: 6,
                          message: 'Le mot de passe doit contenir au moins 6 caractères',
                        },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`input pr-12 ${errors.password ? 'input-error' : ''}`}
                      placeholder="Votre mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-cameroon-green transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-cameroon-red flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-cameroon-yellow" />
                    Confirmer le mot de passe
                  </label>
                  <input
                    {...register('confirmPassword', {
                      required: 'La confirmation du mot de passe est requise',
                      validate: (value) =>
                        value === password || 'Les mots de passe ne correspondent pas',
                    })}
                    type="password"
                    autoComplete="new-password"
                    className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Confirmez votre mot de passe"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-cameroon-red flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full text-lg font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Création en cours...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <UserPlus className="h-6 w-6 mr-3" />
                      Créer le compte
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Liens */}
            <div className="mt-8 text-center space-y-4">
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <p className="text-white/70 text-sm">
                Déjà membre de TrueNumber ?
              </p>
              <Link
                href="/login"
                className="btn-outline w-full inline-flex items-center justify-center"
              >
                <Shield className="w-5 h-5 mr-2" />
                Se connecter
              </Link>
            </div>
          </div>

          {/* Avantages */}
          <div className="grid grid-cols-3 gap-4 mt-8 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-cameroon-green/20 to-cameroon-green/40 rounded-xl flex items-center justify-center border border-cameroon-green/30">
                <Shield className="w-6 h-6 text-cameroon-green" />
              </div>
              <p className="text-xs text-white/60">Sécurisé</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-cameroon-yellow/20 to-cameroon-yellow/40 rounded-xl flex items-center justify-center border border-cameroon-yellow/30">
                <Star className="w-6 h-6 text-cameroon-yellow" />
              </div>
              <p className="text-xs text-white/60">Gratuit</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-cameroon-red/20 to-cameroon-red/40 rounded-xl flex items-center justify-center border border-cameroon-red/30">
                <UserPlus className="w-6 h-6 text-cameroon-red" />
              </div>
              <p className="text-xs text-white/60">Simple</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;