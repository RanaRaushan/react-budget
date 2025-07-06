import React, { useEffect, useState } from 'react';
import {
  BUDGET_EXPENSES_FE_URL,
  download_all_expenses,
  get_expenses,
} from '../../utils/APIHelper';
import {
  ddOptionCSS,
  inputCSS,
  inputddCSS,
  tableCSS,
  tableRowCSS,
  tdCSS,
  theadCSS,
} from '../../utils/cssConstantHelper';
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  itemCategoryEnum,
  monthNames,
  paymentTypeEnum,
  spentTypeEnum,
} from '../../utils/constantHelper';
import LoadingTableComponent from '../../components/LoadingTable';
import { getCurrentYear, getYearOption } from '../../utils/functionHelper';
import DownloadBudgetComponent from '../../components/exporting/DownloadBudget';
import { useAuth } from '../../hooks/AuthProvider';
import DataStore from '../../utils/DataStore';
import InputDropdownComponent from '../../components/customInput/InputDropdown';

export const loader =
  (auth) =>
  async ({ request, params }) => {
    // const auth = useAuth();
    const url = new URL(request.url);
    const q = url.searchParams;
    if (!q.has('selectedYear')) {
      q.set('selectedYear', getCurrentYear());
    }
    const response =
      (auth?.token && (await get_expenses(q.toString(), params.type))) || [];
    let categoryTypeExpense = [];
    let monthlyExpense = [];
    if (response.empty !== true) {
      categoryTypeExpense = response.categoryTypeExpense;
      monthlyExpense = response.monthlyExpense;
      return { categoryTypeExpense, monthlyExpense };
    }
    return { categoryTypeExpense, monthlyExpense };
  };

