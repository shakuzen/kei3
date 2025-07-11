import React from 'react';
import { Box, Typography } from '@mui/material';
import type { TakeHomeResults } from '../../../types/tax';
import { formatJPY } from '../../../utils/formatters';
import { EMPLOYEES_PENSION_PREMIUM, type IncomeBracketToPensionPremium } from '../../../utils/pensionCalculator';
import GenericPremiumTableTooltip from './PremiumTableTooltip';

interface PensionPremiumTableTooltipProps {
  results: TakeHomeResults;
}

type PremiumTableRow = Record<string, unknown>;

const PensionPremiumTableTooltip: React.FC<PensionPremiumTableTooltipProps> = ({ results }) => {
  const monthlyIncome = results.annualIncome / 12;

  // Only show for employment income
  if (!results.isEmploymentIncome) {
    const fallbackContent = (
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          National Pension (国民年金)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: '0.85rem' }}>
          National pension contributions are a fixed amount regardless of income level.
        </Typography>
        <Box sx={{ mt: 1 }}>
          Official Source:
          <ul>
            <li>
              <a href="https://www.nenkin.go.jp/service/kokunen/hokenryo/hokenryo.html#cms01" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                国民年金保険料の金額 (Japan Pension Service)
              </a>
            </li>
          </ul>
        </Box>
      </Box>
    );

    return (
      <GenericPremiumTableTooltip
        title=""
        description=""
        tableData={[]}
        columns={[]}
        currentRow={null}
        monthlyIncome={monthlyIncome}
        tableContainerDataAttr="data-pension-table-container"
        currentRowId="current-pension-row"
        getIncomeRange={() => ''}
        getCurrentRowSummary={() => ''}
        fallbackContent={fallbackContent}
      />
    );
  }

  // Find the current row for the user's income
  const currentRow = EMPLOYEES_PENSION_PREMIUM.find(row =>
    monthlyIncome >= row.min && (row.max === null || monthlyIncome < row.max)
  );

  const columns = [
    { header: 'Monthly Salary', getValue: () => 0, align: 'left' as const },
    {
      header: 'Employee Contribution',
      getValue: (row: PremiumTableRow) => (row as unknown as IncomeBracketToPensionPremium).halfAmount
    },
    {
      header: 'Total',
      getValue: (row: PremiumTableRow) => (row as unknown as IncomeBracketToPensionPremium).fullAmount
    },
  ];

  const getIncomeRange = (row: PremiumTableRow) => {
    const pensionRow = row as unknown as IncomeBracketToPensionPremium;
    return `${formatJPY(pensionRow.min)} - ${pensionRow.max === null ? '∞' : formatJPY(pensionRow.max)}`;
  };

  const getCurrentRowSummary = (row: PremiumTableRow) => {
    const pensionRow = row as unknown as IncomeBracketToPensionPremium;
    return `Your contribution: ${formatJPY(pensionRow.halfAmount)}/month (employee portion)`;
  }; return (
    <GenericPremiumTableTooltip
      title="Employees Pension Premium Table (厚生年金)"
      description="Monthly pension contributions by income bracket. Your income: {monthlyIncome}/month"
      hint="💡 Employees pay half the contribution, employers pay the other half"
      tableData={EMPLOYEES_PENSION_PREMIUM as unknown as PremiumTableRow[]}
      columns={columns}
      currentRow={(currentRow || null) as PremiumTableRow | null}
      monthlyIncome={monthlyIncome}
      tableContainerDataAttr="data-pension-table-container"
      currentRowId="current-pension-row"
      getIncomeRange={getIncomeRange}
      getCurrentRowSummary={getCurrentRowSummary}
      officialSourceLink={{
        url: "https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku/ryogakuhyo/20200825.html",
        text: "厚生年金保険料額表 (Japan Pension Service)"
      }}
    />
  );
};

export default PensionPremiumTableTooltip;
