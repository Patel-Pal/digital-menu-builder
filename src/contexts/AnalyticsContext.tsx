import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { shopService } from "@/services/shopService";
import { useAuth } from "./AuthContext";

interface AnalyticsData {
  totalScans: number;
  menuViews: number;
  scansChange: string;
  viewsChange: string;
}

interface AnalyticsContextType {
  analytics: AnalyticsData;
  refreshAnalytics: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalScans: 0,
    menuViews: 0,
    scansChange: "+0% this week",
    viewsChange: "+0% this week"
  });

  const refreshAnalytics = async () => {
    try {
      const response = await shopService.getShopAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  useEffect(() => {
    if (user) {
      refreshAnalytics();
    }
  }, [user]);

  return (
    <AnalyticsContext.Provider value={{ analytics, refreshAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
}
