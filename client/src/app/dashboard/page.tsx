'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { gameService, balanceService, historyService } from '@/services/api';
import { GameResult, GameHistoryEntry } from '@/types';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Hash, TrendingUp, TrendingDown, History, Coins, Zap, Star, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Dashboard - Page principale du jeu TrueNumber
 * 
 * Règles du jeu :
 * - Coût : 10 points par partie
 * - Numéro généré entre 0 et 100
 * - Victoire si > 70 : +50 points
 * - Défaite si <= 70 : -35 points
 */
const Dashboard = () => {
  const { user, updateUser } = useAuth();
  
  // États du composant
  const [balance, setBalance] = useState<number>(0);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Récupération des données depuis l'API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [balanceData, historyData] = await Promise.all([
        balanceService.getBalance(),
        historyService.getUserHistory()
      ]);
      setBalance(balanceData.balance);
      setGameHistory(historyData.history || []);
    } catch (error: any) {
      toast.error('Échec du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Fonction principale du jeu
  const playGame = async () => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      const result = await gameService.play();
      
      setLastResult(result);
      setBalance(result.newBalance);
      
      if (user) {
        updateUser({ ...user, balance: result.newBalance });
      }
      
      await fetchData();
      
      // Notification du résultat
      if (result.generatedNumber > 70 && result.generatedNumber <= 100) {
        toast.success(`🎉 Vous avez gagné! Numéro: ${result.generatedNumber} (+50 points)`);
      } else {
        toast.error(`😞 Vous avez perdu! Numéro: ${result.generatedNumber} (-35 points)`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Échec du jeu');
    } finally {
      setIsPlaying(false);
    }
  };

  // Affichage du numéro avec couleur selon le résultat
  const getNumberDisplay = (number: number) => {
    const isWin = number > 70 && number <= 100;
    
    return (
      <div className={`w-20 h-20 bg-gradient-to-br ${
        isWin 
          ? 'from-cameroon-green/20 to-cameroon-yellow/20 border-cameroon-green/30' 
          : 'from-cameroon-red/20 to-cameroon-yellow/20 border-cameroon-red/30'
      } rounded-full flex items-center justify-center border-2 animate-pulse-glow`}>
        <span className={`text-3xl font-bold ${isWin ? 'text-cameroon-green' : 'text-cameroon-red'}`}>
          {number}
        </span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  // Calcul des statistiques
  const winRate = gameHistory && gameHistory.length > 0 
    ? Math.round((gameHistory.filter(g => g.result === 'gagné').length / gameHistory.length) * 100)
    : 0;

  const totalGames = gameHistory?.length || 0;
  const wins = gameHistory?.filter(g => g.result === 'gagné').length || 0;
  const losses = totalGames - wins;

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-particles-bg opacity-50"></div>
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-cameroon-green/30 border-t-cameroon-green mx-auto mb-4"></div>
            <p className="text-white text-lg animate-pulse-glow">Chargement de votre tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-particles-bg opacity-50"></div>
        
        {/* Éléments décoratifs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-cameroon-green/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-cameroon-yellow/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-cameroon-red/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>

        <div className="relative">
          <Navbar />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Section d'accueil */}
            <div className="mb-6 sm:mb-8 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cameroon-green via-cameroon-yellow to-cameroon-red bg-clip-text text-transparent mb-2">
                Bienvenue, {user?.username}!
              </h1>
              <p className="text-white/80 text-base sm:text-lg flex items-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cameroon-yellow" />
                Prêt à jouer à TrueNumber?
              </p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 animate-slide-up">
              {/* Carte Solde */}
              <div className="futuristic-container rounded-xl sm:rounded-2xl p-4 sm:p-6 group hover:scale-105 transition-transform">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cameroon-green/20 to-cameroon-green/40 rounded-lg sm:rounded-xl flex items-center justify-center border border-cameroon-green/30">
                      <Coins className="h-6 w-6 sm:h-8 sm:w-8 text-cameroon-green" />
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white/70 truncate">Solde Actuel</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cameroon-green">{balance}</p>
                  </div>
                </div>
              </div>

              {/* Carte Parties jouées */}
              <div className="futuristic-container rounded-xl sm:rounded-2xl p-4 sm:p-6 group hover:scale-105 transition-transform">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cameroon-yellow/20 to-cameroon-yellow/40 rounded-lg sm:rounded-xl flex items-center justify-center border border-cameroon-yellow/30">
                      <History className="h-6 w-6 sm:h-8 sm:w-8 text-cameroon-yellow" />
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white/70 truncate">Parties Jouées</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cameroon-yellow">{totalGames}</p>
                  </div>
                </div>
              </div>

              {/* Carte Victoires */}
              <div className="futuristic-container rounded-xl sm:rounded-2xl p-4 sm:p-6 group hover:scale-105 transition-transform">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cameroon-green/20 to-cameroon-green/40 rounded-lg sm:rounded-xl flex items-center justify-center border border-cameroon-green/30">
                      <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-cameroon-green" />
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white/70 truncate">Victoires</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cameroon-green">{wins}</p>
                  </div>
                </div>
              </div>

              {/* Carte Taux de victoire */}
              <div className="futuristic-container rounded-xl sm:rounded-2xl p-4 sm:p-6 group hover:scale-105 transition-transform">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cameroon-red/20 to-cameroon-red/40 rounded-lg sm:rounded-xl flex items-center justify-center border border-cameroon-red/30">
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-cameroon-red" />
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white/70 truncate">Taux de Victoire</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cameroon-red">{winRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section principale du jeu */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
              {/* Panel de jeu TrueNumber */}
              <div className="futuristic-container rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center">
                    <Hash className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-cameroon-green" />
                    Jouer à TrueNumber
                  </h2>
                  <p className="text-sm sm:text-base text-white/70">Cliquez pour générer un nombre aléatoire (0-100)</p>
                </div>
                
                <div className="text-center">
                  {/* Affichage du résultat de la dernière partie */}
                  {lastResult && (
                    <div className="mb-6 sm:mb-8 animate-fade-in">
                      <div className="flex justify-center mb-4">
                        {getNumberDisplay(lastResult.generatedNumber)}
                      </div>
                      <div className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-base sm:text-lg font-medium border ${
                        lastResult.result === 'gagné' 
                          ? 'bg-cameroon-green/20 text-cameroon-green border-cameroon-green/30' 
                          : 'bg-cameroon-red/20 text-cameroon-red border-cameroon-red/30'
                      }`}>
                        {lastResult.result === 'gagné' ? (
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        ) : (
                          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        )}
                        {lastResult.result === 'gagné' ? 'Victoire!' : 'Défaite!'}
                        <span className="ml-2 font-bold">
                          {lastResult.balanceChange > 0 ? '+' : ''}{lastResult.balanceChange}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Bouton principal de jeu */}
                  <button
                    onClick={playGame}
                    disabled={isPlaying}
                    className="btn-primary text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 w-full group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlaying ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent mr-2 sm:mr-3"></div>
                        <span className="text-sm sm:text-base">Génération en cours...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-pulse" />
                        <span className="text-sm sm:text-base">Générer un nombre</span>
                      </div>
                    )}
                  </button>

                  {/* Règles du jeu */}
                  <div className="mt-4 sm:mt-6 space-y-2 text-xs sm:text-sm text-white/60">
                    <div className="flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-cameroon-red" />
                      <span>Nombre ≤ 70 = Défaite (-35 points)</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-cameroon-green" />
                      <span>Nombre {'>'}70 et ≤ 100 = Victoire (+50 points)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel d'historique des parties récentes */}
              <div className="futuristic-container rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 flex items-center">
                    <History className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 text-cameroon-yellow" />
                    Historique des Parties
                  </h2>
                  <p className="text-sm sm:text-base text-white/70">Vos 5 dernières parties</p>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {gameHistory && gameHistory.length > 0 ? (
                    gameHistory.slice(0, 5).map((game) => (
                      <div key={game._id || game.gameId} className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10">
                        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${
                            game.result === 'gagné' 
                              ? 'from-cameroon-green/20 to-cameroon-yellow/20 border-cameroon-green/30' 
                              : 'from-cameroon-red/20 to-cameroon-yellow/20 border-cameroon-red/30'
                          } rounded-lg sm:rounded-xl flex items-center justify-center border`}>
                            <span className={`text-sm sm:text-base lg:text-lg font-bold ${
                              game.result === 'gagné' ? 'text-cameroon-green' : 'text-cameroon-red'
                            }`}>
                              {game.generatedNumber}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm sm:text-base text-white font-medium">Numéro: {game.generatedNumber}</p>
                            <p className="text-xs sm:text-sm text-white/60">{formatDate(game.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium ${
                            game.result === 'gagné' 
                              ? 'bg-cameroon-green/20 text-cameroon-green' 
                              : 'bg-cameroon-red/20 text-cameroon-red'
                          }`}>
                            {game.result === 'gagné' ? 'Victoire' : 'Défaite'}
                          </span>
                          <p className="text-xs sm:text-sm text-white/60 mt-1">
                            {game.balanceChange > 0 ? '+' : ''}{game.balanceChange}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <History className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white/40 mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-base text-white/60">Aucune partie jouée pour le moment</p>
                      <p className="text-xs sm:text-sm text-white/40">Commencez à jouer pour voir votre historique ici!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;