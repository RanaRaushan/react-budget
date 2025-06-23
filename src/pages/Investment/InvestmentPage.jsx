import React, { useState, useEffect, useRef } from 'react';
import './InvestmentPage.css';
import { HiChevronUp } from 'react-icons/hi';
import { FaSkullCrossbones, FaPlus } from 'react-icons/fa';
import {
  useNavigate,
  useLoaderData,
  Outlet,
  useSearchParams,
  useLocation,
  redirect,
  Link,
  useFetcher,
  useNavigation,
  useParams,
} from 'react-router-dom';
import {
  add_investments,
  BUDGET_ADD_INVESTMENT_FE_URL,
  BUDGET_INVESTMENT_FE_URL,
  download_all_investment,
  get_investments,
  remove_investments,
  update_investments,
} from '../../utils/APIHelper.js';
import {
  enumFields,
  dateFields,
  validationInvestmentFields,
  investmentHeaders,
  investmentTypeEnum,
  compoundingFrequencyEnum,
} from '../../utils/constantHelper.js';
import {
  filterMapObject,
  getFormatedDate,
  getYearOption,
  isEffectivelyEmptyObject,
} from '../../utils/functionHelper.js';
import {
  buttonCSS,
  ddOptionCSS,
  inputddCSS,
  linkButtonCSS,
  tableCSS,
  tableRowCSS,
  tdCSS,
  theadCSS,
} from '../../utils/cssConstantHelper.js';
import LoadingTableComponent from '../../components/LoadingTable.jsx';
import UpdateItemComponent from '../../components/UpdateItem.jsx';
import { useAuth } from '../../hooks/AuthProvider.jsx';
import DownloadBudgetComponent from '../../components/DownloadBudget.jsx';
import FormErrorsComponent from '../../components/FormErrors.jsx';

const LOG_PREFIX = 'InvestmentPage::';

const updateInvestmentIntent = 'investmentUpdate';
const addInvestmentIntent = 'investmentAdd';
const deleteInvestmentIntent = 'investmentDelete';

export async function action({ request }) {
  let formData = await request.formData();
  let intent = formData.get('intent');
  let redirectUrl = formData.get('redirectTo');
  const payload = {};
  let errors = {};
  let fieldValue;
  !(intent === deleteInvestmentIntent) &&
    investmentHeaders.map(
      (header, idx) => (
        (fieldValue = formData.get(intent + '-' + header.key)),
        (payload[header.key] = fieldValue),
        (errors = {
          ...errors,
          ...validateInputs(header, fieldValue, intent + '-'),
        })
      ),
    );
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  if (intent === updateInvestmentIntent && payload) {
    await update_investments(payload);
    return redirect(redirectUrl || BUDGET_INVESTMENT_FE_URL);
  }

  if (intent === addInvestmentIntent && payload) {
    await add_investments(payload);
    return redirect(redirectUrl || BUDGET_INVESTMENT_FE_URL);
  }

  if (intent === deleteInvestmentIntent && payload) {
    console.log('delete investment', payload);
    await remove_investments({}, formData.get('deleteInvestmentId'));
    return redirect(redirectUrl || BUDGET_INVESTMENT_FE_URL);
  }
  return {};
}

function validateInputs(input, inputValue, prefix) {
  let inputError = {};
  if (
    prefix &&
    prefix !== 'null-' &&
    validationInvestmentFields.includes(input.key)
  ) {
    if (!inputValue || !inputValue.trim() || inputValue.trim() === '') {
      inputError[prefix + input.key] = `${input.label} is required`;
    }
    if (
      prefix === updateInvestmentIntent + '-' &&
      inputValue?.trim() &&
      input.key === 'id' &&
      isNaN(Number(inputValue))
    ) {
      inputError[prefix + input.key] = `Not a valid ${input.label}`;
    }
    if (prefix === addInvestmentIntent + '-') {
      delete inputError[prefix + 'id'];
    }
  }
  return inputError;
}

export const loader =
  (auth) =>
  async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams;
    if (!q.has('selectedYear')) {
      q.set('selectedYear', 'all');
    }
    const response =
      (auth?.token && (await get_investments(q.toString()))) || [];
    let filteredInvestmentData = [];
    const pagination = response.pagination;
    const summary = response.summary;
    if (response.empty !== true) {
      filteredInvestmentData = response.result;
      return { filteredInvestmentData, pagination, summary };
    }
    return { filteredInvestmentData, pagination, summary };
  };

