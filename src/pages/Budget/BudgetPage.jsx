
import React, { useState, useEffect, useRef } from "react";
import "./BudgetPage.css";
import { HiChevronUp } from "react-icons/hi";
import { FaSkullCrossbones, FaPlus } from "react-icons/fa";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { useNavigate, useLoaderData, Outlet, useSearchParams, useLocation, redirect, Link, useFetcher, useNavigation } from "react-router-dom";
import {BUDGET_ADD_FE_URL, BUDGET_FE_URL, get_add_budget, get_all_budget, get_update_budget} from '../../utils/APIHelper.js';
import {budgetHeaders, itemDetailHeaders, spentTypeEnum, paymentTypeEnum, itemCategoryEnum, enumFields, dateFields, validationBudgetFields} from '../../utils/constantHelper.js';
import { filterMapObject, getCurrentYear, getYearOption, isEffectivelyEmptyObject } from "../../utils/functionHelper.js";
import { buttonCSS, ddOptionCSS, errorTextCSS, inputddCSS, linkButtonCSS, spentTypeColorMap, tableCSS, tableRowCSS, tdCSS, theadCSS } from "../../utils/cssConstantHelper.js";
import LoadingTableComponent from "../../components/LoadingTable.jsx";
import UpdateItemComponent from "../../components/UpdateItem.jsx";
import { useAuth } from "../../hooks/AuthProvider.jsx";

const LOG_PREFIX = "BudgetPage::"

export async function action({ request }) {
  let formData = await request.formData();
  let intent = formData.get("intent");
  let redirectUrl = formData.get("redirectTo");
  const payload = {};
  let errors = {};
  let fieldValue
  budgetHeaders.map((header, idx) => (
    fieldValue = formData.get(intent+"-"+header.key),
    payload[header.key] = fieldValue,
    errors = {...errors, ...validateInputs(header, fieldValue, intent+"-")}
  ))
  if (Object.keys(errors).length > 0){
    return errors;
  }
  if (intent === "edit" && payload) {
    await get_update_budget(payload);
    return redirect(redirectUrl || BUDGET_FE_URL);
  }

  if (intent === "add" && payload) {
    await get_add_budget(payload);
    return redirect(redirectUrl || BUDGET_FE_URL);
  }
  return {}
}

function validateInputs(input, inputValue, prefix) {
  let inputError = {}
  if (prefix && prefix !== 'null-' && validationBudgetFields.includes(input.key)) {
    if (!inputValue || !inputValue.trim()) {
      inputError[prefix + input.key] = `${input.label} is required`;
    }
    if (prefix === 'edit-' && inputValue?.trim() && input.key === 'id' && (isNaN(Number(inputValue)))) {
      inputError[prefix + input.key] = `Not a valid ${input.label}`;
    } 
    if (prefix === 'add-') {
      delete inputError[prefix + 'id'];
    }
  }
  return inputError
}

export const loader = (auth) => async ({ request })  => {
  // const auth = useAuth();
  console.log("BudgetPage || auth at budgetPage loader", auth)
  const url = new URL(request.url);
  const q = url.searchParams;
  const response = (auth?.token && await get_all_budget(q.toString(), auth.token)) || [];
  let filteredBudgetData = []
  const pagination = response.pagination
  if (response.empty !== true) {
    filteredBudgetData = response.result
    return { filteredBudgetData, pagination };
  }
  return { filteredBudgetData, pagination }
}