export default function ExpenseBudget() {
  const { getItem } = DataStore();
  const params = useParams();
  const auth = useAuth();
  let [searchParams, setSearchParams] = useSearchParams({
    selectedYear: getCurrentYear(),
  });
  const navigation = useNavigation();
  const navigate = useNavigate();
  let status = navigation.state;
  let isLoading = status !== 'idle';
  const { categoryTypeExpense, monthlyExpense } = useLoaderData();
  const suggestions = getItem('suggestions');
  const [input, setInput] = useState(searchParams.get('description') || '');
  const [debounced, setDebounced] = useState(input);

  const fetchExpensesDataToDownload = async () => {
    const response =
      (auth?.token &&
        (await download_all_expenses(
          {
            data: Object.fromEntries(searchParams.entries()),
          },
          params.type,
        ))) ||
      [];
    let data;
    let fileName = 'report.xlsx';
    if (response.empty !== true) {
      data = response.data;
      fileName = response.fileName;
      return { data, fileName };
    }
    return { data, fileName };
  };

    // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(input);
    }, 500); // Adjust debounce delay here

    return () => clearTimeout(timer);
  }, [input]);

    // Update searchParams after debounce
  useEffect(() => {
    setSearchParams((params) => {
      const newParams = new URLSearchParams(params);
      if (debounced) {
        newParams.set('description', debounced);
      } else {
        newParams.delete('description');
      }
      return newParams;
    });
  }, [debounced, setSearchParams]);
  const tdBorderCSS = 'border border-gray-300';
  const tdCornerDataCSS = 'font-bold';
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow border border-gray-200">
        <div className="flex flex-wrap items-center gap-4 ">
          {/* Add a checkbox */}
          <label>
            <input
              type="checkbox"
              onChange={(e) =>
                setSearchParams((param) => {
                  param.set('showPaidDate', e.target.checked);
                  return searchParams;
                })
              }
            />
            {' show Paid Date'}
          </label>
          <label>
            <input
              type="checkbox"
              onChange={(e) =>
                setSearchParams((param) => {
                  param.set('myShare', e.target.checked);
                  return searchParams;
                })
              }
            />
            {' My Share'}
          </label>

          <select
            value={params.type}
            onChange={(e) =>
              navigate(BUDGET_EXPENSES_FE_URL.replace('{type}', e.target.value))
            }
            className={`${inputddCSS}`}
          >
            {Object.keys(spentTypeEnum).map((expType) => (
              <option
                className={`${ddOptionCSS}`}
                key={expType}
                value={expType.toLowerCase()}
              >
                {expType}
              </option>
            ))}
          </select>

          <select
            value={searchParams.get('paymentType')}
            onChange={(e) =>
              setSearchParams((param) => {
                param.set('paymentType', e.target.value);
                return searchParams;
              })
            }
            className={`${inputddCSS}`}
          >
            {Object.entries(paymentTypeEnum).map(([ddKey, ddLabel]) => (
              <option className={`${ddOptionCSS}`} key={ddKey} value={ddKey}>
                {ddLabel}
              </option>
            ))}
          </select>
            <div className='relative'>
          <InputDropdownComponent
            props={{
              suggestion: suggestions['description'],
              placeholder: 'Description',
              name: `description`,
              value: input,
              onInputChange: ({id, summary}) => setInput(summary),
              className: `${inputCSS} relative`,
              showBtm: true
            }}
          /></div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <>
            <DownloadBudgetComponent
              props={{
                callbackData: fetchExpensesDataToDownload,
                buttonText: 'Dwonload',
              }}
            />
          </>

          {/* Year Dropdown */}
          <select
            value={searchParams.get('selectedYear')}
            onChange={(e) =>
              setSearchParams((param) => {
                param.set('selectedYear', e.target.value);
                return searchParams;
              })
            }
            className={`${inputddCSS}`}
          >
            <option className={`${ddOptionCSS}`} value="">
              All Year
            </option>
            {getYearOption().map((year) => (
              <option className={`${ddOptionCSS}`} key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className={`${tableCSS} `}>
          <thead className={`${theadCSS}`}>
            <tr>
              {[params.type?.toUpperCase()]
                .concat(monthNames)
                .concat(['Total'])
                .map((month, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-4 whitespace-nowrap font-medium cursor-pointer border ${tdBorderCSS} ${tdCornerDataCSS}`}
                  >
                    {month}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingTableComponent
                colLen={monthNames.length + 2}
                rowLen={Object.keys(itemCategoryEnum).length + 1}
              />
            ) : (
              <>
                {['Total']
                  .concat(Object.keys(itemCategoryEnum))
                  .map((item, index) => (
                    <React.Fragment key={item + index}>
                      <tr key={index} className={`${tableRowCSS}`}>
                        <td
                          key={`${item + index}`}
                          className={`${tdCSS} ${tdBorderCSS} ${tdCornerDataCSS}`}
                        >
                          {item}
                        </td>

                        {monthNames.concat(['Total']).map((month, idx) =>
                          month === 'Total' ? (
                            <td
                              key={`${item + index}`}
                              className={`${tdCSS} ${tdBorderCSS} ${tdCornerDataCSS}`}
                            >
                              {item === 'Total'
                                ? categoryTypeExpense?.categoryTypeExpenseTotal
                                : categoryTypeExpense?.itemCategoryAmounts[item]
                                    ?.itemCategoryMonthlyTotalAmount ?? 0}
                            </td>
                          ) : item === 'Total' ? (
                            <td
                              key={`${item + month + index}`}
                              className={`${tdCSS} ${tdBorderCSS} ${tdCornerDataCSS}`}
                            >
                              {monthlyExpense?.monthlyAmounts[
                                month.toUpperCase()
                              ]?.monthlyItemCategoryTotalAmount ?? 0}
                            </td>
                          ) : (
                            <td
                              key={`${item + month + index}`}
                              className={`${tdCSS} ${tdBorderCSS}`}
                            >
                              {categoryTypeExpense?.itemCategoryAmounts[item]
                                ?.monthlyWiseAmount[month.toUpperCase()] ?? 0}
                            </td>
                          ),
                        )}
                      </tr>
                    </React.Fragment>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
