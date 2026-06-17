import OpenAI from "openai";

// Try to initialize, but don't crash if key is missing during build
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
  dangerouslyAllowBrowser: true,
});

export interface UserHabits {
  transportationHabit: string;
  dietPreference: string;
  electricityConsumption: number;
  travelFrequency: string;
  shoppingBehavior: string;
  wasteManagement: string;
  homeHeatingType: string;
  renewableEnergyUsage: string;
  waterUsage: string;
}

export async function calculateCarbonFootprint(habits: UserHabits): Promise<{
  score: number;
  breakdown: { category: string; amount: number; description: string }[];
  recommendations: { title: string; description: string; impactScore: number }[];
}> {
  // Return heuristic calculation instantly for maximum performance
  return heuristicCalculation(habits);
}

function heuristicCalculation(habits: UserHabits) {
  let score = 0;
  const breakdown = [];
  const recommendations = [];

  // Transport
  let transport = 100;
  if (habits.transportationHabit.includes("Gasoline")) transport = 400;
  if (habits.transportationHabit.includes("Electric")) transport = 150;
  if (habits.transportationHabit.includes("Transit")) transport = 80;
  if (habits.transportationHabit.includes("Bicycle")) transport = 10;
  score += transport;
  breakdown.push({ category: "TRANSPORTATION", amount: transport, description: "Monthly commuting" });

  if (transport > 150) {
    recommendations.push({
      title: "Switch to Public Transit",
      description: "Replace 2 car trips a week with public transit to save emissions.",
      impactScore: 50,
    });
  }

  // Diet
  let diet = 100;
  if (habits.dietPreference.includes("Meat")) diet = 300;
  if (habits.dietPreference.includes("Mixed")) diet = 200;
  if (habits.dietPreference.includes("Vegetarian")) diet = 120;
  if (habits.dietPreference.includes("Vegan")) diet = 80;
  score += diet;
  breakdown.push({ category: "FOOD", amount: diet, description: "Dietary choices" });

  if (diet > 150) {
    recommendations.push({
      title: "Meatless Mondays",
      description: "Adopt a plant-based diet for one day a week.",
      impactScore: 30,
    });
  }

  // Energy & Heating
  let energy = habits.electricityConsumption * 0.4; // rough conversion kWh to kg CO2
  
  if (habits.homeHeatingType.includes("Natural Gas")) energy += 150;
  if (habits.homeHeatingType.includes("Electricity")) energy += 100;
  if (habits.homeHeatingType.includes("Wood")) energy += 50;
  if (habits.homeHeatingType.includes("Heat Pump")) energy += 30;

  if (habits.renewableEnergyUsage.includes("Yes")) energy *= 0.2;
  if (habits.renewableEnergyUsage.includes("Partial")) energy *= 0.6;

  score += energy;
  breakdown.push({ category: "ENERGY", amount: energy, description: "Home electricity and heating" });

  if (energy > 150) {
    recommendations.push({
      title: "Improve Home Insulation",
      description: "Better insulation can drastically reduce your heating footprint.",
      impactScore: 40,
    });
  }

  // Travel
  let travel = 0;
  if (habits.travelFrequency.includes("1-2")) travel = 100;
  if (habits.travelFrequency.includes("3-5")) travel = 250;
  if (habits.travelFrequency.includes("Frequent")) travel = 500;
  score += travel;
  breakdown.push({ category: "TRAVEL", amount: travel, description: "Flight emissions distributed monthly" });

  // Shopping
  let shopping = 50;
  if (habits.shoppingBehavior.includes("Frequent")) shopping = 120;
  if (habits.shoppingBehavior.includes("Minimalist")) shopping = 20;
  score += shopping;
  breakdown.push({ category: "SHOPPING", amount: shopping, description: "General consumption" });

  // Waste
  let waste = 40;
  if (habits.wasteManagement.includes("rarely")) waste = 80;
  if (habits.wasteManagement.includes("compost")) waste = 15;
  score += waste;
  breakdown.push({ category: "WASTE", amount: waste, description: "Household waste" });

  // Water
  let water = 20;
  if (habits.waterUsage.includes("High")) water = 50;
  if (habits.waterUsage.includes("Minimal")) water = 10;
  score += water;
  breakdown.push({ category: "WATER", amount: water, description: "Water consumption" });

  // Add default expanded categories to fill the chart
  const extraCategories = [
    { category: "CLOTHING", amount: 35, description: "Apparel and textiles" },
    { category: "ELECTRONICS", amount: 25, description: "Gadgets and appliances" },
    { category: "SERVICES", amount: 45, description: "Healthcare, education, etc." },
    { category: "ENTERTAINMENT", amount: 15, description: "Recreation and media" },
    { category: "OTHER", amount: 10, description: "Miscellaneous" }
  ];

  for (const extra of extraCategories) {
    score += extra.amount;
    breakdown.push(extra);
  }

  return { score, breakdown, recommendations };
}
