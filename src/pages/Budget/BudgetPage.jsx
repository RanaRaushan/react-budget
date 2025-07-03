import React, { useState, useEffect, useRef } from 'react';
import './BudgetPage.css';
import { HiChevronUp } from 'react-icons/hi';
import { FaSkullCrossbones, FaPlus } from 'react-icons/fa';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { MdOutlineDoubleArrow } from 'react-icons/md';
import { TbCopyPlusFilled } from 'react-icons/tb';
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
  BUDGET_ADD_FE_URL,
  BUDGET_FE_URL,
  BUDGET_TRANSACTION_ENTRY_ADD_FE_URL,
  download_budget,
  get_add_budget,
  get_add_budget_detail_entry,
  get_add_bulk_budget_detail_entry,
  get_all_budget,
  get_budget_suggestions,
  get_data_by_ocr,
  get_update_budget,
  get_update_budget_detail_entry,
} from '../../utils/APIHelper.js';
import {
  budgetHeaders,
  itemDetailHeaders,
  spentTypeEnum,
  paymentTypeEnum,
  itemCategoryEnum,
  enumFields,
  dateFields,
  validationUpdateBudgetFields,
  validationAddBudgetFields,
  validationAddBudgetDetailEntryFields,
  validationUpdateBudgetDetailEntryFields,
} from '../../utils/constantHelper.js';
import {
  filterMapObject,
  getCurrentYear,
  getFormatedDate,
  getYearOption,
  isEffectivelyEmptyObject,
} from '../../utils/functionHelper.js';
import {
  buttonCSS,
  ddOptionCSS,
  errorTextCSS,
  inputddCSS,
  linkButtonCSS,
  spentTypeColorMap,
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
import BulkddBudgetEntryPage from './Bulk-AddBudgetEntryPage.jsx';
import DataStore from '../../utils/DataStore.js';
import { validateGenericInput } from '../../utils/InputValidationHelper.js';
import UploadDataByOCRComponent from '../../components/DataFromOCR.jsx';
import TooltipIconComponent from '../../components/TooltipIcon.jsx';

const LOG_PREFIX = 'BudgetPage::';

const addItemIntent = 'itemAdd';
const updateItemIntent = 'itemUpdate';
const addItemDetailIntent = 'itemDetailAdd';
const updateItemDetailIntent = 'itemDetailUpdate';
const addBulkItemDetailIntent = 'bulkItemDetailAdd';

const intentToValidationMap = {
  [addItemIntent]: validationAddBudgetFields,
  [updateItemIntent]: validationUpdateBudgetFields,
  [addItemDetailIntent]: validationAddBudgetDetailEntryFields,
  [updateItemDetailIntent]: validationUpdateBudgetDetailEntryFields,
  [addBulkItemDetailIntent]: validationAddBudgetDetailEntryFields,
};

const intentToHeadersMap = {
  [addItemIntent]: budgetHeaders,
  [updateItemIntent]: budgetHeaders,
  [addItemDetailIntent]: itemDetailHeaders,
  [updateItemDetailIntent]: itemDetailHeaders,
};

export async function action({ request }) {
  let formData = await request.formData();
  let intent = formData.get('intent');
  let redirectUrl = formData.get('redirectTo');
  const payload = {};
  let errors = {};
  let fieldValue;
  intentToHeadersMap[intent]?.map(
    (header, idx) => (
      (fieldValue = formData.get(intent + '-' + header.key)),
      (payload[header.key] = fieldValue),
      (errors = {
        ...errors,
        ...validateGenericInput(
          header,
          fieldValue,
          intent + '-',
          intentToValidationMap[intent + '-'.split('-')[0]],
        ),
      })
    ),
  );
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  if (intent === updateItemIntent && payload) {
    await get_update_budget(payload);
    return redirect(redirectUrl || BUDGET_FE_URL);
  }

  if (intent === updateItemDetailIntent && payload) {
    payload['item'] = formData.get('parentItemId');
    await get_update_budget_detail_entry(payload);
    return redirect(redirectUrl || BUDGET_FE_URL);
  }

  if (intent === addItemIntent && payload) {
    await get_add_budget(payload);
    return redirect(redirectUrl || BUDGET_FE_URL);
  }

  if (intent === addItemDetailIntent && payload) {
    payload['item'] = formData.get('parentItemId');
    await get_add_budget_detail_entry(payload);
    return redirect(redirectUrl || BUDGET_FE_URL);
  }
  return {};
}

export const loader =
  (auth) =>
  async ({ request }) => {
    const { getItem, setItem } = DataStore();
    const url = new URL(request.url);
    const q = url.searchParams;
    if (!q.has('selectedYear')) {
      q.set('selectedYear', getCurrentYear());
    }
    const response =
      (auth?.token && (await get_all_budget(q.toString()))) || [];
    let filteredBudgetData = [];
    const pagination = response.pagination;
    const summary = response.summary;
    let suggestions = {};
    if (response.empty !== true) {
      suggestions =
        getItem('suggestions') ||
        (auth?.token && (await get_budget_suggestions())) ||
        {};
      suggestions && !suggestions?.error && setItem('suggestions', suggestions);
      filteredBudgetData = response.result;
      return { filteredBudgetData, pagination, summary, suggestions };
    }
    return { filteredBudgetData, pagination, summary, suggestions };
  };

export default function BudgetPage() {
  const params = useParams();
  const auth = useAuth();
  const defaulFiltertExtraKeys = ['selectedYear', 'page', 'exact', 'between'];
  const visibleCount = 5;
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const { filteredBudgetData, pagination, summary, suggestions } =
    useLoaderData();
  const totalPages = pagination?.totalPages;
  // const currentPage = Math.min(pagination?.page, totalPages);

  const isAddBudgetPage = location.pathname.includes('budget/add');
  const isAddBudgetEntryPage = location.pathname.includes('budget/entry/add');

  let [searchParams, setSearchParams] = useSearchParams({
    selectedYear: getCurrentYear(),
    sort: 'spentDate-desc',
  });
  const [searchKey, setSearchKey] = useState('description');
  const [searchValue, setSearchValue] = useState('');
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get('selectedYear') || getCurrentYear(),
  );
  const [sortColumn, setSortColumn] = useState(
    searchParams.get('sort')?.split('-')[0] || 'spentDate',
  );
  const [sortDirection, setSortDirection] = useState(
    searchParams.get('sort')?.split('-')[1] || 'desc',
  );
  const [globalParam, setGlobalParam] = useState({});
  const [expandedRow, setExpandedRow] = useState(params.entryId);
  const [page, setPage] = useState(searchParams.get('page') || 0);
  const [editBudgetRowId, setEditBudgetRowId] = useState(null);
  const [editTransactionItemRowId, setEditTransactionItemRowId] =
    useState(null);
  const [errors, setErrors] = useState(fetcher.data || {});
  const navigation = useNavigation();
  const [isCheckedSearch, setIsCheckedSearch] = useState(false);
  const [toDate, setToDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [bulkDetailEntryAddCheck, setBulkDetailEntryAddCheck] = useState(false);
  const [budgetDetailEntryInputRows, setBudgetDetailEntryInputRows] = useState(
    [],
  );
  // console.log("searchParams", searchParams)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollTargetAddBudgetRef = useRef(null);
  const scrollTargetAddBudgetEntryRef = useRef(null);

  let status = navigation.state;
  let isLoading = status !== 'idle';

  const toggleExpand = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const extra_headers = [{ label: 'Actions', key: 'actions' }];

  const searchOptions = [...budgetHeaders];

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
    if (dateFields.includes(searchKey) && isCheckedSearch) {
      searchParmValue = `${fromDate}:${toDate}`;
      isExactSearchKey = 'between';
    }
    if (searchParmValue && !isEffectivelyEmptyObject(paramToAdd)) {
      setGlobalParam((prev) => ({
        ...prev,
        [searchKeyParm]: searchParmValue,
        [isExactSearchKey]: isExactSearchValue,
        ...paramToAdd,
      }));
    } else if (searchParmValue) {
      setGlobalParam((prev) => ({
        ...prev,
        [searchKeyParm]: searchParmValue,
        [isExactSearchKey]: isExactSearchValue,
      }));
    } else if (!isEffectivelyEmptyObject(paramToAdd)) {
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
    const combinedHeaders = budgetHeaders.concat(itemDetailHeaders);

    for (const header of combinedHeaders) {
      const key = header.key;

      if (dateFields.includes(key)) {
        if (
          getFormatedDate(existingData[key]) != newFormDataWithUpdatedKey[key]
        ) {
          return true;
        }
      } else if (
        existingData[key] &&
        existingData[key] != newFormDataWithUpdatedKey[key]
      ) {
        return true;
      }
    }
    return false;
  };

  const updateBudgetRowSubmit = (e, previousValue) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    let formData = new FormData(e.currentTarget.form);
    formData.append(
      'redirectTo',
      `${BUDGET_FE_URL}?${searchParams.toString()}`,
    );
    formData.append('intent', updateItemIntent);
    if (
      checkIfAnyFormDataUpdated(previousValue, Object.fromEntries(formData))
    ) {
      fetcher.submit(formData, {
        method: 'POST',
      });
    } else {
      resetErrorState();
    }
    setEditBudgetRowId(null);
    setIsSubmitting(false);
  };

  const updateTransactionItemRowSubmit = (e, previousValue, parentId) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    let formData = new FormData(e.currentTarget.form);
    formData.append(
      'redirectTo',
      `${BUDGET_FE_URL}?${searchParams.toString()}`,
    );
    formData.append('intent', updateItemDetailIntent);
    formData.append(`parentItemId`, parentId);
    if (
      checkIfAnyFormDataUpdated(previousValue, Object.fromEntries(formData))
    ) {
      fetcher.submit(formData, {
        method: 'POST',
      });
    } else {
      resetErrorState();
    }
    setEditTransactionItemRowId(null);
    setIsSubmitting(false);
  };

  const handleAddBudgetRowSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    let formData = new FormData(e.currentTarget.form);
    formData.append(
      'redirectTo',
      `${BUDGET_FE_URL}?${searchParams.toString()}`,
    );
    formData.append('intent', addItemIntent);
    fetcher.submit(formData, {
      method: 'POST',
    });
    setIsSubmitting(false);
  };

  const handleAddBudgetEntryRowSubmit = (e, parentId) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    let formData = new FormData(e.currentTarget.form);
    formData.append(
      'redirectTo',
      `${BUDGET_FE_URL}?${searchParams.toString()}`,
    );
    formData.append('intent', addItemDetailIntent);
    formData.append(`parentItemId`, parentId);
    fetcher.submit(formData, {
      method: 'POST',
    });
    setIsSubmitting(false);
  };

  const handleAddBudgetEntry = (e) => {
    if (bulkDetailEntryAddCheck) {
      e.preventDefault();
      setBudgetDetailEntryInputRows((prev) => [...prev, ...[createRow()]]);
    }
  };
  const createRow = () => {
    return itemDetailHeaders.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {});
  };

  const handleBulkEntryChange = (index, field, value) => {
    setBudgetDetailEntryInputRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const removeFromBulkEntryRow = (indexToRemove) => {
    const updatedInputRows = budgetDetailEntryInputRows.filter(
      (_, idx) => idx !== indexToRemove,
    );
    setBudgetDetailEntryInputRows(updatedInputRows);
  };

  const handleAddBulkBudgetEntryRowSubmit = async (e, parentId) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const updatedForms = budgetDetailEntryInputRows.map((row, idx) => {
      let currentErrors = {};
      for (const header of itemDetailHeaders) {
        const key = header.key;
        currentErrors = {
          ...currentErrors,
          ...validateGenericInput(
            header,
            row[key],
            addBulkItemDetailIntent + '-',
            intentToValidationMap[addBulkItemDetailIntent + '-'.split('-')[0]],
          ),
        };
      }
      row['item'] = parentId;
      return { ...row, errors: currentErrors };
    });
    setBudgetDetailEntryInputRows(updatedForms);
    const key = 'errors';
    const hasNoErrors = updatedForms.every((obj) => {
      return (
        obj.hasOwnProperty(key) &&
        obj[key] !== '' &&
        obj[key] !== null &&
        obj[key] !== undefined
      );
    });
    if (budgetDetailEntryInputRows?.length && hasNoErrors) {
      delete budgetDetailEntryInputRows[errors];
      await get_add_bulk_budget_detail_entry(budgetDetailEntryInputRows).then(
        (res) => navigate(BUDGET_FE_URL + '?' + searchParams.toString()),
      );
    }
    if (hasNoErrors) resetInputRowsState();
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (fetcher.data) {
      setErrors(fetcher.data);
    }
  }, [fetcher.data]);

  const resetErrorState = () => {
    setErrors({});
  };
  const resetInputRowsState = () => {
    setBudgetDetailEntryInputRows([]);
  };

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const areSame =
      JSON.stringify(currentParams) === JSON.stringify(globalParam);
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
    if (location.state?.scrollTo === 'addBudget') {
      scrollTargetAddBudgetRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (location.state?.scrollTo === 'addBudgetEntry' || isAddBudgetEntryPage) {
      scrollTargetAddBudgetEntryRef.current?.scrollIntoView({
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

  const fetchBudgetDataToDownload = async () => {
    const response =
      (auth?.token &&
        (await download_budget(
          { data: Object.fromEntries(searchParams.entries()) },
          auth.token,
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
                searchKey == 'spentType'
                  ? spentTypeEnum
                  : searchKey == 'itemType'
                  ? itemCategoryEnum
                  : paymentTypeEnum,
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddParam(e);
              }}
              className={`${inputddCSS}`}
            />
          )}
          {/* Add a checkbox */}
          <label>
            <input
              type="checkbox"
              checked={isCheckedSearch}
              onChange={(e) => setIsCheckedSearch(e.target.checked)}
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
              props={{
                callbackData: fetchBudgetDataToDownload,
                buttonText: 'Dwonload',
              }}
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
        <div className="overflow-visible rounded-2xl shadow-lg border border-gray-200">
          <table className={`${tableCSS}`}>
            <thead className={`${theadCSS}`}>
              <tr>
                {budgetHeaders.concat(extra_headers).map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-4 whitespace-nowrap font-medium cursor-pointer"
                    title={`${
                      header.key === 'paidAmount'
                        ? `Your total pay: ${summary?.sumPaidAmount}`
                        : header.key === 'amount'
                        ? `You paid: ${summary?.sumAmount}`
                        : header.key === 'id'
                        ? `total count is ${pagination?.totalCount}`
                        : ''
                    }`}
                    onClick={(e) => {
                      handleSort(header.key);
                    }}
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
                <LoadingTableComponent colLen={budgetHeaders.length + 1} />
              ) : (
                <>
                  {filteredBudgetData &&
                    filteredBudgetData.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <tr
                          key={index}
                          className={`${
                            editBudgetRowId === item['id']
                              ? ''
                              : spentTypeColorMap[item.spentType] || tableRowCSS
                          }`}
                        >
                          {budgetHeaders.map((header, idx) =>
                            editBudgetRowId === item['id'] ? (
                              <td
                                key={`${item.id}${header.key}`}
                                className={`${tdCSS}`}
                              >
                                <FormErrorsComponent
                                  errors={errors}
                                  header={header}
                                  intent={updateItemIntent}
                                />
                                <UpdateItemComponent
                                  props={{
                                    header: header,
                                    item: item,
                                    intent: updateItemIntent,
                                    errors: errors,
                                    suggestion: {
                                      description:
                                        suggestions?.description ?? [],
                                    },
                                  }}
                                />
                              </td>
                            ) : header.key == 'id' ? (
                              <td
                                key={`${item.id}${header.key}`}
                                className={`${tdCSS}`}
                              >
                                <label
                                  onClick={() => toggleExpand(item.id)}
                                  className="focus:outline-none cursor-pointer"
                                >
                                  <span>
                                    {item[header.key]}
                                    {expandedRow == item.id ? (
                                      <IoMdArrowDropdown />
                                    ) : item['transactionItems'].length ? (
                                      <MdOutlineDoubleArrow />
                                    ) : (
                                      <IoMdArrowDropright />
                                    )}
                                  </span>
                                </label>
                              </td>
                            ) : header.key == 'paidAmount' ? (
                              <td
                                key={`${item.id}${header.key}`}
                                className={`${tdCSS}`}
                              >
                                <span className="flex flex-row gap-2 items-center justify-center">
                                  {item[header.key]}
                                  <TooltipIconComponent
                                    message={item.errors?.[header.key]}
                                  />
                                </span>
                              </td>
                            ) : (
                              <td
                                key={`${item.id}${header.key}`}
                                className={`${tdCSS}`}
                              >
                                {item[header.key]}
                              </td>
                            ),
                          )}

                          <td className={`${tdCSS}`}>
                            {editBudgetRowId !== item['id'] ? (
                              <button
                                onClick={(e) => {
                                  setEditBudgetRowId(item.id),
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
                                    updateBudgetRowSubmit(e, item);
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
                                    setEditBudgetRowId(null),
                                      e.preventDefault();
                                  }}
                                  className="text-blue-600 hover:underline"
                                >
                                  X
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                        {expandedRow == item.id && item['transactionItems'] && (
                          <tr className="">
                            <td
                              key={item.id}
                              colSpan={budgetHeaders.length + 1}
                              className="px-6 py-4"
                            >
                              <div className="">
                                {/* Example expanded content */}
                                <table className={`${tableCSS}`}>
                                  <thead className={`${theadCSS}`}>
                                    <tr
                                      ref={
                                        params.entryId == item.id
                                          ? scrollTargetAddBudgetEntryRef
                                          : null
                                      }
                                    >
                                      {itemDetailHeaders
                                        .concat(extra_headers)
                                        .map((itemDH, idx) => (
                                          <th
                                            key={idx}
                                            className={`${tdCSS}`}
                                            title={`${
                                              itemDH.key === 'id'
                                                ? `Total Entry count for this order is: ${item['transactionItems']?.length}`
                                                : ''
                                            }`}
                                          >
                                            {itemDH.label}
                                          </th>
                                        ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item['transactionItems'].map(
                                      (itemDetail, index) => (
                                        <tr
                                          key={index}
                                          className={`${itemDetail['id']}`}
                                        >
                                          {itemDetailHeaders.map(
                                            (itemDH, idx) =>
                                              editTransactionItemRowId ===
                                              itemDetail['id'] ? (
                                                <td
                                                  key={`${itemDetail.id}${itemDH.key}`}
                                                  className={`${tdCSS}`}
                                                >
                                                  <FormErrorsComponent
                                                    errors={errors}
                                                    header={itemDH}
                                                    intent={
                                                      updateItemDetailIntent
                                                    }
                                                  />

                                                  <UpdateItemComponent
                                                    props={{
                                                      header: itemDH,
                                                      item: itemDetail,
                                                      intent:
                                                        updateItemDetailIntent,
                                                        errors: errors,
                                                      suggestion: {
                                                        description:
                                                          suggestions?.description ??
                                                          [],
                                                      },
                                                    }}
                                                  />
                                                </td>
                                              ) : (
                                                <td
                                                  key={idx}
                                                  className={`${tdCSS}`}
                                                >
                                                  {itemDH.key == 'unit'
                                                    ? itemDetail[itemDH.key]
                                                        ?.name
                                                    : itemDetail[itemDH.key]}
                                                </td>
                                              ),
                                          )}
                                          <td className={`${tdCSS}`}>
                                            {editTransactionItemRowId !==
                                            itemDetail['id'] ? (
                                              <button
                                                onClick={(e) => {
                                                  setEditTransactionItemRowId(
                                                    itemDetail.id,
                                                  ),
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
                                                    updateTransactionItemRowSubmit(
                                                      e,
                                                      itemDetail,
                                                      item['id'],
                                                    );
                                                  }}
                                                  type="submit"
                                                  name="intent"
                                                  value="itemDetail-edit"
                                                  className="text-blue-600 hover:underline"
                                                >
                                                  Y
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    setEditTransactionItemRowId(
                                                      null,
                                                    ),
                                                      e.preventDefault();
                                                  }}
                                                  className="text-blue-600 hover:underline"
                                                >
                                                  X
                                                </button>
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      ),
                                    )}
                                    {bulkDetailEntryAddCheck && (
                                      <BulkddBudgetEntryPage
                                        props={{
                                          errors,
                                          intent: addBulkItemDetailIntent,
                                          inputRows: budgetDetailEntryInputRows,
                                          onChange: handleBulkEntryChange,
                                          onRemove: removeFromBulkEntryRow,
                                          suggestion: {
                                            itemName:
                                              suggestions?.itemEntryName ?? [],
                                            category:
                                              suggestions?.entryCategory ?? [],
                                          },
                                        }}
                                      />
                                    )}
                                    {isAddBudgetEntryPage &&
                                    !bulkDetailEntryAddCheck &&
                                    params.entryId == item.id ? (
                                      <tr className={`${tableRowCSS}`}>
                                        <Outlet
                                          name="addBudgetEntry"
                                          context={{
                                            errors,
                                            intent: addItemDetailIntent,
                                            suggestion: {
                                              itemName:
                                                suggestions?.itemEntryName ??
                                                [],
                                              category:
                                                suggestions?.entryCategory ??
                                                [],
                                            },
                                          }}
                                        />
                                        <td className={`${tdCSS} space-x-2`}>
                                          <>
                                            <button
                                              onClick={(e) => {
                                                handleAddBudgetEntryRowSubmit(
                                                  e,
                                                  item['id'],
                                                );
                                              }}
                                              type="submit"
                                              name="intent"
                                              value="itemEntry-add"
                                              className="text-blue-600 hover:underline"
                                            >
                                              Add
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                resetErrorState(),
                                                  navigate(
                                                    BUDGET_FE_URL +
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
                                      <>
                                        <tr className={`${tableRowCSS}`}>
                                          {[
                                            ...Array(
                                              itemDetailHeaders.length + 1,
                                            ),
                                          ].map((_, idx) => {
                                            return idx ===
                                              itemDetailHeaders.length ? (
                                              <td
                                                key={`${idx}${itemDetailHeaders.key}`}
                                                className={`${tdCSS}`}
                                              >
                                                <Link
                                                  className={`${linkButtonCSS}`}
                                                  state={{
                                                    scrollTo: 'addBudgetEntry',
                                                  }}
                                                  onClick={(e) =>
                                                    handleAddBudgetEntry(e)
                                                  }
                                                  to={
                                                    BUDGET_TRANSACTION_ENTRY_ADD_FE_URL.replace(
                                                      '{entryId}',
                                                      item.id,
                                                    ) +
                                                    '?' +
                                                    searchParams.toString()
                                                  }
                                                  style={{ color: 'inherit' }}
                                                >
                                                  <FaPlus title="Add Entry" />
                                                </Link>
                                              </td>
                                            ) : (
                                              <td
                                                key={`${idx}${itemDetailHeaders.key}`}
                                              ></td>
                                            );
                                          })}
                                        </tr>
                                      </>
                                    )}
                                    <tr>
                                      <td
                                        colSpan={itemDetailHeaders.length + 1}
                                        className="text-center space-x-2"
                                      >
                                        <label className="inline-flex items-center gap-1">
                                          <input
                                            type="checkbox"
                                            checked={bulkDetailEntryAddCheck}
                                            onChange={(e) =>
                                              setBulkDetailEntryAddCheck(
                                                e.target.checked,
                                              )
                                            }
                                          />
                                          {'Bulk Add'}
                                        </label>
                                        {bulkDetailEntryAddCheck ? (
                                          <div className="flex flex-col items-center gap-2">
                                            <Link
                                              title="Add all entry"
                                              className={`${linkButtonCSS}`}
                                              state={{
                                                scrollTo: 'addBudgetEntry',
                                              }}
                                              onClick={(e) =>
                                                handleAddBulkBudgetEntryRowSubmit(
                                                  e,
                                                  item['id'],
                                                )
                                              }
                                              style={{ color: 'inherit' }}
                                            >
                                              <span className="flex items-center gap-1">
                                                Add all items
                                                <TbCopyPlusFilled />
                                              </span>
                                            </Link>
                                            <UploadDataByOCRComponent
                                              onDataFetched={
                                                setBudgetDetailEntryInputRows
                                              }
                                            />
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}

                  {isAddBudgetPage ? (
                    <tr
                      className={`${tableRowCSS}`}
                      ref={scrollTargetAddBudgetRef}
                    >
                      <Outlet
                        name="addBudget"
                        context={{
                          errors,
                          intent: addItemIntent,
                          suggestion: {
                            description: suggestions?.description ?? [],
                          },
                        }}
                      />
                      <td className={`${tdCSS} space-x-2`}>
                        <>
                          <button
                            onClick={(e) => {
                              handleAddBudgetRowSubmit(e);
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
                                  BUDGET_FE_URL + '?' + searchParams.toString(),
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
                      {[...Array(budgetHeaders.length + 1)].map((_, idx) => {
                        return idx === budgetHeaders.length ? (
                          <td
                            key={`${idx}${budgetHeaders.key}`}
                            className={`${tdCSS}`}
                          >
                            {/* <button onClick={(e) => e.preventDefault()} className="hover:text-indigo-200" > */}
                            <Link
                              className={`${linkButtonCSS}`}
                              state={{ scrollTo: 'addBudget' }}
                              to={
                                BUDGET_ADD_FE_URL +
                                '?' +
                                searchParams.toString()
                              }
                              style={{ color: 'inherit' }}
                            >
                              <FaPlus />
                            </Link>
                            {/* </button> */}
                          </td>
                        ) : (
                          <td key={`${idx}${budgetHeaders.key}`}></td>
                        );
                      })}
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
