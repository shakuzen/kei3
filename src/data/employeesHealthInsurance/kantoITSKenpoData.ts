import type { EmployeesHealthInsurancePremiumTableRow } from '../../types/healthInsurance';

// Health Insurance Premium Table for ITS Kenpo (Kanto IT Software Health Insurance Association)
// Effective March 1, Reiwa 7 (2025)
// Source: https://www.its-kenpo.or.jp/documents/hoken/jimu/hokenryou/2025.3.1ryougaku.pdf
export const KANTO_ITS_KENPO_TABLE: EmployeesHealthInsurancePremiumTableRow[] = [
    // Standard Monthly Remuneration (SMR) | Min Income (inclusive) | Max Income (exclusive) | Employee (No LTC) | Employee (With LTC) | Full (No LTC) | Full (With LTC)
    // SMR: 58,000
    { minIncomeInclusive: 0, maxIncomeExclusive: 63000, employeePremiumNoLTC: 2755, employeePremiumWithLTC: 3277, fullPremiumNoLTC: 5510, fullPremiumWithLTC: 6554 },
    // SMR: 68,000
    { minIncomeInclusive: 63000, maxIncomeExclusive: 73000, employeePremiumNoLTC: 3230, employeePremiumWithLTC: 3842, fullPremiumNoLTC: 6460, fullPremiumWithLTC: 7684 },
    // SMR: 78,000
    { minIncomeInclusive: 73000, maxIncomeExclusive: 83000, employeePremiumNoLTC: 3705, employeePremiumWithLTC: 4407, fullPremiumNoLTC: 7410, fullPremiumWithLTC: 8814 },
    // SMR: 88,000
    { minIncomeInclusive: 83000, maxIncomeExclusive: 93000, employeePremiumNoLTC: 4180, employeePremiumWithLTC: 4972, fullPremiumNoLTC: 8360, fullPremiumWithLTC: 9944 },
    // SMR: 98,000
    { minIncomeInclusive: 93000, maxIncomeExclusive: 101000, employeePremiumNoLTC: 4655, employeePremiumWithLTC: 5537, fullPremiumNoLTC: 9310, fullPremiumWithLTC: 11074 },
    // SMR: 104,000
    { minIncomeInclusive: 101000, maxIncomeExclusive: 107000, employeePremiumNoLTC: 4940, employeePremiumWithLTC: 5876, fullPremiumNoLTC: 9880, fullPremiumWithLTC: 11752 },
    // SMR: 110,000
    { minIncomeInclusive: 107000, maxIncomeExclusive: 114000, employeePremiumNoLTC: 5225, employeePremiumWithLTC: 6215, fullPremiumNoLTC: 10450, fullPremiumWithLTC: 12430 },
    // SMR: 118,000
    { minIncomeInclusive: 114000, maxIncomeExclusive: 122000, employeePremiumNoLTC: 5605, employeePremiumWithLTC: 6667, fullPremiumNoLTC: 11210, fullPremiumWithLTC: 13334 },
    // SMR: 126,000
    { minIncomeInclusive: 122000, maxIncomeExclusive: 130000, employeePremiumNoLTC: 5985, employeePremiumWithLTC: 7119, fullPremiumNoLTC: 11970, fullPremiumWithLTC: 14238 },
    // SMR: 134,000
    { minIncomeInclusive: 130000, maxIncomeExclusive: 138000, employeePremiumNoLTC: 6365, employeePremiumWithLTC: 7571, fullPremiumNoLTC: 12730, fullPremiumWithLTC: 15142 },
    // SMR: 142,000
    { minIncomeInclusive: 138000, maxIncomeExclusive: 146000, employeePremiumNoLTC: 6745, employeePremiumWithLTC: 8023, fullPremiumNoLTC: 13490, fullPremiumWithLTC: 16046 },
    // SMR: 150,000
    { minIncomeInclusive: 146000, maxIncomeExclusive: 155000, employeePremiumNoLTC: 7125, employeePremiumWithLTC: 8475, fullPremiumNoLTC: 14250, fullPremiumWithLTC: 16950 },
    // SMR: 160,000
    { minIncomeInclusive: 155000, maxIncomeExclusive: 165000, employeePremiumNoLTC: 7600, employeePremiumWithLTC: 9040, fullPremiumNoLTC: 15200, fullPremiumWithLTC: 18080 },
    // SMR: 170,000
    { minIncomeInclusive: 165000, maxIncomeExclusive: 175000, employeePremiumNoLTC: 8075, employeePremiumWithLTC: 9605, fullPremiumNoLTC: 16150, fullPremiumWithLTC: 19210 },
    // SMR: 180,000
    { minIncomeInclusive: 175000, maxIncomeExclusive: 185000, employeePremiumNoLTC: 8550, employeePremiumWithLTC: 10170, fullPremiumNoLTC: 17100, fullPremiumWithLTC: 20340 },
    // SMR: 190,000
    { minIncomeInclusive: 185000, maxIncomeExclusive: 195000, employeePremiumNoLTC: 9025, employeePremiumWithLTC: 10735, fullPremiumNoLTC: 18050, fullPremiumWithLTC: 21470 },
    // SMR: 200,000
    { minIncomeInclusive: 195000, maxIncomeExclusive: 210000, employeePremiumNoLTC: 9500, employeePremiumWithLTC: 11300, fullPremiumNoLTC: 19000, fullPremiumWithLTC: 22600 },
    // SMR: 220,000
    { minIncomeInclusive: 210000, maxIncomeExclusive: 230000, employeePremiumNoLTC: 10450, employeePremiumWithLTC: 12430, fullPremiumNoLTC: 20900, fullPremiumWithLTC: 24860 },
    // SMR: 240,000
    { minIncomeInclusive: 230000, maxIncomeExclusive: 250000, employeePremiumNoLTC: 11400, employeePremiumWithLTC: 13560, fullPremiumNoLTC: 22800, fullPremiumWithLTC: 27120 },
    // SMR: 260,000
    { minIncomeInclusive: 250000, maxIncomeExclusive: 270000, employeePremiumNoLTC: 12350, employeePremiumWithLTC: 14690, fullPremiumNoLTC: 24700, fullPremiumWithLTC: 29380 },
    // SMR: 280,000
    { minIncomeInclusive: 270000, maxIncomeExclusive: 290000, employeePremiumNoLTC: 13300, employeePremiumWithLTC: 15820, fullPremiumNoLTC: 26600, fullPremiumWithLTC: 31640 },
    // SMR: 300,000
    { minIncomeInclusive: 290000, maxIncomeExclusive: 310000, employeePremiumNoLTC: 14250, employeePremiumWithLTC: 16950, fullPremiumNoLTC: 28500, fullPremiumWithLTC: 33900 },
    // SMR: 320,000
    { minIncomeInclusive: 310000, maxIncomeExclusive: 330000, employeePremiumNoLTC: 15200, employeePremiumWithLTC: 18080, fullPremiumNoLTC: 30400, fullPremiumWithLTC: 36160 },
    // SMR: 340,000
    { minIncomeInclusive: 330000, maxIncomeExclusive: 350000, employeePremiumNoLTC: 16150, employeePremiumWithLTC: 19210, fullPremiumNoLTC: 32300, fullPremiumWithLTC: 38420 },
    // SMR: 360,000
    { minIncomeInclusive: 350000, maxIncomeExclusive: 370000, employeePremiumNoLTC: 17100, employeePremiumWithLTC: 20340, fullPremiumNoLTC: 34200, fullPremiumWithLTC: 40680 },
    // SMR: 380,000
    { minIncomeInclusive: 370000, maxIncomeExclusive: 395000, employeePremiumNoLTC: 18050, employeePremiumWithLTC: 21470, fullPremiumNoLTC: 36100, fullPremiumWithLTC: 42940 },
    // SMR: 410,000
    { minIncomeInclusive: 395000, maxIncomeExclusive: 425000, employeePremiumNoLTC: 19475, employeePremiumWithLTC: 23165, fullPremiumNoLTC: 38950, fullPremiumWithLTC: 46330 },
    // SMR: 440,000
    { minIncomeInclusive: 425000, maxIncomeExclusive: 455000, employeePremiumNoLTC: 20900, employeePremiumWithLTC: 24860, fullPremiumNoLTC: 41800, fullPremiumWithLTC: 49720 },
    // SMR: 470,000
    { minIncomeInclusive: 455000, maxIncomeExclusive: 485000, employeePremiumNoLTC: 22325, employeePremiumWithLTC: 26555, fullPremiumNoLTC: 44650, fullPremiumWithLTC: 53110 },
    // SMR: 500,000
    { minIncomeInclusive: 485000, maxIncomeExclusive: 515000, employeePremiumNoLTC: 23750, employeePremiumWithLTC: 28250, fullPremiumNoLTC: 47500, fullPremiumWithLTC: 56500 },
    // SMR: 530,000
    { minIncomeInclusive: 515000, maxIncomeExclusive: 545000, employeePremiumNoLTC: 25175, employeePremiumWithLTC: 29945, fullPremiumNoLTC: 50350, fullPremiumWithLTC: 59890 },
    // SMR: 560,000
    { minIncomeInclusive: 545000, maxIncomeExclusive: 575000, employeePremiumNoLTC: 26600, employeePremiumWithLTC: 31640, fullPremiumNoLTC: 53200, fullPremiumWithLTC: 63280 },
    // SMR: 590,000
    { minIncomeInclusive: 575000, maxIncomeExclusive: 605000, employeePremiumNoLTC: 28025, employeePremiumWithLTC: 33335, fullPremiumNoLTC: 56050, fullPremiumWithLTC: 66670 },
    // SMR: 620,000
    { minIncomeInclusive: 605000, maxIncomeExclusive: 635000, employeePremiumNoLTC: 29450, employeePremiumWithLTC: 35030, fullPremiumNoLTC: 58900, fullPremiumWithLTC: 70060 },
    // SMR: 650,000
    { minIncomeInclusive: 635000, maxIncomeExclusive: 665000, employeePremiumNoLTC: 30875, employeePremiumWithLTC: 36725, fullPremiumNoLTC: 61750, fullPremiumWithLTC: 73450 },
    // SMR: 680,000
    { minIncomeInclusive: 665000, maxIncomeExclusive: 695000, employeePremiumNoLTC: 32300, employeePremiumWithLTC: 38420, fullPremiumNoLTC: 64600, fullPremiumWithLTC: 76840 },
    // SMR: 710,000
    { minIncomeInclusive: 695000, maxIncomeExclusive: 730000, employeePremiumNoLTC: 33725, employeePremiumWithLTC: 40115, fullPremiumNoLTC: 67450, fullPremiumWithLTC: 80230 },
    // SMR: 750,000
    { minIncomeInclusive: 730000, maxIncomeExclusive: 770000, employeePremiumNoLTC: 35625, employeePremiumWithLTC: 42375, fullPremiumNoLTC: 71250, fullPremiumWithLTC: 84750 },
    // SMR: 790,000
    { minIncomeInclusive: 770000, maxIncomeExclusive: 810000, employeePremiumNoLTC: 37525, employeePremiumWithLTC: 44635, fullPremiumNoLTC: 75050, fullPremiumWithLTC: 89270 },
    // SMR: 830,000
    { minIncomeInclusive: 810000, maxIncomeExclusive: 855000, employeePremiumNoLTC: 39425, employeePremiumWithLTC: 46895, fullPremiumNoLTC: 78850, fullPremiumWithLTC: 93790 },
    // SMR: 880,000
    { minIncomeInclusive: 855000, maxIncomeExclusive: 905000, employeePremiumNoLTC: 41800, employeePremiumWithLTC: 49720, fullPremiumNoLTC: 83600, fullPremiumWithLTC: 99440 },
    // SMR: 930,000
    { minIncomeInclusive: 905000, maxIncomeExclusive: 955000, employeePremiumNoLTC: 44175, employeePremiumWithLTC: 52545, fullPremiumNoLTC: 88350, fullPremiumWithLTC: 105090 },
    // SMR: 980,000
    { minIncomeInclusive: 955000, maxIncomeExclusive: 1005000, employeePremiumNoLTC: 46550, employeePremiumWithLTC: 55370, fullPremiumNoLTC: 93100, fullPremiumWithLTC: 110740 },
    // SMR: 1,030,000
    { minIncomeInclusive: 1005000, maxIncomeExclusive: 1055000, employeePremiumNoLTC: 48925, employeePremiumWithLTC: 58195, fullPremiumNoLTC: 97850, fullPremiumWithLTC: 116390 },
    // SMR: 1,090,000
    { minIncomeInclusive: 1055000, maxIncomeExclusive: 1115000, employeePremiumNoLTC: 51775, employeePremiumWithLTC: 61565, fullPremiumNoLTC: 103550, fullPremiumWithLTC: 123130 },
    // SMR: 1,150,000
    { minIncomeInclusive: 1115000, maxIncomeExclusive: 1175000, employeePremiumNoLTC: 54625, employeePremiumWithLTC: 64935, fullPremiumNoLTC: 109250, fullPremiumWithLTC: 129870 },
    // SMR: 1,210,000
    { minIncomeInclusive: 1175000, maxIncomeExclusive: 1235000, employeePremiumNoLTC: 57475, employeePremiumWithLTC: 68305, fullPremiumNoLTC: 114950, fullPremiumWithLTC: 136610 },
    // SMR: 1,270,000
    { minIncomeInclusive: 1235000, maxIncomeExclusive: 1295000, employeePremiumNoLTC: 60325, employeePremiumWithLTC: 71675, fullPremiumNoLTC: 120650, fullPremiumWithLTC: 143350 },
    // SMR: 1,330,000
    { minIncomeInclusive: 1295000, maxIncomeExclusive: 1355000, employeePremiumNoLTC: 63175, employeePremiumWithLTC: 75045, fullPremiumNoLTC: 126350, fullPremiumWithLTC: 150090 },
    // SMR: 1,390,000
    { minIncomeInclusive: 1355000, maxIncomeExclusive: Infinity, employeePremiumNoLTC: 66025, employeePremiumWithLTC: 78535, fullPremiumNoLTC: 132050, fullPremiumWithLTC: 157070 },
];