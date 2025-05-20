import React from 'react'
import type { TakeHomeResults as TaxResultsType } from '../../types/tax'
import { formatJPY } from '../../utils/formatters'

interface TaxResultsProps {
  results: TaxResultsType
  annualIncome: number
}

export const TakeHomeResultsDisplay: React.FC<TaxResultsProps> = ({ results, annualIncome }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Take-Home Pay Results</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">National Income Tax</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatJPY(results.nationalIncomeTax)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Residence Tax</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatJPY(results.residenceTax)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Health Insurance</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatJPY(results.healthInsurance)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pension Payments</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatJPY(results.pensionPayments)}</p>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 dark:text-gray-300">Total Tax and Payments</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatJPY(results.totalTax)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-700 dark:text-gray-300">Take-Home Pay</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatJPY(results.takeHomeIncome)}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-700 dark:text-gray-300">Take-Home Pay Percentage</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {((results.takeHomeIncome / annualIncome) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 