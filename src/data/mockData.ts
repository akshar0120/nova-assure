import { Product, ScoreFactors, CalculatedScore, RiskyStoreMetric, ProtectedOrder, RiskLevel } from "../types";

/**
 * Official NOVA ASSURE Fulfilment Confidence Scoring Formula:
 * 35% Inventory Confidence
 * 25% Store Acceptance
 * 20% Delivery Reliability
 * 10% ETA Accuracy
 * 10% Substitution Reliability
 */
export function computeFulfilmentScore(factors: ScoreFactors): CalculatedScore {
  const inv = factors.inventoryConfidence * 0.35;
  const acc = factors.storeAcceptance * 0.25;
  const del = factors.deliveryReliability * 0.20;
  const eta = factors.etaAccuracy * 0.10;
  const sub = factors.substitutionReliability * 0.10;

  const total = Math.round(inv + acc + del + eta + sub);

  let riskLevel: RiskLevel = "HIGH_RELIABILITY";
  let riskLabel = "Reliable (Assured)";

  if (total >= 78) {
    riskLevel = "HIGH_RELIABILITY";
    riskLabel = "High Reliability";
  } else if (total >= 55) {
    riskLevel = "MEDIUM_RISK";
    riskLabel = "Medium Risk";
  } else {
    riskLevel = "HIGH_RISK";
    riskLabel = "High Risk";
  }

  return {
    totalScore: total,
    riskLevel,
    riskLabel,
    weightedBreakdown: {
      inventory: Math.round(inv * 10) / 10,
      acceptance: Math.round(acc * 10) / 10,
      delivery: Math.round(del * 10) / 10,
      eta: Math.round(eta * 10) / 10,
      substitution: Math.round(sub * 10) / 10,
    },
  };
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Amul Taaza Fresh Toned Milk",
    category: "Dairy & Breakfast",
    price: 28,
    mrp: 30,
    unit: "500 ml pouch",
    stores: [
      {
        id: "store-apollo",
        name: "Apollo Quick Mart",
        brand: "Apollo Express",
        locality: "Koramangala 4th Block",
        city: "Bengaluru",
        distanceKm: 1.2,
        estimatedDeliveryMins: 19,
        inStock: true,
        stockCount: 14,
        factors: {
          inventoryConfidence: 94,
          storeAcceptance: 92,
          deliveryReliability: 88,
          etaAccuracy: 85,
          substitutionReliability: 80,
        },
        reasons: [
          "Recent physical barcode scan 14 mins ago",
          "Fast store acceptance (under 45 sec avg)",
          "3 dedicated delivery partners within 500m",
        ],
      },
      {
        id: "store-reliance",
        name: "Reliance Smart Point",
        brand: "Reliance Retail",
        locality: "Domlur Layout",
        city: "Bengaluru",
        distanceKm: 2.1,
        estimatedDeliveryMins: 24,
        inStock: true,
        stockCount: 28,
        factors: {
          inventoryConfidence: 97,
          storeAcceptance: 88,
          deliveryReliability: 85,
          etaAccuracy: 82,
          substitutionReliability: 90,
        },
        reasons: [
          "High volume replenishment completed 30 mins ago",
          "Automated shelf weight sensor verification active",
          "Multiple verified backup dairy SKUs available",
        ],
      },
      {
        id: "store-nature",
        name: "Nature's Basket",
        brand: "Nature's Basket",
        locality: "Indiranagar 100ft Rd",
        city: "Bengaluru",
        distanceKm: 2.8,
        estimatedDeliveryMins: 27,
        inStock: true,
        stockCount: 19,
        factors: {
          inventoryConfidence: 89,
          storeAcceptance: 84,
          deliveryReliability: 79,
          etaAccuracy: 80,
          substitutionReliability: 75,
        },
        reasons: [
          "Stock sync verified 1 hour ago",
          "Moderate merchant packing speed",
          "Standard route with moderate peak traffic",
        ],
      },
      {
        id: "store-swastik",
        name: "Swastik Supermarket & Grocers",
        brand: "Swastik Retail",
        locality: "HSR Sector 2",
        city: "Bengaluru",
        distanceKm: 3.6,
        estimatedDeliveryMins: 38,
        inStock: true,
        stockCount: 3,
        factors: {
          inventoryConfidence: 61,
          storeAcceptance: 68,
          deliveryReliability: 59,
          etaAccuracy: 55,
          substitutionReliability: 45,
        },
        reasons: [
          "Low remaining unit count (only 3 reported)",
          "Manual inventory reconciliation (last sync > 4 hrs ago)",
          "High store packing delay reported in last 60 mins",
        ],
        riskWarning: "High probability of inventory mismatch during peak checkout hours.",
      },
    ],
  },
  {
    id: "prod-2",
    name: "Aashirvaad Superior Shudh Chakki Atta",
    category: "Staples & Grains",
    price: 245,
    mrp: 275,
    unit: "5 kg bag",
    stores: [
      {
        id: "store-reliance",
        name: "Reliance Smart Point",
        brand: "Reliance Retail",
        locality: "Domlur Layout",
        city: "Bengaluru",
        distanceKm: 2.1,
        estimatedDeliveryMins: 25,
        inStock: true,
        stockCount: 42,
        factors: {
          inventoryConfidence: 98,
          storeAcceptance: 91,
          deliveryReliability: 89,
          etaAccuracy: 86,
          substitutionReliability: 92,
        },
        reasons: [
          "Full pallet stock confirmed at warehouse dock",
          "Dedicated heavy-item packing station active",
        ],
      },
      {
        id: "store-apollo",
        name: "Apollo Quick Mart",
        brand: "Apollo Express",
        locality: "Koramangala 4th Block",
        distanceKm: 1.2,
        city: "Bengaluru",
        estimatedDeliveryMins: 21,
        inStock: true,
        stockCount: 8,
        factors: {
          inventoryConfidence: 86,
          storeAcceptance: 89,
          deliveryReliability: 82,
          etaAccuracy: 80,
          substitutionReliability: 85,
        },
        reasons: [
          "Standard stock verified 2 hours ago",
          "Immediate proximity to delivery partner hub",
        ],
      },
      {
        id: "store-swastik",
        name: "Swastik Supermarket & Grocers",
        brand: "Swastik Retail",
        locality: "HSR Sector 2",
        city: "Bengaluru",
        distanceKm: 3.6,
        estimatedDeliveryMins: 40,
        inStock: true,
        stockCount: 2,
        factors: {
          inventoryConfidence: 54,
          storeAcceptance: 62,
          deliveryReliability: 60,
          etaAccuracy: 52,
          substitutionReliability: 40,
        },
        reasons: ["Critical low stock alert", "Delay in dark store acknowledgement"],
        riskWarning: "Only 2 units remaining on manual inventory ledger.",
      },
    ],
  },
  {
    id: "prod-3",
    name: "Fortune Sunlite Refined Sunflower Oil",
    category: "Cooking Oils",
    price: 135,
    mrp: 155,
    unit: "1 Litre pouch",
    stores: [
      {
        id: "store-apollo",
        name: "Apollo Quick Mart",
        brand: "Apollo Express",
        locality: "Koramangala 4th Block",
        city: "Bengaluru",
        distanceKm: 1.2,
        estimatedDeliveryMins: 20,
        inStock: true,
        stockCount: 22,
        factors: {
          inventoryConfidence: 95,
          storeAcceptance: 94,
          deliveryReliability: 90,
          etaAccuracy: 88,
          substitutionReliability: 85,
        },
        reasons: [
          "Recent inventory verification under 20 mins ago",
          "Zero reported merchant rejects today",
        ],
      },
      {
        id: "store-reliance",
        name: "Reliance Smart Point",
        brand: "Reliance Retail",
        locality: "Domlur Layout",
        city: "Bengaluru",
        distanceKm: 2.1,
        estimatedDeliveryMins: 23,
        inStock: true,
        stockCount: 35,
        factors: {
          inventoryConfidence: 96,
          storeAcceptance: 87,
          deliveryReliability: 86,
          etaAccuracy: 84,
          substitutionReliability: 90,
        },
        reasons: ["Bulk inventory verified", "Multiple oil alternative brands present"],
      },
    ],
  },
  {
    id: "prod-4",
    name: "Cadbury Dairy Milk Silk Chocolate",
    category: "Chocolates & Snacks",
    price: 175,
    mrp: 180,
    unit: "150 g bar",
    stores: [
      {
        id: "store-nature",
        name: "Nature's Basket",
        brand: "Nature's Basket",
        locality: "Indiranagar 100ft Rd",
        city: "Bengaluru",
        distanceKm: 2.8,
        estimatedDeliveryMins: 26,
        inStock: true,
        stockCount: 26,
        factors: {
          inventoryConfidence: 96,
          storeAcceptance: 92,
          deliveryReliability: 90,
          etaAccuracy: 87,
          substitutionReliability: 94,
        },
        reasons: [
          "Temperature controlled storage verified",
          "High inventory audit accuracy",
        ],
      },
      {
        id: "store-apollo",
        name: "Apollo Quick Mart",
        brand: "Apollo Express",
        locality: "Koramangala 4th Block",
        city: "Bengaluru",
        distanceKm: 1.2,
        estimatedDeliveryMins: 18,
        inStock: true,
        stockCount: 11,
        factors: {
          inventoryConfidence: 90,
          storeAcceptance: 89,
          deliveryReliability: 85,
          etaAccuracy: 84,
          substitutionReliability: 80,
        },
        reasons: ["Close transit time prevents temperature melt risk"],
      },
    ],
  },
  {
    id: "prod-5",
    name: "Tata Salt Vacuum Evaporated Iodized",
    category: "Groceries & Spices",
    price: 28,
    mrp: 30,
    unit: "1 kg pack",
    stores: [
      {
        id: "store-apollo",
        name: "Apollo Quick Mart",
        brand: "Apollo Express",
        locality: "Koramangala 4th Block",
        city: "Bengaluru",
        distanceKm: 1.2,
        estimatedDeliveryMins: 19,
        inStock: true,
        stockCount: 45,
        factors: {
          inventoryConfidence: 99,
          storeAcceptance: 96,
          deliveryReliability: 92,
          etaAccuracy: 90,
          substitutionReliability: 95,
        },
        reasons: ["Staple reserve verified 10 mins ago", "100% fulfill track record"],
      },
      {
        id: "store-swastik",
        name: "Swastik Supermarket & Grocers",
        brand: "Swastik Retail",
        locality: "HSR Sector 2",
        city: "Bengaluru",
        distanceKm: 3.6,
        estimatedDeliveryMins: 36,
        inStock: true,
        stockCount: 15,
        factors: {
          inventoryConfidence: 74,
          storeAcceptance: 72,
          deliveryReliability: 68,
          etaAccuracy: 65,
          substitutionReliability: 60,
        },
        reasons: ["Regular stock level", "Moderate traffic along Outer Ring Road"],
      },
    ],
  },
];

