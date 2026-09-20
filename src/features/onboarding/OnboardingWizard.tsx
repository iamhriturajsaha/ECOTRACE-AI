/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities, react-hooks/incompatible-library */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

const onboardingSchema = z.object({
  transportationHabit: z.string().min(1, "Please select an option"),
  dietPreference: z.string().min(1, "Please select an option"),
  electricityConsumption: z.number().min(0, "Must be a positive number"),
  travelFrequency: z.string().min(1, "Please select an option"),
  shoppingBehavior: z.string().min(1, "Please select an option"),
  wasteManagement: z.string().min(1, "Please select an option"),
  homeHeatingType: z.string().min(1, "Please select an option"),
  renewableEnergyUsage: z.string().min(1, "Please select an option"),
  waterUsage: z.string().min(1, "Please select an option"),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const steps = [
  { id: "transportation", title: "Transportation", description: "How do you usually get around?" },
  { id: "diet", title: "Diet", description: "What best describes your diet?" },
  { id: "energy", title: "Energy", description: "Your monthly home energy usage" },
  { id: "heating", title: "Heating & Renewables", description: "Your home's heating and energy sources" },
  { id: "water", title: "Water Usage", description: "Your daily water consumption habits" },
  { id: "lifestyle", title: "Lifestyle", description: "Travel, shopping, and waste" },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      transportationHabit: "",
      dietPreference: "",
      electricityConsumption: 300,
      travelFrequency: "",
      shoppingBehavior: "",
      wasteManagement: "",
      homeHeatingType: "",
      renewableEnergyUsage: "",
      waterUsage: "",
    }
  });

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || "Failed to create profile. You may already have one.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto pt-16 px-4 pb-20">
      <div className="mb-6">
        <Link href="/home">
          <Button variant="ghost" className="mb-6 hover:bg-emerald-50 hover:text-emerald-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Let's build your profile</h1>
        <p className="text-lg text-muted-foreground">Answer a few questions to calculate your initial footprint.</p>
        <Progress value={progress} className="h-2 mt-6 bg-emerald-500/20" />
        <div className="flex justify-between text-sm font-medium text-muted-foreground mt-3">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <Card className="border shadow-sm rounded-3xl overflow-hidden relative">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0 }}
                className="space-y-6"
              >
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">{errorMsg}</span>
                  </div>
                )}

                {currentStep === 0 && (
                  <div className="space-y-4">
                    <Label>Primary mode of transportation</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Car (Gasoline)', 'Car (Electric)', 'Public Transit', 'Bicycle / Walking'].map(option => (
                        <div 
                          key={option}
                          onClick={() => setValue("transportationHabit", option)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all h-full min-h-[4.5rem] flex flex-col justify-center ${watch('transportationHabit') === option ? 'border-green-500 bg-green-500/10 shadow-sm' : 'hover:border-green-500/50 hover:bg-muted/50'}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium whitespace-normal break-words leading-tight pr-2">{option}</span>
                            {watch('transportationHabit') === option && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Label>Dietary Preference</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Meat lover', 'Average (Mixed)', 'Vegetarian', 'Vegan'].map(option => (
                        <div 
                          key={option}
                          onClick={() => setValue("dietPreference", option)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all h-full min-h-[4.5rem] flex flex-col justify-center ${watch('dietPreference') === option ? 'border-green-500 bg-green-500/10 shadow-sm' : 'hover:border-green-500/50 hover:bg-muted/50'}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium whitespace-normal break-words leading-tight pr-2">{option}</span>
                            {watch('dietPreference') === option && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <Label>Estimated monthly electricity (kWh)</Label>
                    <div className="pt-8 pb-4">
                      <Input 
                        type="number" 
                        {...register("electricityConsumption", { valueAsNumber: true })} 
                        className="text-2xl h-14 text-center font-bold"
                      />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">National average is around 300 kWh for a single person.</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>Primary Home Heating Source</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Natural Gas', 'Electricity (Grid)', 'Wood / Biomass', 'Heat Pump / Geothermal'].map(option => (
                          <div 
                            key={option}
                            onClick={() => setValue("homeHeatingType", option)}
                            className={`p-4 border rounded-xl cursor-pointer transition-all h-full min-h-[4.5rem] flex flex-col justify-center ${watch('homeHeatingType') === option ? 'border-green-500 bg-green-500/10 shadow-sm' : 'hover:border-green-500/50 hover:bg-muted/50'}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium whitespace-normal break-words leading-tight pr-2">{option}</span>
                              {watch('homeHeatingType') === option && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Do you use Renewable Energy?</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Yes (Solar panels, etc)', 'Partial (Green grid option)', 'No'].map(option => (
                          <div 
                            key={option}
                            onClick={() => setValue("renewableEnergyUsage", option)}
                            className={`p-4 border rounded-xl cursor-pointer transition-all h-full min-h-[4.5rem] flex flex-col justify-center ${watch('renewableEnergyUsage') === option ? 'border-green-500 bg-green-500/10 shadow-sm' : 'hover:border-green-500/50 hover:bg-muted/50'}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium whitespace-normal break-words leading-tight pr-2">{option}</span>
                              {watch('renewableEnergyUsage') === option && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <Label>Daily Water Consumption Habits</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {['Minimal (Water-saving fixtures, short showers)', 'Average (10-15 min showers)', 'High (Long showers, frequent baths)'].map(option => (
                        <div 
                          key={option}
                          onClick={() => setValue("waterUsage", option)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all h-full min-h-[4.5rem] flex flex-col justify-center ${watch('waterUsage') === option ? 'border-green-500 bg-green-500/10 shadow-sm' : 'hover:border-green-500/50 hover:bg-muted/50'}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium whitespace-normal break-words leading-tight pr-2">{option}</span>
                            {watch('waterUsage') === option && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>Air Travel Frequency (Flights per year)</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['None', '1-2 domestic flights', '3-5 domestic / 1 international', 'Frequent flyer (Multiple international)'].map(option => (
                          <div 
                            key={option}
                            onClick={() => setValue("travelFrequency", option)}
                            className={`p-4 border rounded-xl cursor-pointer transition-all h-full min-h-[4.5rem] flex flex-col justify-center ${watch('travelFrequency') === option ? 'border-green-500 bg-green-500/10 shadow-sm' : 'hover:border-green-500/50 hover:bg-muted/50'}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium whitespace-normal break-words leading-tight pr-2">{option}</span>
                              {watch('travelFrequency') === option && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Shopping habits (New clothes/electronics)</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Minimalist (Rarely buy)', 'Average (Occasional)', 'Frequent shopper'].map(option => (
                          <div 
                            key={option}
                            onClick={() => setValue("shoppingBehavior", option)}
                            className={`p-4 border rounded-xl cursor-pointer transition-all h-full min-h-[4.5rem] flex flex-col justify-center ${watch('shoppingBehavior') === option ? 'border-green-500 bg-green-500/10 shadow-sm' : 'hover:border-green-500/50 hover:bg-muted/50'}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium whitespace-normal break-words leading-tight pr-2">{option}</span>
                              {watch('shoppingBehavior') === option && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Recycling and Composting</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['I recycle and compost', 'I only recycle', 'I rarely recycle'].map(option => (
                          <div 
                            key={option}
                            onClick={() => setValue("wasteManagement", option)}
                            className={`p-4 border rounded-xl cursor-pointer transition-all h-full min-h-[4.5rem] flex flex-col justify-center ${watch('wasteManagement') === option ? 'border-green-500 bg-green-500/10 shadow-sm' : 'hover:border-green-500/50 hover:bg-muted/50'}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium whitespace-normal break-words leading-tight pr-2">{option}</span>
                              {watch('wasteManagement') === option && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} className="bg-green-600 hover:bg-green-700 text-white">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                {isSubmitting ? "Generating..." : "Calculate Score"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