export default function BudgetPage() {
  const updateIntent = "edit-"
  const addIntent = "add-"
  const defaulFiltertExtraKeys = ["selectedYear", "page", "exact", "between"];
  const visibleCount = 5;
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const { filteredBudgetData, pagination } = useLoaderData();
  const totalPages = pagination?.totalPages
  const currentPage = Math.min(pagination?.page, totalPages)

  const isAddPage = location.pathname.includes("add");

  let [searchParams, setSearchParams] = useSearchParams({selectedYear:getCurrentYear() , sort:"spentDate-asc"});
  const [searchKey, setSearchKey] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [selectedYear, setSelectedYear] = useState(searchParams.get("selectedYear") || getCurrentYear());
  const [sortColumn, setSortColumn] = useState(searchParams.get("sort")?.split("-")[0] || "spentDate");
  const [sortDirection, setSortDirection] = useState(searchParams.get("sort")?.split("-")[1] || "asc");
  const [globalParam, setGlobalParam] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 0);
  const [editRowId, setEditRowId] = useState(null);
  const [errors, setErrors] = useState(fetcher.data || {});
  const navigation = useNavigation();
  const [isCheckedSearch, setIsCheckedSearch] = useState(false);
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");

  const scrollTargetRef = useRef(null);

  let status = navigation.state;
  let isLoading = status !== "idle";
  
  const toggleExpand = (id) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  const extra_headers = [
    { label: "Actions", key: "actions" }
  ];

  const searchOptions = [...budgetHeaders];

  const handleSort = (columnKey) => {
    const isSameColumn = sortColumn === columnKey;
    const newDirection = isSameColumn && sortDirection === "asc" ? "desc" : "asc";
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
    let isExactSearchKey = "exact";
    let isExactSearchValue = isCheckedSearch;
    console.log("BudgetPage || handleAddParam", isEffectivelyEmptyObject(paramToAdd), " paramToAdd:", paramToAdd)
    if (dateFields.includes(searchKey) && isCheckedSearch) {
      searchParmValue = `${fromDate}:${toDate}`
      isExactSearchKey = "between"
    }
    if (searchParmValue && !isEffectivelyEmptyObject(paramToAdd)) {
      console.log("BudgetPage || handleAddParam1", isEffectivelyEmptyObject(paramToAdd), " paramToAdd:", paramToAdd)
      setGlobalParam((prev) => ({
        ...prev,
        [searchKeyParm]: searchParmValue,
        [isExactSearchKey]: isExactSearchValue,
        ...paramToAdd,
      }));
    } else if(searchParmValue) {
      console.log("BudgetPage || handleAddParam2", isEffectivelyEmptyObject(paramToAdd), " paramToAdd:", paramToAdd)
      setGlobalParam((prev) => ({
        ...prev,
        [searchKeyParm]: searchParmValue,
        [isExactSearchKey]: isExactSearchValue,
      }));
    } else if (!isEffectivelyEmptyObject(paramToAdd)) {
      console.log("BudgetPage || handleAddParam3", isEffectivelyEmptyObject(paramToAdd), " paramToAdd:", paramToAdd)
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
    if (Object.keys(filterMapObject(newParams, ...defaulFiltertExtraKeys)).length === 0){
      setSearchValue('')
    }
    setGlobalParam(newParams);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!errors || Object.keys(errors).length == 0) {
      setEditRowId(null)
    }
    let formData = new FormData(e.currentTarget.form);
    formData.append("redirectTo", `${BUDGET_FE_URL}?${searchParams.toString()}`)
    formData.append("intent", 'edit')
    fetcher.submit(formData, {
      method: "POST",
    });
  }

  const handleAddSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(e.currentTarget.form);
    formData.append("redirectTo", `${BUDGET_FE_URL}?${searchParams.toString()}`)
    formData.append("intent", 'add')
    fetcher.submit(formData, {
      method: "POST",
    });
  }

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
    setSearchParams(() => {
      const newSearchParams = new URLSearchParams();
      Object.entries(globalParam).forEach(([key, value]) => {
        newSearchParams.set(key, value);
      });
      if (Object.keys(globalParam).length > 0)
        return newSearchParams
      else {
        return new URLSearchParams({})
      }
    })
  }, [globalParam]);

  useEffect(() => {
    if (location.state?.scrollTo === 'add') {
      scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  
  return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Key Dropdown */}
            <select
              value={searchKey}
              onChange={(e) => {setSearchKey(e.target.value), setSearchValue('')}}
              className={`${inputddCSS}`}
            >
              {searchOptions.map(({key, label}) => (
                <option className={`${ddOptionCSS}`} key={key} value={key}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </option>
              ))}
            </select>

            {/* Search Inputs */}
            { dateFields.includes(searchKey) 
                    ? <><input
                      type="date"
                      placeholder="Search value"
                      value={isCheckedSearch ? fromDate : searchValue}
                      onChange={(e) => {isCheckedSearch ? setFromDate(e.target.value) : setSearchValue(e.target.value)}}
                      className={`${inputddCSS}`}
                    />
                    { isCheckedSearch 
                        ?
                          <>
                            <label>and</label>
                            <input
                              type="date"
                              placeholder="Search value"
                              value={toDate}
                              onChange={(e) => {setToDate(e.target.value)}}
                              className={`${inputddCSS}`}
                            /> 
                          </>
                        : <></>
                    }
                    </>
                    : enumFields.includes(searchKey) 
                      ? <select
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          className={`${inputddCSS}`}
                        >
                          <option className={`${ddOptionCSS}`} value="">Select</option>
                          {Object.entries(searchKey == 'spentType' ? spentTypeEnum : searchKey == 'itemType' ? itemCategoryEnum : paymentTypeEnum).map(([ddKey, ddLabel]) => (
                            <option className={`${ddOptionCSS}`} key={ddKey} value={ddKey}>
                              {ddLabel}
                            </option>
                          ))}
                        </select>
                      : <input
                      type="text"
                      placeholder="Search value"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className={`${inputddCSS}`}
                  />
            }
            {/* Add a checkbox */}
            <label >
              <input
                type="checkbox"
                checked={isCheckedSearch}
                onChange={handleCheckboxChange}
              />
              {dateFields.includes(searchKey) ? " between" :" Exact Search" }
            </label>
            {/* Add button to add multiple condition */}
            <button
                className={`${buttonCSS}`}
                onClick={(e) => {handleAddParam(e)}}
              >Add Search
            </button>
          </div>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => {setSelectedYear(e.target.value), handleAddParam(e, {selectedYear:e.target.value})}}
            className={`${inputddCSS}`}
          >
            <option className={`${ddOptionCSS}`} value="">All Year</option>
            {getYearOption().map((year) => (
              <option className={`${ddOptionCSS}`} key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>


        {Object.keys(filterMapObject(globalParam, ...defaulFiltertExtraKeys)).length !== 0 && 
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow border border-gray-200">

            {/* Dynamic Labels for Global Params */}
            <div className="flex flex-wrap gap-2">
              <div className="text-[1.125em] font-semibold mb-2">Filters:</div>
              {Object.entries(filterMapObject(globalParam, ...defaulFiltertExtraKeys)).map(([key, value]) => (
                <span
                  key={key}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-[0.875em] font-medium"
                >
                  {key}: {value}
                  <FaSkullCrossbones
                    onClick={(e) => {handleRemoveParam(e, key)}}
                    className="ml-4 text-indigo-500 hover:text-red-600 font-bold"
                  />
                </span>
              ))}
            </div>
          </div>
        }

        {/* Table */}
        <fetcher.Form method="post" >
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className={`${tableCSS}`}>
          <thead className={`${theadCSS}`}>
            <tr>
              {budgetHeaders.concat(extra_headers).map((header, idx) => (
                <th key={idx} className="px-4 py-4 whitespace-nowrap font-medium cursor-pointer"
                  onClick={(e) => {handleSort(header.key)}}
                >
                  {header.label}
                  {sortColumn === header.key && (
                      <HiChevronUp  
                        className={`inline-block h-5 w-5 ml-2 ${
                          sortDirection === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? <LoadingTableComponent /> :
                <>
                  {filteredBudgetData && filteredBudgetData.map((item, index) => (

                    <React.Fragment key={item.id}>
                      <tr
                        key={index}
                        className={`${editRowId === item['id'] ? '': spentTypeColorMap[item.spentType] || tableRowCSS}`}
                      >
                        {budgetHeaders.map((header, idx) => (
                          editRowId === item['id']
                          ? <td key={`${item.id}${header.key}`} className={`${tdCSS}`}>
                                {errors && errors[updateIntent+header.key] && <p className={`${errorTextCSS}`}>{errors[updateIntent+header.key]}</p>}
                                <UpdateItemComponent header={header} item={item}/>
                            </td>
                          : header.key == 'id' && item['transactionItems'] && item['transactionItems'].length > 0
                              ? <td key={`${item.id}${header.key}`} className={`${tdCSS}`}>
                                <label onClick={() => toggleExpand(item.id)} className="focus:outline-none cursor-pointer">
                                  <span>{item[header.key]}{expandedRow === item.id ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span>
                                </label>
                                </td>
                              : <td key={`${item.id}${header.key}`} className={`${tdCSS}`}>{item[header.key]}</td>
                        ))}
                        
                        <td className={`${tdCSS}`}>
                          {editRowId !== item['id'] 
                            ? <button onClick={(e) => {setEditRowId(item.id), e.preventDefault()}} className="text-blue-600 hover:underline">Update</button>
                            : <><button onClick={(e) => {handleUpdateSubmit(e)}} type="submit" name="intent" value="edit" className="text-blue-600 hover:underline">Y</button>
                              <button onClick={(e) => {setEditRowId(null), e.preventDefault()}} className="text-blue-600 hover:underline">X</button></>
                          }
                        </td>
                      </tr>
                      {expandedRow === item.id && item['transactionItems'] && (
                        <tr className="">
                            <td colSpan={budgetHeaders.length} className="px-6 py-4">
                              <div className="flex flex-wrap gap-4">
                                  {/* Example expanded content */}
                                  {item['transactionItems'].map((itemDetail, index) => (
                                    <div className="text-[0.875em] text-white">
                                      {itemDetailHeaders.map((itemDH, idx) => (
                                        <div>{itemDH.label}: {itemDetail[itemDH.key]}</div>
                                      ))}
                                    </div>
                                  ))}
                              </div>
                            </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                  )}
                  {!isAddPage && <tr className={`${tableRowCSS}`}>
                      {[...Array(budgetHeaders.length + 1)].map((_, idx) => {
                        return idx === budgetHeaders.length
                          ? <td key={`${idx}${budgetHeaders.key}`} className={`${tdCSS}`}>
                              {/* <button onClick={(e) => e.preventDefault()} className="hover:text-indigo-200" > */}
                                <Link className={`${linkButtonCSS}`} to={BUDGET_ADD_FE_URL+"?"+searchParams.toString()} 
                                  style={{color: 'inherit'}}
                                  >
                                    <FaPlus />
                                </Link>
                              {/* </button> */}
                            </td>
                          : <td key={`${idx}${budgetHeaders.key}`}></td>
                      })}
                  </tr>}
                  {isAddPage && <tr className={`${tableRowCSS}`} ref={scrollTargetRef} >
                  
                      <Outlet name="add" context={errors}/>
                      <td className={`${tdCSS} space-x-2`}>
                        <>
                            <button onClick={(e) => {handleAddSubmit(e)}} type="submit" name="intent" value="add" className="text-blue-600 hover:underline">Add</button>
                            <button onClick={(e) => {navigate(BUDGET_FE_URL+"?"+searchParams.toString()), resetErrorState(), e.preventDefault()}} className="text-blue-600 hover:underline">X</button>
                            </>
                      </td>
                  </tr>}
                </>
            }
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
              onClick={(e) => {setPage(pg), handleAddParam(e, {page:pg-1})}}
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
            onClick={() => setPage((p) => Math.min(p + visibleCount, totalPages))}
            disabled={getPageNumbers()[getPageNumbers().length- 1] === totalPages}
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