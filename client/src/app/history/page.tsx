'use client';

// Importation des modules React nécessaires
import React, { useState, useEffect } from 'react';

// Importation du contexte d'authentification
import { useAuth } from '@/contexts/AuthContext';

// Importation du service API pour l'historique
import { historyService } from '@/services/api';

// Importation des types TypeScript
import { GameHistoryEntry } from '@/types';

// Importation des composants de l'interface
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Importation des icônes Lucide React
import { History, TrendingUp, TrendingDown, Calendar, Hash, Zap, Star, Trophy } from 'lucide-react';

// Importation de la bibliothèque de notifications
import toast from 'react-hot-toast';

/**
 * Page d'historique des parties TrueNumber
 * Affiche l'historique complet des parties avec filtres et statistiques
 */
const HistoryPage = () => {
  const { user } = useAuth();
  
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'gagné' | 'perdu'>('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const historyData = await historyService.getUserHistory();
      console.log('Données d\'historique reçues:', historyData);
      setGameHistory(historyData.history || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrage des parties selon le filtre sélectionné
  const filteredHistory = gameHistory.filter(game => {
    if (filter === 'all') return true;
    return game.result === filter;
  });

  // Calcul des statistiques
  const stats = {
    total: gameHistory.length,
    wins: gameHistory.filter(g => g.result === 'gagné').length,
    losses: gameHistory.filter(g => g.result === 'perdu').length,
    winRate: gameHistory.length > 0 ? Math.round((gameHistory.filter(g => g.result === 'gagné').length / gameHistory.length) * 100) : 0
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-particles-bg opacity-50"></div>
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cameroon-green border-t-transparent mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium animate-pulse-glow">Chargement de l'historique...</p>
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
        <div className="absolute top-20 left-10 w-20 h-20 bg-cameroon-green/10 rounded-full animate-float blur-sm" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-cameroon-yellow/10 rounded-full animate-float blur-sm" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-cameroon-red/10 rounded-full animate-float blur-sm" style={{ animationDelay: '2s' }} />
        
        <Navbar />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* En-tête de la page */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center cameroon-gradient-text">
              <History className="mr-2 sm:mr-3 text-cameroon-green animate-pulse-glow w-6 h-6 sm:w-8 sm:h-8" />
              Historique des Parties
            </h1>
            <p className="text-white/80 mt-2 text-base sm:text-lg">Consultez l'historique complet de vos parties TrueNumber</p>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="futuristic-container group hover:scale-105 transition-transform">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cameroon-green/20 to-cameroon-green/40 rounded-lg sm:rounded-xl flex items-center justify-center border border-cameroon-green/30 mx-auto sm:mx-0">
                      <Hash className="h-5 w-5 sm:h-6 sm:w-6 text-cameroon-green" />
                    </div>
                  </div>
                  <div className="sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-white/70">Total Parties</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="futuristic-container group hover:scale-105 transition-transform">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cameroon-green/20 to-cameroon-green/40 rounded-lg sm:rounded-xl flex items-center justify-center border border-cameroon-green/30 mx-auto sm:mx-0">
                      <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-cameroon-green" />
                    </div>
                  </div>
                  <div className="sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-white/70">Victoires</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cameroon-green">{stats.wins}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="futuristic-container group hover:scale-105 transition-transform">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cameroon-red/20 to-cameroon-red/40 rounded-lg sm:rounded-xl flex items-center justify-center border border-cameroon-red/30 mx-auto sm:mx-0">
                      <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-cameroon-red" />
                    </div>
                  </div>
                  <div className="sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-white/70">Défaites</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cameroon-red">{stats.losses}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="futuristic-container group hover:scale-105 transition-transform">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cameroon-yellow/20 to-cameroon-yellow/40 rounded-lg sm:rounded-xl flex items-center justify-center border border-cameroon-yellow/30 mx-auto sm:mx-0">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-cameroon-yellow" />
                    </div>
                  </div>
                  <div className="sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-white/70">Taux de Victoire</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cameroon-yellow">{stats.winRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons de filtres */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 border ${
                  filter === 'all'
                    ? 'bg-cameroon-green text-white border-cameroon-green shadow-lg shadow-cameroon-green/25'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-cameroon-green/50'
                }`}
              >
                <span className="hidden sm:inline">Toutes ({stats.total})</span>
                <span className="sm:hidden">Toutes</span>
              </button>
              <button
                onClick={() => setFilter('gagné')}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 border ${
                  filter === 'gagné'
                    ? 'bg-cameroon-green text-white border-cameroon-green shadow-lg shadow-cameroon-green/25'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-cameroon-green/50'
                }`}
              >
                <span className="hidden sm:inline">Victoires ({stats.wins})</span>
                <span className="sm:hidden">Victoires</span>
              </button>
              <button
                onClick={() => setFilter('perdu')}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 border ${
                  filter === 'perdu'
                    ? 'bg-cameroon-red text-white border-cameroon-red shadow-lg shadow-cameroon-red/25'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-cameroon-red/50'
                }`}
              >
                <span className="hidden sm:inline">Défaites ({stats.losses})</span>
                <span className="sm:hidden">Défaites</span>
              </button>
            </div>
          </div>

          {/* Section historique */}
          <div className="futuristic-container">
            <div className="p-4 sm:p-6 border-b border-white/10">
              <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
                <Zap className="mr-2 text-cameroon-yellow w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline">Historique Détaillé ({filteredHistory.length} parties)</span>
                <span className="sm:hidden">Historique ({filteredHistory.length})</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <History className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-white/40 mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Aucune partie trouvée</h3>
                  <p className="text-white/60 text-sm sm:text-base">
                    {filter === 'all' 
                      ? 'Commencez à jouer pour voir votre historique ici !'
                      : `Aucune partie ${filter === 'gagné' ? 'gagnée' : 'perdue'} trouvée.`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredHistory.map((game) => (
                    <div key={game._id || game.gameId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-cameroon-green/30 space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cameroon-green/20 to-cameroon-yellow/20 rounded-lg sm:rounded-xl flex items-center justify-center border border-cameroon-green/30">
                            <span className="text-base sm:text-xl font-bold text-cameroon-green">{game.generatedNumber}</span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-base sm:text-lg font-medium text-white truncate">
                            <span className="hidden sm:inline">Numéro généré: </span>{game.generatedNumber}
                          </p>
                          <p className="text-xs sm:text-sm text-white/60 flex items-center mt-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                            <span className="truncate">{formatDate(game.date)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border ${
                          game.result === 'gagné' 
                            ? 'bg-cameroon-green/20 text-cameroon-green border-cameroon-green/30' 
                            : 'bg-cameroon-red/20 text-cameroon-red border-cameroon-red/30'
                        }`}>
                          {game.result === 'gagné' ? (
                            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          ) : (
                            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          )}
                          {game.result === 'gagné' ? 'Victoire' : 'Défaite'}
                          <span className="ml-1 sm:ml-2 font-bold">
                            {game.balanceChange > 0 ? '+' : ''}{game.balanceChange}
                          </span>
                        </span>
                        <p className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-2">
                          Solde: {game.newBalance}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HistoryPage;