import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useMemo, useState } from 'react';
import {
  tableCSS,
  tableRowCSS,
  tdCSS,
  theadCSS,
} from '../../../utils/cssConstantHelper';
import {
  budgetHeaders,
  dateFields,
  itemDetailHeaders,
} from '../../../utils/constantHelper';
import { getFormatedDateFromString } from '../../../utils/functionHelper';

export default function PieChartReportComponent({ props }) {
  const { callbackData } = props;
  const [selected, setSelected] = useState(null);
  const [activeReport, setActiveReport] = useState(null);

  useEffect(() => {
    console.log('calling fetchData in useEffect');
    callbackData()
      .then((res) => setActiveReport(res))
      .catch((err) => console.error('Failed to fetch reports', err));
  }, []);

  // ✅ Group pieData by key
  const activeReportGrouped = useMemo(() => {
    return activeReport?.reduce((acc, item) => {
      acc[item.key] = acc[item.key] || [];
      acc[item.key].push(item);
      return acc;
    }, {});
  }, [activeReport]);

  return (
    <div>
      {
        <>
          {activeReport && (
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value}`,
                  //   paddingAngle: 5,
                  arcLabelMinAngle: 10,
                  data: activeReport?.map((data, idx) => {
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
          )}

          <div className="gap-x-6 gap-y-2 mt-4 max-w-3xl">
            {activeReportGrouped &&
              Object.entries(activeReportGrouped).map(([groupKey, items]) => (
                <div key={groupKey}>
                  <h3 className="font-bold text-xl mb-2 uppercase underline">
                    {groupKey}
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <div className="flex flex-wrap gap-4 mb-4">
                      {items &&
                        items.map((item, idx) => (
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
              ))}
          </div>
        </>
      }

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