export const INITIAL_RISKY_STORES: RiskyStoreMetric[] = [
  {
    id: "store-swastik",
    name: "Swastik Supermarket & Grocers",
    locality: "HSR Sector 2, Bengaluru",
    currentScore: 54,
    riskLevel: "HIGH_RISK",
    cancellationRate: "16.4%",
    activeOrders: 42,
    primaryRiskReason: "Ghost Inventory / Stale Catalog Sync (35% root cause)",
    shelfAuditStatus: "Critical Discrepancy",
    status: "Normal",
  },
  {
    id: "store-krishna",
    name: "Krishna Daily Provisions",
    locality: "BTM 2nd Stage, Bengaluru",
    currentScore: 58,
    riskLevel: "MEDIUM_RISK",
    cancellationRate: "13.2%",
    activeOrders: 29,
    primaryRiskReason: "Store Acceptance Latency > 5 mins",
    shelfAuditStatus: "Overdue (>4h)",
    status: "Normal",
  },
  {
    id: "store-sri-laxmi",
    name: "Sri Laxmi Kirana & Mart",
    locality: "Ejipura Main Rd, Bengaluru",
    currentScore: 61,
    riskLevel: "MEDIUM_RISK",
    cancellationRate: "11.8%",
    activeOrders: 37,
    primaryRiskReason: "Rider Bottleneck in Cluster (20% root cause)",
    shelfAuditStatus: "Overdue (>4h)",
    status: "Normal",
  },
  {
    id: "store-green-veggie",
    name: "Green Fresh Hyperlocal",
    locality: "Koramangala 1st Block, Bengaluru",
    currentScore: 64,
    riskLevel: "MEDIUM_RISK",
    cancellationRate: "10.5%",
    activeOrders: 51,
    primaryRiskReason: "Missing Feasible SKU Substitutes (10% root cause)",
    shelfAuditStatus: "Up to Date",
    status: "Normal",
  },
];

