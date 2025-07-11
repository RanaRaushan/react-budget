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
import { SpinnerDotted } from 'spinners-react';

export default function PieChartReportComponent({ props }) {
  const { callbackData, selectedMonth, selectedOwner } = props;
  const [selected, setSelected] = useState(undefined);
  const [activeReport, setActiveReport] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callbackData();
        setActiveReport(res);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth]);

  // 🔑 Add escape key listener
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelected(null);
      }
    };

    if (selected) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [selected]); // run effect when modal opens/closes

  // ✅ Group pieData by key
  const activeReportGrouped = useMemo(() => {
    return (
      activeReport &&
      activeReport?.reduce((acc, item) => {
        acc[item.key] = acc[item.key] || [];
        acc[item.key].push(item);
        return acc;
      }, {})
    );
  }, [activeReport]);

  const filteredActiveReportGrouped = useMemo(() => {
    if (!activeReportGrouped) return {};

    return Object.entries(activeReportGrouped).reduce((acc, [key, items]) => {
      const filtered =
        selectedOwner === 'All'
          ? items
          : Object.entries(items)
              .map(([key, groupedItem]) => {
                const filteredGroup =
                  groupedItem.groupedData?.filter(
                    (item) => item.owner === selectedOwner,
                  ) || [];
                return filteredGroup.length > 0
                  ? {
                      ...groupedItem,
                      groupedData: filteredGroup,
                    }
                  : null;
              })
              .filter(Boolean);

      if (filtered?.length > 0) {
        acc[key] = filtered;
      }

      return acc;
    }, {});
  }, [activeReport, selectedOwner]);

  const computeCostForSelectedFilterData = (selectedData) => {
    const totalAmount = selectedData.groupedData.reduce(
      (sum, item) => sum + (item.itemPrice || item.paidAmount || 0),
      0,
    );
    const roundedTotal = parseFloat(totalAmount.toFixed(2));
    return roundedTotal;
  };

  const computeCostForFilterData = (dataList) => {
    const totalAmount = dataList
      .flatMap((data) => data.groupedData || [])
      .reduce((sum, item) => sum + (item.itemPrice || item.paidAmount || 0), 0);
    const roundedTotal = parseFloat(totalAmount.toFixed(2));
    return roundedTotal;
  };

  const pieChartFilteredData = Object.values(
    filteredActiveReportGrouped,
  ).flat();

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center min-h-96 w-full">
          <SpinnerDotted
            size={50}
            thickness={150}
            speed={100}
            color="rgba(255, 255, 255, 1)"
          />
        </div>
      ) : (
        <>
          {pieChartFilteredData && (
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value}`,
                  //   paddingAngle: 5,
                  arcLabelMinAngle: 10,
                  data: pieChartFilteredData.map((data, idx) => {
                    return {
                      id: idx,
                      label: `${
                        data.name
                      } cost: ${computeCostForSelectedFilterData(
                        data,
                      )} for count`,
                      value: data.groupedData.length,
                    };
                  }),
                },
              ]}
              onItemClick={(event, d) =>
                setSelected(pieChartFilteredData[d.dataIndex])
              }
              width={800}
              height={400}
              hideLegend={true}
            />
          )}

          <div className="gap-x-6 gap-y-2 mt-4 max-w-3xl">
            {activeReportGrouped &&
              filteredActiveReportGrouped &&
              Object.entries(filteredActiveReportGrouped).map(
                ([groupKey, items]) => (
                  <div key={groupKey}>
                    <h3 className="font-bold text-xl mb-2 uppercase underline">
                      {groupKey} - ({computeCostForFilterData(items)})
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
                              {`${item.groupedData.length} `}(
                              {
                                <span className="text-red-400 font-bold">
                                  ₹{computeCostForSelectedFilterData(item)}
                                </span>
                              }{' '}
                              )
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
                {selected.name} - Grouped Data ({selected.groupedData.length})
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
                    selected?.groupedData?.map((item, gdidx) => (
                      <tr key={gdidx} className={tableRowCSS}>
                        {(selected.key == 'budgetEntry'
                          ? itemDetailHeaders
                          : budgetHeaders
                        ).map((header, hidx) => (
                          <td className={tdCSS} key={hidx}>
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
