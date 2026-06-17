import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint } from '../services/ai-calculator';

describe('Carbon Footprint Calculator', () => {
  it('should correctly calculate footprint for an eco-friendly user', async () => {
    const habits = {
      transportationHabit: "Bicycle",
      dietPreference: "Vegan",
      electricityConsumption: 100,
      travelFrequency: "0",
      shoppingBehavior: "Minimalist",
      wasteManagement: "compost and recycle",
      homeHeatingType: "Heat Pump",
      renewableEnergyUsage: "Yes",
      waterUsage: "Minimal"
    };

    const result = await calculateCarbonFootprint(habits);

    expect(result.score).toBeLessThan(300);
    expect(result.breakdown).toHaveLength(12);
    expect(result.breakdown.find(b => b.category === "TRANSPORTATION")?.amount).toBe(10);
    expect(result.breakdown.find(b => b.category === "FOOD")?.amount).toBe(80);
  });

  it('should flag high-emission users with targeted recommendations', async () => {
    const habits = {
      transportationHabit: "Gasoline Car",
      dietPreference: "Meat Lover",
      electricityConsumption: 800,
      travelFrequency: "Frequent Flights",
      shoppingBehavior: "Frequent Buyer",
      wasteManagement: "rarely recycle",
      homeHeatingType: "Natural Gas",
      renewableEnergyUsage: "No",
      waterUsage: "High"
    };

    const result = await calculateCarbonFootprint(habits);

    expect(result.score).toBeGreaterThan(1000);
    expect(result.recommendations.length).toBeGreaterThan(0);
    
    // Should have recommendations for transit, diet, and heating
    const recommendationTitles = result.recommendations.map(r => r.title);
    expect(recommendationTitles).toContain("Switch to Public Transit");
    expect(recommendationTitles).toContain("Meatless Mondays");
  });
});