export const INITIAL_PROTECTED_ORDERS: ProtectedOrder[] = [
  {
    id: "ORD-9421",
    timestamp: "2 mins ago",
    productName: "Amul Taaza Fresh Toned Milk (500ml)",
    originalStore: "Apollo Quick Mart (Ghost Stock)",
    assignedStore: "Reliance Smart Point (Domlur)",
    originalRisk: "HIGH RISK (Score: 31%)",
    newConfidence: 91,
    customerSavedFromCancellation: true,
  },
  {
    id: "ORD-9418",
    timestamp: "8 mins ago",
    productName: "Aashirvaad Shudh Atta (5kg)",
    originalStore: "Swastik Grocers (Out of Stock)",
    assignedStore: "Reliance Smart Point (Domlur)",
    originalRisk: "HIGH RISK (Score: 38%)",
    newConfidence: 94,
    customerSavedFromCancellation: true,
  },
  {
    id: "ORD-9407",
    timestamp: "19 mins ago",
    productName: "Fortune Sunflower Oil (1L)",
    originalStore: "Sri Laxmi Kirana (Merchant Timeout)",
    assignedStore: "Apollo Quick Mart (Koramangala)",
    originalRisk: "HIGH RISK (Score: 42%)",
    newConfidence: 89,
    customerSavedFromCancellation: true,
  },
  {
    id: "ORD-9392",
    timestamp: "34 mins ago",
    productName: "Tata Salt Vacuum Evaporated (1kg)",
    originalStore: "Krishna Provisions (Rider Choke)",
    assignedStore: "Apollo Quick Mart (Koramangala)",
    originalRisk: "HIGH RISK (Score: 45%)",
    newConfidence: 93,
    customerSavedFromCancellation: true,
  },
];
