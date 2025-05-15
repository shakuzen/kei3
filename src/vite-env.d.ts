/// <reference types="vite/client" />

// Extend Chart.js types to include our custom plugin
import { ChartType } from 'chart.js';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    customPlugin?: {
      id?: string;
      data?: {
        currentIncomePosition: number;
        medianIncomePosition: number;
        currentIncome: number;
        medianIncome: number;
      };
    };
  }
}
