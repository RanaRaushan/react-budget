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
  budgetHeaders,
  dateFields,
  itemDetailHeaders,
} from '../../utils/constantHelper';
import { getFormatedDateFromString } from '../../utils/functionHelper';
import PieChartReportComponent from './Chart/PieChartReport';
import { get_analysis_report_data } from '../../utils/APIHelper';

export default function ReportAnalysisComponent({ props }) {
  const { callbackData, auth } = props;
  const [parentModal, setParentModal] = useState(false);
  const [chartType, setChartType] = useState('budgetGroupData');
  const [loading, setLoading] = useState(true);

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
          <PieChartReportComponent props={{ callbackData: fetchReportAnalysis }} />
        );
      case 'EISummary':
        
        return (
          <PieChartReportComponent props={{ callbackData: fetchReportAnalysis }} />
        );;
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
          <div className="bg-indigo-600 rounded-lg shadow-lg p-6  relative">
            <button
              className="absolute top-2 right-2 text-white-500 hover:text-red-500 text-xl font-bold"
              onClick={(e) => closeModalChart()}
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4">
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
            </h2>

            <div>{renderChart()}</div>
            {/* {activeReport && (
              <>
                <PieChart
                  series={[
                    {
                      arcLabel: (item) => `${item.value}`,
                      //   paddingAngle: 5,
                      arcLabelMinAngle: 10,
                      data: activeReport.map((data, idx) => {
                        return {
                          id: idx,
                          label: `${data.name} cost: ${data.totalCost} for count`,
                          value: data.groupedData.length,
                        };
                      }),
                    },
                  ]}
                  onItemClick={(event, d) =>
                    setSelected(activeReport[d.dataIndex])
                  }
                  width={800}
                  height={400}
                  hideLegend={true}
                />

                <div className="gap-x-6 gap-y-2 mt-4 max-w-3xl">
                  {Object.entries(activeReportGrouped).map(
                    ([groupKey, items]) => (
                      <div key={groupKey}>
                        <h3 className="font-bold text-xl mb-2 uppercase underline">
                          {groupKey}
                        </h3>
                        <ul className="space-y-1 text-sm">
                          <div className="flex flex-wrap gap-4 mb-4">
                            {items.map((item, idx) => (
                              <li
                                key={idx}
                                className="cursor-pointer hover:underline"
                                onClick={() => setSelected(item)}
                              >
                                <span className="font-medium capitalize">
                                  {item.name}:
                                </span>{' '}
                                {item.groupedData.length}
                              </li>
                            ))}
                          </div>
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              </>
            )}

            {selected && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                <div className="bg-indigo-500 p-6 rounded shadow-lg w-[90%] max-w-3xl relative">
                  <button
                    className="absolute top-2 right-2 text-white-500 hover:text-red-500 text-xl font-bold"
                    onClick={() => setSelected(null)}
                  >
                    X
                  </button>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      {selected.name} – Grouped Data (
                      {selected.groupedData.length})
                    </h3>
                    <p className="font-semibold mb-4">
                      Total cost: ₹{selected.totalCost}
                    </p>
                  </div>

                  <div className="overflow-auto max-h-96">
                    <table className={tableCSS}>
                      <thead className={theadCSS}>
                        <tr>
                          {(selected.key == 'budgetEntry'
                            ? itemDetailHeaders
                            : budgetHeaders
                          ).map((header, idx) => (
                            <th
                              key={idx}
                              className="px-4 py-4 whitespace-nowrap font-medium cursor-pointer"
                            >
                              {header.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selected?.groupedData &&
                          selected?.groupedData?.map((item, idx) => (
                            <tr key={idx} className={tableRowCSS}>
                              {(selected.key == 'budgetEntry'
                                ? itemDetailHeaders
                                : budgetHeaders
                              ).map((header, idx) => (
                                <td className={tdCSS}>
                                  {dateFields.includes(header.key)
                                    ? getFormatedDateFromString(
                                        item[header.key],
                                      )
                                    : header.key == 'unit'
                                    ? item[header.key]?.name
                                    : item[header.key]}
                                </td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}
