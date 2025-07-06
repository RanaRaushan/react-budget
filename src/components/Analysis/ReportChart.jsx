import { LineChart } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useMemo, useState } from 'react';
import {
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

export default function ReportChartComponent({ props }) {
  const { callbackData } = props;
  const [selected, setSelected] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReportData = async (e) => {
    e.preventDefault();
    setLoading(true);
    callbackData() // your real API
      .then((res) => openChart(res))
      .catch((err) => console.error('Failed to fetch reports', err));
  };

  // ✅ Group pieData by key
  const activeReportGrouped = useMemo(() => {
    return activeReport?.reduce((acc, item) => {
      acc[item.key] = acc[item.key] || [];
      acc[item.key].push(item);
      return acc;
    }, {});
  }, [activeReport]);

  const openChart = (report) => {
    setLoading(false);
    setActiveReport(report);
  };
  const closeChart = () => setActiveReport(null);
  console.log('selected', selected, JSON.stringify(selected));
  return (
    <div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={(e) => fetchReportData(e)}
      >
        {loading ? 'Analyzing...' : 'View Chart'}
      </button>

      {/* Chart Modal */}
      {activeReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-indigo-600 rounded-lg shadow-lg p-6  relative">
            <button
              className="absolute top-2 right-2 text-white-500 hover:text-red-500 text-xl font-bold"
              onClick={closeChart}
            >
              X
            </button>

            <h2 className="text-xl font-bold mb-4">
              {'Budget'} - Grouped Data Chart
            </h2>

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
              onItemClick={(event, d) => setSelected(activeReport[d.dataIndex])}
              width={800}
              height={400}
              hideLegend={true}
            />
            {/* ✅ Custom Legend Grid */}
            <div className="gap-x-6 gap-y-2 mt-4 max-w-3xl">
              {Object.entries(activeReportGrouped).map(([groupKey, items]) => (
                <div key={groupKey}>
                  <h3 className="font-bold text-xl mb-2 uppercase underline">
                    {groupKey}
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <div className="flex flex-wrap gap-4 mb-4">
                      {items.map((item) => (
                        <li
                          key={item.id}
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
              ))}

              {/* {activeReport.map((item) => (
                <div
                  key={item.id}
                  className="text-sm cursor-pointer hover:underline"
                  onClick={() => setSelected(item)}
                >
                  <span className="font-medium">{item.name}:</span>{' '}
                  {item.groupedData.length}
                </div>
              ))} */}
            </div>
          </div>
        </div>
      )}
      {/* Modal for selected item */}
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
                {selected.name} – Grouped Data ({selected.groupedData.length})
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
                              ? getFormatedDateFromString(item[header.key])
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
      )}
    </div>
  );
}
