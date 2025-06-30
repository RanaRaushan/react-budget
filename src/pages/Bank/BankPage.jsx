import { useState } from 'react';
import {
  get_bank_expenses,
} from '../../utils/APIHelper';
import {
  ddOptionCSS,
  inputddCSS,
} from '../../utils/cssConstantHelper';
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  spentTypeEnum,
} from '../../utils/constantHelper';
import { getCurrentYear, getYearOption } from '../../utils/functionHelper';
import BankTableComponent from '../../components/BankTable';

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
      (auth?.token && (await get_bank_expenses(q.toString(), params.type))) ||
      [];
    let bankExpenses = [];
    if (response.empty !== true && response.bankExpenses) {
      bankExpenses = response.bankExpenses;
      return { bankExpenses };
    }
    return { bankExpenses };
  };

export default function BankBudget() {
  const params = useParams();
  let [searchParams, setSearchParams] = useSearchParams({
    selectedYear: getCurrentYear(),
  });
  const navigation = useNavigation();
  const navigate = useNavigate();
  let status = navigation.state;
  let isLoading = status !== 'idle';
  const { bankExpenses } = useLoaderData();
  const [selectedExpense, setSelectedExpense] = useState('ALL');

  const tdBorderCSS = 'border border-gray-300';
  const tdCornerDataCSS = 'font-bold';
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedExpense}
            onChange={(e) => setSelectedExpense(e.target.value)}
            className={`${inputddCSS}`}
          >
            <option className={`${ddOptionCSS}`} value="ALL">
              Total
            </option>
            {Object.keys(spentTypeEnum)
              .concat(['All Expense'])
              .map((expType) => (
                <option
                  className={`${ddOptionCSS}`}
                  key={`${expType}`}
                  value={expType}
                >
                  {expType}
                </option>
              ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <select
          value={searchParams.get('selectedYear') ?? getCurrentYear()}
          onChange={(e) =>
            setSearchParams((param) => {
              param.set('selectedYear', e.target.value);
              return searchParams;
            })
          }
          className={`${inputddCSS}`}
        >
          {getYearOption().map((year) => (
            <option className={`${ddOptionCSS}`} key={`${year}`} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {Object.keys(spentTypeEnum)
        .concat(['ALL'])
        .filter(
          (spentKey) =>
            selectedExpense == 'All Expense' || spentKey == selectedExpense,
        )
        .map((expType, eidx) => (
          <BankTableComponent
            key={eidx}
            params={params}
            isLoading={isLoading}
            bankExpenses={bankExpenses[expType]}
            expType={expType}
          />
        ))}
    </div>
  );
}
