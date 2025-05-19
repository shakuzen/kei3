import React from 'react'
import type { TaxInputs } from '../../types/tax'

interface TaxInputFormProps {
  inputs: TaxInputs
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const TaxInputForm: React.FC<TaxInputFormProps> = ({ inputs, onInputChange }) => {
  const handleDetailedInputToggle = () => {
    // Create a synthetic event that matches the expected type
    const syntheticEvent = {
      target: {
        name: 'showDetailedInput',
        type: 'checkbox',
        checked: !inputs.showDetailedInput
      }
    } as React.ChangeEvent<HTMLInputElement>
    
    onInputChange(syntheticEvent)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Information</h2>

      <div className="mb-4">
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            name="isEmploymentIncome"
            checked={inputs.isEmploymentIncome}
            onChange={onInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Employment Income</span>
        </label>

        <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {inputs.isEmploymentIncome ? 'Gross Annual Employment Income (¥)' : 'Net Annual Income (Business income, etc.) (¥)'}
        </label>
        <input
          type="number"
          id="annualIncome"
          name="annualIncome"
          step="10000"
          value={inputs.annualIncome}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <input
          type="range"
          id="annualIncomeSlider"
          name="annualIncome"
          min="200000"
          max="20000000"
          step="10000"
          value={inputs.annualIncome}
          onChange={onInputChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>¥200,000</span>
          <span>¥10M</span>
          <span>¥20M</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center group relative">
          <input
            type="checkbox"
            name="isOver40"
            checked={inputs.isOver40}
            onChange={onInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">40 years or older</span>
          <button
            type="button"
            className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:text-gray-600 dark:focus:text-gray-200"
            aria-label="More information about age requirement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block group-focus-within:block bg-gray-800 text-white text-xs rounded p-2 w-64 z-10">
            This includes nursing care insurance premiums in your health insurance cost calculation
          </div>
        </label>
      </div>

      {/* Detailed Input Section */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleDetailedInputToggle}
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <span>Detailed Input</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ml-1 transform transition-transform ${inputs.showDetailedInput ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {inputs.showDetailedInput && (
          <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prefecture
              </label>
              <select
                id="prefecture"
                name="prefecture"
                value={inputs.prefecture}
                onChange={onInputChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
              >
                <option value="Tokyo">Tokyo</option>
                <option value="Osaka">Osaka</option>
                <option value="Kyoto">Kyoto</option>
                <option value="Hokkaido">Hokkaido</option>
                <option value="Fukuoka">Fukuoka</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="healthInsuranceProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Health Insurance Provider
              </label>
              <select
                id="healthInsuranceProvider"
                name="healthInsuranceProvider"
                value={inputs.healthInsuranceProvider}
                onChange={onInputChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
              >
                <option value="Kyokai Kenpo">Kyokai Kenpo (Employee Health Insurance)</option>
                <option value="National Health Insurance">National Health Insurance</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {inputs.isEmploymentIncome 
                  ? 'Automatically set to Kyokai Kenpo for employment income'
                  : 'Automatically set to National Health Insurance for non-employment income'}
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="numberOfDependents" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Dependents
              </label>
              <input
                type="number"
                id="numberOfDependents"
                name="numberOfDependents"
                value={inputs.numberOfDependents}
                onChange={onInputChange}
                disabled
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Dependent calculations will be implemented in a future update
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 