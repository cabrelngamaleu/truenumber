'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userService, historyService } from '@/services/api';
import { User, GameHistoryEntry, CreateUserData, UpdateUserData } from '@/types';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Users, Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

// Page d'administration pour gérer les utilisateurs et consulter les statistiques
const AdminPage = () => {
  const { user } = useAuth();
  
  // États pour les données
  const [users, setUsers] = useState<User[]>([]);
  const [allHistory, setAllHistory] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'admin'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, historyData] = await Promise.all([
        userService.getAllUsers(),
        historyService.getAllHistory()
      ]);
      setUsers(usersData.users);
      setAllHistory(historyData.history);
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await userService.createUser(userData);
      toast.success('User created successfully');
      setShowCreateModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (userId: string, userData: UpdateUserData) => {
    try {
      await userService.updateUser(userId, userData);
      toast.success('User updated successfully');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userService.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Filtre les utilisateurs selon la recherche et le rôle
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage users and view system statistics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="card">
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Users</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Clients</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === 'client').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Admins</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === 'admin').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Games</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{allHistory.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="card mb-6 sm:mb-8">
            <div className="card-header p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">User Management</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add User</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
            <div className="card-body p-4 sm:p-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as 'all' | 'client' | 'admin')}
                  className="input text-sm sm:text-base min-w-0 sm:min-w-[120px]"
                >
                  <option value="all">All Roles</option>
                  <option value="client">Clients</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((u) => (
                        <tr key={u._id}>
                          <td className="px-3 sm:px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{u.username}</div>
                              <div className="text-xs text-gray-500 md:hidden">{u.email}</div>
                              <div className="text-xs text-gray-500 sm:hidden">Balance: {u.balance}</div>
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                            <div>
                              <div className="text-sm text-gray-900 truncate max-w-[150px]">{u.email}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[150px]">{u.phone}</div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              u.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {u.balance}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(u);
                                  setShowEditModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="Edit user"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {u._id !== user?._id && (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Game History */}
          <div className="card">
            <div className="card-header p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Game History</h2>
            </div>
            <div className="card-body p-4 sm:p-6">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Number
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result
                        </th>
                        <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance Change
                        </th>
                        <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allHistory.slice(0, 20).map((game) => {
                        const gameUser = users.find(u => u._id === game.userId);
                        return (
                          <tr key={game._id}>
                            <td className="px-3 sm:px-6 py-4">
                              <div>
                                <div className="text-sm text-gray-900 truncate max-w-[100px] sm:max-w-none">
                                  {gameUser?.username || 'Unknown User'}
                                </div>
                                <div className="text-xs text-gray-500 sm:hidden">
                                  #{game.generatedNumber}
                                </div>
                                <div className="text-xs text-gray-500 md:hidden">
                                  {game.balanceChange > 0 ? '+' : ''}{game.balanceChange}
                                </div>
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {game.generatedNumber}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                game.result === 'gagné' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                <span className="hidden sm:inline">{game.result === 'gagné' ? 'Victoire' : 'Défaite'}</span>
                                <span className="sm:hidden">{game.result === 'gagné' ? 'W' : 'L'}</span>
                              </span>
                            </td>
                            <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={game.balanceChange > 0 ? 'text-green-600' : 'text-red-600'}>
                                {game.balanceChange > 0 ? '+' : ''}{game.balanceChange}
                              </span>
                            </td>
                            <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(game.date)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSubmit={(userData) => handleUpdateUser(selectedUser._id, userData)}
        />
      )}
    </ProtectedRoute>
  );
};

// Create User Modal Component
const CreateUserModal: React.FC<{
  onClose: () => void;
  onSubmit: (userData: CreateUserData) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'client'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
      <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'client' | 'admin' })}
                className="input"
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Edit User Modal Component
const EditUserModal: React.FC<{
  user: User;
  onClose: () => void;
  onSubmit: (userData: UpdateUserData) => void;
}> = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<UpdateUserData>({
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
    balance: user.balance
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
      <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'client' | 'admin' })}
                className="input"
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Balance</label>
              <input
                type="number"
                required
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: parseInt(e.target.value) })}
                className="input"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;