export default function InvestmentBudget() {
  const params = useParams();
  const auth = useAuth();
  const defaulFiltertExtraKeys = ['selectedYear', 'page', 'exact', 'between'];
  const visibleCount = 5;
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const { filteredInvestmentData, pagination, summary } = useLoaderData();
  const totalPages = pagination?.totalPages;
  // const currentPage = Math.min(pagination?.page, totalPages);

  const isAddInvestmentPage = location.pathname.includes('investment/add');

  let [searchParams, setSearchParams] = useSearchParams({
    selectedYear: 'all',
    sort: 'investmentDate-desc',
  });
  const [searchKey, setSearchKey] = useState('id');
  const [searchValue, setSearchValue] = useState('');
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get('selectedYear') || 'all',
  );
  const [sortColumn, setSortColumn] = useState(
    searchParams.get('sort')?.split('-')[0] || 'investmentDate',
  );
  const [sortDirection, setSortDirection] = useState(
    searchParams.get('sort')?.split('-')[1] || 'desc',
  );
  const [globalParam, setGlobalParam] = useState({
    selectedYear: 'all',
    sort: 'investmentDate-desc',
  });
  const [page, setPage] = useState(searchParams.get('page') || 0);
  const [editInvestmentRowId, setEditInvestmentRowId] = useState(-1);
  const [errors, setErrors] = useState(fetcher.data || {});
  const navigation = useNavigation();
  const [isCheckedSearch, setIsCheckedSearch] = useState(false);
  const [toDate, setToDate] = useState('');
  const [fromDate, setFromDate] = useState('');

  const scrollTargetAddInvestmentRef = useRef(null);

  let status = navigation.state;
  let isLoading = status !== 'idle';

  const extra_headers = [{ label: 'Actions', key: 'actions' }];

  const searchOptions = [...investmentHeaders];

  const handleSort = (columnKey) => {
    const isSameColumn = sortColumn === columnKey;
    const newDirection =
      isSameColumn && sortDirection === 'asc' ? 'desc' : 'asc';
    let toUpdateSort = false;
    if (columnKey != sortColumn) {
      setSortColumn(columnKey);
      toUpdateSort = true;
    }
    if (newDirection != sortDirection) {
      setSortDirection(newDirection);
      toUpdateSort = true;
    }

    if (toUpdateSort) {
      const sortingValue = `${columnKey}-${newDirection}`;
      setGlobalParam((prev) => ({
        ...prev,
        sort: sortingValue,
      }));
    }
  };

  const handleAddParam = (e, paramToAdd) => {
    e.preventDefault();
    let searchParmValue = `${searchValue}`;
    const searchKeyParm = `${searchKey}`;
    let isExactSearchKey = 'exact';
    let isExactSearchValue = isCheckedSearch;
    console.log(
      'InvestmentPage ||  handleAddParam',
      isEffectivelyEmptyObject(paramToAdd),
      ' paramToAdd:',
      paramToAdd,
    );
    if (dateFields.includes(searchKey) && isCheckedSearch) {
      searchParmValue = `${fromDate}:${toDate}`;
      isExactSearchKey = 'between';
    }
    if (searchParmValue && !isEffectivelyEmptyObject(paramToAdd)) {
      console.log(
        'InvestmentPage ||  handleAddParam1',
        isEffectivelyEmptyObject(paramToAdd),
        ' paramToAdd:',
        paramToAdd,
      );
      setGlobalParam((prev) => ({
        ...prev,
        [searchKeyParm]: searchParmValue,
        [isExactSearchKey]: isExactSearchValue,
        ...paramToAdd,
      }));
    } else if (searchParmValue) {
      console.log(
        'InvestmentPage ||  handleAddParam2',
        isEffectivelyEmptyObject(paramToAdd),
        ' paramToAdd:',
        paramToAdd,
      );
      setGlobalParam((prev) => ({
        ...prev,
        [searchKeyParm]: searchParmValue,
        [isExactSearchKey]: isExactSearchValue,
      }));
    } else if (!isEffectivelyEmptyObject(paramToAdd)) {
      console.log(
        'InvestmentPage ||  handleAddParam3',
        isEffectivelyEmptyObject(paramToAdd),
        ' paramToAdd:',
        paramToAdd,
      );
      setGlobalParam((prev) => ({
        ...prev,
        ...paramToAdd,
        [isExactSearchKey]: isExactSearchValue,
      }));
    }
  };

  const handleRemoveParam = (e, keyToRemove) => {
    e.preventDefault();
    const newParams = { ...globalParam };
    delete newParams[keyToRemove];
    if (
      Object.keys(filterMapObject(newParams, ...defaulFiltertExtraKeys))
        .length === 0
    ) {
      setSearchValue('');
    }
    setGlobalParam(newParams);
  };

  const checkIfAnyFormDataUpdated = (existingData, newFormData) => {
    const newFormDataWithUpdatedKey = Object.entries(newFormData).reduce(
      (acc, [key, value]) => {
        const newKey = key.split('-')[1];
        if (newKey) {
          acc[newKey] = value;
        }
        return acc;
      },
      {},
    );

    for (const header of investmentHeaders) {
      const key = header.key;
      if (dateFields.includes(key)) {
        if (
          getFormatedDate(existingData[key]) != newFormDataWithUpdatedKey[key]
        ) {
          return true;
        }
      } else if (
        newFormDataWithUpdatedKey[key] &&
        existingData[key] != newFormDataWithUpdatedKey[key]
      ) {
        return true;
      }
    }
    return false;
  };

  const updateInvestmentRowSubmit = (e, previousValue) => {
    e.preventDefault();
    let formData = new FormData(e.currentTarget.form);
    formData.append(
      'redirectTo',
      `${BUDGET_INVESTMENT_FE_URL}?${searchParams.toString()}`,
    );
    formData.append('intent', updateInvestmentIntent);
    if (
      checkIfAnyFormDataUpdated(previousValue, Object.fromEntries(formData))
    ) {
      fetcher.submit(formData, {
        method: 'POST',
      });
    } else {
      resetErrorState();
    }
    setEditInvestmentRowId(-1);
  };

  const deleteInvestmentRowSubmit = (e, id) => {
    e.preventDefault();
    console.log('calling delete');
    let formData = new FormData(e.currentTarget.form);
    formData.append(
      'redirectTo',
      `${BUDGET_INVESTMENT_FE_URL}?${searchParams.toString()}`,
    );
    formData.append('intent', deleteInvestmentIntent);
    formData.append('deleteInvestmentId', id);
    fetcher.submit(formData, {
      method: 'POST',
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(e.currentTarget.form);
    formData.append(
      'redirectTo',
      `${BUDGET_INVESTMENT_FE_URL}?${searchParams.toString()}`,
    );
    formData.append('intent', addInvestmentIntent);
    fetcher.submit(formData, {
      method: 'POST',
    });
  };

  const handleCheckboxChange = (e) => {
    setIsCheckedSearch(e.target.checked);
  };

  useEffect(() => {
    if (fetcher.data) {
      setErrors(fetcher.data);
    }
  }, [fetcher.data]);

  const resetErrorState = () => {
    setErrors(null);
  };

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const areSame =
      JSON.stringify(currentParams) === JSON.stringify(globalParam);
    console.log(
      'calling',
      areSame,
      JSON.stringify(currentParams),
      JSON.stringify(globalParam),
    );
    if (!areSame) {
      setSearchParams(() => {
        const newSearchParams = new URLSearchParams();
        Object.entries(globalParam).forEach(([key, value]) => {
          newSearchParams.set(key, value);
        });
        if (Object.keys(globalParam).length > 0) return newSearchParams;
        else {
          return new URLSearchParams({});
        }
      });
    }
  }, [globalParam]);

  useEffect(() => {
    if (location.state?.scrollTo === 'addInvestment') {
      scrollTargetAddInvestmentRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [location.state]);

  const getPageNumbers = () => {
    let start = Math.max(1, page - Math.floor(visibleCount / 2));
    let end = Math.min(totalPages, start + visibleCount - 1);

    start = Math.max(1, end - visibleCount + 1);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  const isInvestmentMatured = (matureLeftInDays) => {
    return matureLeftInDays <= 0;
  };
  const maturedCss =
    'bg-green-100 text-green-600 hover:bg-inherit hover:text-inherit';

  const fetchInvestmentDataToDownload = async () => {
    console.log('isnie fetchInvestmentDataToDownload', searchParams);
    const response =
      (auth?.token &&
        (await download_all_investment({
          data: Object.fromEntries(searchParams.entries()),
        }))) ||
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Key Dropdown */}
          <select
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value), setSearchValue('');
            }}
            className={`${inputddCSS}`}
          >
            {searchOptions.map(({ key, label }) => (
              <option className={`${ddOptionCSS}`} key={key} value={key}>
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </option>
            ))}
          </select>

          {/* Search Inputs */}
          {dateFields.includes(searchKey) ? (
            <>
              <input
                type="date"
                placeholder="Search value"
                value={isCheckedSearch ? fromDate : searchValue}
                onChange={(e) => {
                  isCheckedSearch
                    ? setFromDate(e.target.value)
                    : setSearchValue(e.target.value);
                }}
                className={`${inputddCSS}`}
              />
              {isCheckedSearch ? (
                <>
                  <label>and</label>
                  <input
                    type="date"
                    placeholder="Search value"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                    }}
                    className={`${inputddCSS}`}
                  />
                </>
              ) : (
                <></>
              )}
            </>
          ) : enumFields.includes(searchKey) ? (
            <select
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={`${inputddCSS}`}
            >
              <option className={`${ddOptionCSS}`} value="">
                Select
              </option>
              {Object.entries(
                searchKey == 'investmentType'
                  ? investmentTypeEnum
                  : compoundingFrequencyEnum,
              ).map(([ddKey, ddLabel]) => (
                <option className={`${ddOptionCSS}`} key={ddKey} value={ddKey}>
                  {ddLabel}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Search value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={`${inputddCSS}`}
            />
          )}
          {/* Add a checkbox */}
          <label>
            <input
              type="checkbox"
              checked={isCheckedSearch}
              onChange={handleCheckboxChange}
            />
            {dateFields.includes(searchKey) ? ' between' : ' Exact Search'}
          </label>
          {/* Add button to add multiple condition */}
          <button
            className={`${buttonCSS}`}
            onClick={(e) => {
              handleAddParam(e);
            }}
          >
            Add Search
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <>
            <DownloadBudgetComponent
              props={{ callbackData: fetchInvestmentDataToDownload, buttonText: "Dwonload" }}
            />
          </>
          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value),
                handleAddParam(e, { selectedYear: e.target.value });
            }}
            className={`${inputddCSS}`}
          >
            <option className={`${ddOptionCSS}`} value="all">
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

      {Object.keys(filterMapObject(globalParam, ...defaulFiltertExtraKeys))
        .length !== 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow border border-gray-200">
          {/* Dynamic Labels for Global Params */}
          <div className="flex flex-wrap gap-2">
            <div className="text-[1.125em] font-semibold mb-2">Filters:</div>
            {Object.entries(
              filterMapObject(globalParam, ...defaulFiltertExtraKeys),
            ).map(([key, value]) => (
              <span
                key={key}
                className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-[0.875em] font-medium"
              >
                {key}: {value}
                <FaSkullCrossbones
                  onClick={(e) => {
                    handleRemoveParam(e, key);
                  }}
                  className="ml-4 text-indigo-500 hover:text-red-600 font-bold"
                />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <fetcher.Form method="post">
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
          <table className={`${tableCSS}`}>
            <thead className={`${theadCSS}`}>
              <tr>
                {investmentHeaders.concat(extra_headers).map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-4 whitespace-nowrap font-medium cursor-pointer"
                    onClick={(e) => {
                      handleSort(header.key);
                    }}
                    title={`${header.key === 'investmentAmount' ? "Total Investment is: " + summary?.sumInvestmentAmount : ''}`}
                  >
                    {header.label}
                    {sortColumn === header.key && (
                      <HiChevronUp
                        className={`inline-block h-5 w-5 ml-2 ${
                          sortDirection === 'asc' ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingTableComponent
                  colLen={investmentHeaders.length + extra_headers.length}
                  rowLen={filteredInvestmentData?.length ?? 25 + 1}
                />
              ) : (
                <>
                  {filteredInvestmentData &&
                    filteredInvestmentData.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <tr
                          key={index}
                          className={`${
                            editInvestmentRowId &&
                            editInvestmentRowId === item['id']
                              ? ''
                              : (isInvestmentMatured(
                                  item['maturityTimeLeftInDays'],
                                ) &&
                                  maturedCss) ||
                                tableRowCSS
                          }`}
                        >
                          {investmentHeaders.map((header, idx) =>
                            editInvestmentRowId &&
                            editInvestmentRowId === item['id'] ? (
                              <td
                                key={`${item.id}${header.key}`}
                                className={`${tdCSS}`}
                              >
                                <FormErrorsComponent
                                  errors={errors}
                                  header={header}
                                  intent={updateInvestmentIntent}
                                />
                                <UpdateItemComponent
                                  header={header}
                                  item={item}
                                  intent={updateInvestmentIntent}
                                  formInputs={investmentHeaders}
                                />
                              </td>
                            ) : (
                              <td
                                key={`${item.id}${header.key}`}
                                className={`${tdCSS}`}
                              >
                                {header.key == 'period'
                                  ? (item[header.key] / 365).toFixed(1)
                                  : header.key == 'interestRate'
                                  ? item[header.key] + ' %'
                                  : item[header.key]}
                              </td>
                            ),
                          )}
                          {isInvestmentMatured(
                            item['maturityTimeLeftInDays'],
                          ) ? (
                            <td className={`${tdCSS}`}>
                              <button
                                onClick={(e) => {
                                  deleteInvestmentRowSubmit(e, item['id']),
                                    e.preventDefault();
                                }}
                                className="text-blue-600 hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          ) : (
                            <td className={`${tdCSS}`}>
                              {editInvestmentRowId &&
                              editInvestmentRowId !== item['id'] ? (
                                <button
                                  onClick={(e) => {
                                    setEditInvestmentRowId(item.id),
                                      e.preventDefault();
                                  }}
                                  className="text-blue-600 hover:underline"
                                >
                                  Update
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => {
                                      updateInvestmentRowSubmit(e, item);
                                    }}
                                    type="submit"
                                    name="intent"
                                    value="item-edit"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Y
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      resetErrorState();
                                      setEditInvestmentRowId(-1),
                                        e.preventDefault();
                                    }}
                                    className="text-blue-600 hover:underline"
                                  >
                                    X
                                  </button>
                                </>
                              )}
                            </td>
                          )}
                        </tr>
                      </React.Fragment>
                    ))}
                  {isAddInvestmentPage ? (
                    <tr
                      className={`${tableRowCSS}`}
                      ref={scrollTargetAddInvestmentRef}
                    >
                      <Outlet
                        name="addInvestment"
                        context={{ errors, intent: addInvestmentIntent }}
                      />
                      <td className={`${tdCSS} space-x-2`}>
                        <>
                          <button
                            onClick={(e) => {
                              handleAddSubmit(e);
                            }}
                            type="submit"
                            name="intent"
                            value="item-add"
                            className="text-blue-600 hover:underline"
                          >
                            Add
                          </button>
                          <button
                            onClick={(e) => {
                              resetErrorState(),
                                navigate(
                                  BUDGET_INVESTMENT_FE_URL +
                                    '?' +
                                    searchParams.toString(),
                                ),
                                e.preventDefault();
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            X
                          </button>
                        </>
                      </td>
                    </tr>
                  ) : (
                    <tr className={`${tableRowCSS}`}>
                      {[...Array(investmentHeaders.length + 1)].map(
                        (_, idx) => {
                          return idx === investmentHeaders.length ? (
                            <td
                              key={`${idx}${investmentHeaders.key}`}
                              className={`${tdCSS}`}
                            >
                              <Link
                                className={`${linkButtonCSS}`}
                                state={{ scrollTo: 'addInvestment' }}
                                to={
                                  BUDGET_ADD_INVESTMENT_FE_URL +
                                  '?' +
                                  searchParams.toString()
                                }
                                style={{ color: 'inherit' }}
                              >
                                <FaPlus />
                              </Link>
                            </td>
                          ) : (
                            <td key={`${idx}${investmentHeaders.key}`}></td>
                          );
                        },
                      )}
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - visibleCount, 1))}
              disabled={getPageNumbers()[0] === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            {getPageNumbers().map((pg) => (
              <button
                key={pg}
                onClick={(e) => {
                  setPage(pg), handleAddParam(e, { page: pg - 1 });
                }}
                className={`px-3 py-1 rounded ${
                  page === pg
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((p) => Math.min(p + visibleCount, totalPages))
              }
              disabled={
                getPageNumbers()[getPageNumbers().length - 1] === totalPages
              }
              className={`px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </div>
      </fetcher.Form>
    </div>
  );
}
