export type RiskLevel = "HIGH_RELIABILITY" | "MEDIUM_RISK" | "HIGH_RISK";

export interface ScoreFactors {
  inventoryConfidence: number; // 35% weight
  storeAcceptance: number;     // 25% weight
  deliveryReliability: number; // 20% weight
  etaAccuracy: number;         // 10% weight
  substitutionReliability: number; // 10% weight
}

export interface StoreOption {
  id: string;
  name: string;
  brand: string;
  distanceKm: number;
  locality: string;
  city: string;
  estimatedDeliveryMins: number;
  inStock: boolean;
  stockCount: number;
  factors: ScoreFactors;
  reasons: string[];
  riskWarning?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  unit: string;
  imageUrl?: string;
  stores: StoreOption[];
}

export interface CalculatedScore {
  totalScore: number;
  riskLevel: RiskLevel;
  riskLabel: string;
  weightedBreakdown: {
    inventory: number;
    acceptance: number;
    delivery: number;
    eta: number;
    substitution: number;
  };
}

export interface RiskyStoreMetric {
  id: string;
  name: string;
  locality: string;
  currentScore: number;
  riskLevel: RiskLevel;
  cancellationRate: string;
  activeOrders: number;
  primaryRiskReason: string;
  shelfAuditStatus: "Up to Date" | "Overdue (>4h)" | "Critical Discrepancy";
  status: "Normal" | "Audited" | "Throttled" | "Auto-Rerouted";
}

export interface ProtectedOrder {
  id: string;
  timestamp: string;
  productName: string;
  originalStore: string;
  assignedStore: string;
  originalRisk: string;
  newConfidence: number;
  customerSavedFromCancellation: boolean;
}
