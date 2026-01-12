import api from './api';

interface Shop {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  address?: string;
  phone?: string;
  email?: string;
  ownerId: string;
  subscription: string;
  isActive: boolean;
  qrScans: number;
  createdAt: string;
  updatedAt: string;
}

interface ShopProfileData {
  description?: string;
  logo?: string;
  banner?: string;
  address?: string;
  phone?: string;
}

export const shopService = {
  // Get shop profile
  getShopProfile: async () => {
    const response = await api.get('/shops/profile');
    return response.data;
  },

  // Create or update shop profile
  createOrUpdateShopProfile: async (data: ShopProfileData) => {
    const response = await api.post('/shops/profile', data);
    return response.data;
  },

  // Get shop by owner ID
  getShopByOwnerId: async (ownerId: string) => {
    const response = await api.get(`/shops/${ownerId}`);
    return response.data;
  },

  // Get shop analytics
  getShopAnalytics: async () => {
    const response = await api.get('/shops/analytics');
    return response.data;
  },

  // Increment scan count
  incrementScan: async (ownerId: string) => {
    const response = await api.post(`/shops/${ownerId}/scan`);
    return response.data;
  },

  // Increment view count
  incrementView: async (ownerId: string) => {
    const response = await api.post(`/shops/${ownerId}/view`);
    return response.data;
  }
};

export type { Shop, ShopProfileData };
