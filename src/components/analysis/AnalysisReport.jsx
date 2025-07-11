import { useEffect, useState } from 'react';
import { ddOptionCSS, inputddCSS } from '../../utils/cssConstantHelper';
import { getCurrentYear, getCurrentYearMonthName } from '../../utils/functionHelper';
import PieChartReportComponent from './Chart/PieChartReport';
import { get_analysis_report_data, get_expenses } from '../../utils/APIHelper';
import LineChartReportComponent from './Chart/LineChartReport';
import { monthNames } from '../../utils/constantHelper';

export default function ReportAnalysisComponent({ props }) {
  const { auth } = props;
  const [parentModal, setParentModal] = useState(false);
  const [chartType, setChartType] = useState('budgetGroupData');
  const [selectedMonthReport, setSelectedMonthReport] = useState(getCurrentYearMonthName());

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
            betweenDate: getMonthRangeFromName(selectedMonthReport),
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
            props={{
              callbackData: fetchReportAnalysis,
              selectedMonth: selectedMonthReport,
            }}
          />
        );
      case 'EISummary':
        return (
          <LineChartReportComponent
            props={{
              callbackData: fetchExpenseSummaryReport,
              selectedMonth: selectedMonthReport,
            }}
          />
        );
    }
  };

  function getMonthRangeFromName(monthName) {
    if (!monthName) return;
    const year = getCurrentYear();
    const monthIndex = monthNames.indexOf(monthName);
    console.log(monthIndex, monthName);
    if (monthIndex === -1) throw new Error('Invalid month name');

    const month = monthIndex + 1; // Convert to 1-based month (1 = January)

    const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;

    // Get last day of the month using Date
    const lastDayDate = new Date(year, month, 0); // day 0 of next month = last day of this month
    const lastDay = `${year}-${String(month).padStart(2, '0')}-${String(
      lastDayDate.getDate(),
    ).padStart(2, '0')}`;

    return `${firstDay}:${lastDay}`;
  }

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
            <div className="flex flex-col w-min mx-auto gap-2">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className={`${inputddCSS}`}
              >
                {Object.entries(reportDDOption).map(
                  ([ddkey, { key, label }]) => (
                    <option
                      className={`${ddOptionCSS}`}
                      key={ddkey}
                      value={key}
                    >
                      {label}
                    </option>
                  ),
                )}
              </select>
              <select
                value={selectedMonthReport}
                onChange={(e) => setSelectedMonthReport(e.target.value)}
                className={`${inputddCSS}`}
              >
                {monthNames.map((month, idx) => (
                  <option className={`${ddOptionCSS}`} key={idx} value={month}>
                    {month} - {getCurrentYear()}
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-4">{renderChart()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
