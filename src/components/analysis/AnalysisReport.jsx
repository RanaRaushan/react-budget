import { LineChart } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useMemo, useState } from 'react';
import {
  ddOptionCSS,
  inputddCSS,
  tableCSS,
  tableRowCSS,
  tdCSS,
  theadCSS,
} from '../../utils/cssConstantHelper';
import {
  getCurrentYear,
  getFormatedDateFromString,
} from '../../utils/functionHelper';
import PieChartReportComponent from './Chart/PieChartReport';
import { get_analysis_report_data, get_expenses } from '../../utils/APIHelper';
import LineChartReportComponent from './Chart/LineChartReport';
import { SpinnerDotted } from 'spinners-react';

export default function ReportAnalysisComponent({ props }) {
  const { auth } = props;
  const [parentModal, setParentModal] = useState(false);
  const [chartType, setChartType] = useState('budgetGroupData');

  const fetchExpenseSummaryReport = async (expenseType) => {
    const response =
      (auth?.token &&
        (await get_expenses(
          new URLSearchParams({ selectedYear: getCurrentYear() }).toString(),
          expenseType,
        ))) ||
      [];
    if (response.empty !== true) {
      return response;
    }
    return { response };
  };

  const fetchReportAnalysis = async () => {
    const response =
      (auth?.token &&
        (await get_analysis_report_data(
          new URLSearchParams({
            betweenDate: '2025-06-01:2025-06-30',
          }).toString(),
        ))) ||
      [];
    return response;
  };

  const closeModalChart = () => {
    setParentModal(null);
  };

  const renderChart = () => {
    switch (chartType) {
      case 'budgetGroupData':
        console.log('calling ReportChartComponent');
        return (
          <PieChartReportComponent
            props={{ callbackData: fetchReportAnalysis }}
          />
        );
      case 'EISummary':
        return (
          <LineChartReportComponent
            props={{ callbackData: fetchExpenseSummaryReport }}
          />
        );
    }
  };

  const reportDDOption = [
    { key: 'budgetGroupData', label: 'Budget - Grouped Data Chart' },
    { key: 'EISummary', label: 'Expense-Income Summary' },
  ];
  return (
    <div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={(e) => setParentModal(true)}
      >
        {'View Chart'}
      </button>

      {/* Parent Modal */}
      {parentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-indigo-600 rounded-lg shadow-lg p-6 relative w-full max-w-4xl max-h-screen overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-white-500 hover:text-red-500 text-xl font-bold"
              onClick={(e) => closeModalChart()}
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4"> Select Analysis report</h2>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className={`${inputddCSS}`}
            >
              {Object.entries(reportDDOption).map(([ddkey, { key, label }]) => (
                <option className={`${ddOptionCSS}`} key={ddkey} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <div>{renderChart()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
