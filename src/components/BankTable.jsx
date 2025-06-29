import React from 'react';
import {
  accountTypeEnum,
  budgetHeaders,
  itemCategoryEnum,
  monthNames,
  paymentTypeEnum,
} from '../utils/constantHelper';
import {
  spentTypeColorMap,
  buttonCSS,
  ddOptionCSS,
  errorTextCSS,
  inputCSS,
  inputddCSS,
  tableCSS,
  tableRowCSS,
  tdCSS,
  theadCSS,
} from '../utils/cssConstantHelper';
import LoadingTableComponent from './LoadingTable';

const LOG_PREFIX = 'UpdateBudgetPage::';

export default function BankTableComponent({
  params,
  isLoading,
  bankExpenses,
  expType,
}) {
  const tdBorderCSS = 'border border-gray-300';
  const tdCornerDataCSS = 'font-bold';

  const bankList = Object.entries(accountTypeEnum).concat([["monthlyTotalAmount", "Totals"]])
  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className={`${tableCSS} `}>
          <thead className={`${theadCSS}`}>
            <tr>
              {[expType.toUpperCase()].concat(monthNames).map((month, idx) => (
                <th
                  key={`${idx}${month}${expType}`}
                  className={`px-4 py-4 whitespace-nowrap font-medium cursor-pointer border ${tdBorderCSS} ${tdCornerDataCSS}`}
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingTableComponent colLen={monthNames.length + 1} rowLen={bankList.length + 1}/>
            ) : (
              <>
                {bankList.map(([bankId, bankName], bidx) => (
                  <React.Fragment key={`${bankId}${bidx}${expType}`}>
                    <tr key={`${bankId}${expType}`} className={`${tableRowCSS}`}>
                      <td
                        key={`${bankId}${bankName}${expType}`}
                        className={`${tdCSS} ${tdBorderCSS} ${tdCornerDataCSS}`}
                      >
                        {bankName}
                      </td>
                      {monthNames.map((month, midx) => (
                        bankName === "Totals" 
                        ? <td
                          key={`${bankId}${month}${midx}${expType}`}
                          className={`${tdCSS} ${tdBorderCSS} ${tdCornerDataCSS} ${month.toUpperCase()} ${bankId} ${bankExpenses?.monthlyRecords[month.toUpperCase()]?.bankData[bankId]}`}
                        >
                          {bankExpenses?.monthlyRecords[month.toUpperCase()]?.[bankId] ?? 0}
                        </td>
                        : <td
                          key={`${bankId}${month}${midx}${expType}`}
                          className={`${tdCSS} ${tdBorderCSS} ${tdCornerDataCSS} ${month.toUpperCase()} ${bankId} ${bankExpenses?.monthlyRecords[month.toUpperCase()]?.bankData[bankId]}`}
                        >
                          {bankExpenses?.monthlyRecords[month.toUpperCase()]?.bankData[bankId] ?? 0}
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
