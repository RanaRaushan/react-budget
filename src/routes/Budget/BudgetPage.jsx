
import React, { useState, useEffect } from "react";
import "./BudgetPage.css";
import { HiChevronUp } from "react-icons/hi";
import { FaSkullCrossbones } from "react-icons/fa";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { useNavigate, useLoaderData, Outlet, useParams, useSearchParams, useLocation, Form, useFormAction, useActionData, redirect } from "react-router-dom";
import {get, post} from '../../utils/APIHelper.js';
import {budgetHeaders, itemDetailHeaders, spentTypeEnum, paymentTypeEnum, itemCategoryEnum, enumFields, dateFields, validationBudgetFields} from '../../utils/constantHelper.js';
import { filterMapObject, isEffectivelyEmpty } from "../../utils/functionHelper.js";


export async function action({ request }) {
  let formData = await request.formData();
  let intent = formData.get("intent");
  const payload = {};
  let errors = {};
  budgetHeaders.map((header, idx) => (
    payload[header.key] = formData.get(header.key),
    errors = {...errors, ...validateInputs(header, formData.get(header.key), intent+"-")}
  ))
  if (Object.keys(errors).length){
    return errors;
  }
  if (intent === "edit") {
    await post("/budget/update-transaction", payload);
    return redirect("/budget");
  }

  if (intent === "add") {
    await post("/budget/add-transaction", payload);
    return redirect("/budget");
  }

  throw json(
    { message: "Invalid intent" },
    { status: 400 }
  );
}

function validateInputs(input, inputValue, prefix) {
  let inputError = {}
  if (validationBudgetFields.includes(input.key)) {
    if (!inputValue || !inputValue.trim()) {
      inputError[prefix + input.key] = `${input.label} is required`;
    }
  }
  console.log('inputError', inputError)
  return inputError
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams;
  const response = await get("/budget", q.toString()) || [];
  // console.log("res", response)
  let filteredBudgetData = []
  const totalPages = response.totalPages
  const currentPage = Math.min(response.number, totalPages)
  if (response.empty !== true) {
    filteredBudgetData = response.content
    return { filteredBudgetData, currentPage, totalPages };
  }
  return { filteredBudgetData, currentPage, totalPages }
}

export default function BudgetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const errors = useActionData();
  const { filteredBudgetData, currentPage, totalPages } = useLoaderData();

  const isAddPage = location.pathname.includes("add");
  console.log("location", location.pathname)
  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  let [searchParams, setSearchParams] = useSearchParams({selectedYear:currentYear, sort:"spentDate-asc"});
  const [searchKey, setSearchKey] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [selectedYear, setSelectedYear] = useState(searchParams.get("selectedYear") || currentYear);
  const [sortColumn, setSortColumn] = useState(searchParams.get("sort")?.split("-")[0] || "spentDate");
  const [sortDirection, setSortDirection] = useState(searchParams.get("sort")?.split("-")[1] || "asc");
  const [globalParam, setGlobalParam] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 0);
  const [shouldNavigate, setShouldNavigate] = useState(true);
  // const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const visibleCount = 5;

  const toggleExpand = (id) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  // Generate years from 2024 to current year
  const yearOptions = [];
  for (let year = 2023; year <= currentYear; year++) {
    yearOptions.push(year);
  }
  const extra_headers = [
    { label: "Actions", key: "actions" }
  ];

  const spentTypeColorMap = {
    EXPENSE: "bg-red-100 text-red-600 hover:bg-inherit hover:text-inherit",
    OTHER: "bg-yellow-100 text-yellow-600 hover:bg-inherit hover:text-inherit",
    INCOME: "bg-blue-100 text-blue-600 hover:bg-inherit hover:text-inherit",
    SELF_TRANSFER_OUT: "bg-green-100 text-green-600 hover:bg-inherit hover:text-inherit",
    SELF_TRANSFER_IN: "bg-green-100 text-green-600 hover:bg-inherit hover:text-inherit",
  };

  const searchOptions = [...budgetHeaders];

  const handleSort = (columnKey) => {
    const isSameColumn = sortColumn === columnKey;
    const newDirection = isSameColumn && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(columnKey);
    setSortDirection(newDirection);
    
    const sortingValue = `${sortColumn}-${sortDirection}`;
    setGlobalParam((prev) => ({
      ...prev,
      sort: sortingValue,
    }));
  };

  const handleAddParam = (e, paramToAdd) => {
    e.preventDefault();
    const searchParmValue = `${searchValue}`;
    const searchKeyParm = `${searchKey}`;

    if (searchParmValue && isEffectivelyEmpty(paramToAdd)) {
      setGlobalParam((prev) => ({
        ...prev,
        [searchKeyParm]: searchParmValue,
        ...paramToAdd,
      }));
    } else if(searchParmValue) {
      setGlobalParam((prev) => ({
        ...prev,
        [searchKeyParm]: searchParmValue,
      }));
    } else if (isEffectivelyEmpty(paramToAdd)) {
      setGlobalParam((prev) => ({
        ...prev,
        ...paramToAdd,
      }));
    }
  };

  const handleRemoveParam = (e, keyToRemove) => {
    e.preventDefault();
    const newParams = { ...globalParam };
    delete newParams[keyToRemove];
    if (Object.keys(filterMapObject(newParams, "selectedYear", "page")).length === 0){
      setSearchValue('')
    }
    setGlobalParam(newParams);
  };

  useEffect(() => {
    // handleSearch(globalParam)
    setSearchParams(p => {Object.entries(globalParam).map(([key, value]) => p.set(key, value))})
    // setShouldNavigate(false)
    console.log("useEffect calling navigate", searchParams.toString())
    if (!isAddPage)
    navigate(`/budget?${searchParams.toString()}`);
    // return () => clearTimeout(globalParam, searchParams)
  }, [isAddPage, searchParams, globalParam]);
  

  const handleSearch = (newParams) => {
    const params = new URLSearchParams({
      ...newParams
    });
    console.log("calling search", params.toString())
    navigate(`/budget?${params.toString()}`);
  };

  const getPageNumbers = () => {
    // const visibleCount = 5;
    let start = Math.max(1, page - Math.floor(visibleCount / 2));
    let end = Math.min(totalPages, start + visibleCount - 1);

    // console.log("start, end", start, end)
    // Adjust start again if not enough pages at the end
    start = Math.max(1, end - visibleCount + 1);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    // console.log(pages)
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
              className="border border-gray-300 bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {searchOptions.map(({key, label}) => (
                <option key={key} value={key}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </option>
              ))}
            </select>

            {/* Search Inputs */}
            { dateFields.includes(searchKey) 
                    ? <input
                      type="date"
                      placeholder="Search value"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    : enumFields.includes(searchKey) 
                      ? <select
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          className="border border-gray-300 bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          {Object.entries(searchKey == 'spentType' ? spentTypeEnum : searchKey == 'itemType' ? itemCategoryEnum : paymentTypeEnum).map(([ddKey, ddLabel]) => (
                            <option key={ddKey} value={ddKey}>
                              {ddLabel}
                            </option>
                          ))}
                        </select>
                      : <input
                      type="text"
                      placeholder="Search value"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
            }
            {/* Add button to add multiple condition */}
            <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
                onClick={(e) => {handleAddParam(e)}}
              >Add Search
            </button>
          </div>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => {setSelectedYear(e.target.value), handleAddParam(e, {selectedYear:e.target.value})}}
            className="border border-gray-300 bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {/* <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
            onClick={(e) => handleSearch(e)}
          >🔍
          </button> */}
        </div>


        {Object.keys(filterMapObject(globalParam, "selectedYear", "page")).length !== 0 && 
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow border border-gray-200">

            {/* Dynamic Labels for Global Params */}
            <div className="flex flex-wrap gap-2">
              <div className="text-lg font-semibold mb-2">Filters:</div>
              {Object.entries(filterMapObject(globalParam, "selectedYear", "page")).map(([key, value]) => (
                <span
                  key={key}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
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
        <Form method="post" >
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-100">
          <thead className="bg-indigo-600 text-white uppercase tracking-wide">
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
            {filteredBudgetData && filteredBudgetData.map((item, index) => (

              <React.Fragment key={item.id}>
                <tr
                  key={index}
                  className={`${spentTypeColorMap[item.spentType] || 'hover:bg-indigo-50 hover:text-indigo-700'} border-t border-gray-200 transition-all duration-150 whitespace-nowrap`}
                >
                  {budgetHeaders.map((header, idx) => (
                    header.key == 'id' && item['itemDetail'] && item['itemDetail'].length > 0
                    ? <td key={header.key} className="px-4 py-4">
                      <label onClick={() => toggleExpand(item.id)} className="focus:outline-none cursor-pointer">
                        <span>{item[header.key]}{expandedRow === item.id ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span>
                      </label>
                      </td>
                    : <td key={header.key} className="px-4 py-4">{item[header.key]}</td>
                  ))}
                  
                  <td className="px-6 py-4">
                    <button type="submit" name="intent" value="edit" className="text-blue-600 hover:underline">Edit</button>
                  </td>
                </tr>
                {expandedRow === item.id && item['itemDetail'] && (
                  <tr className="">
                      <td colSpan={budgetHeaders.length} className="px-6 py-4">
                        <div className="flex flex-wrap gap-4">
                            {/* Example expanded content */}
                            {item['itemDetail'].map((itemDetail, index) => (
                              <div className="text-sm text-white">
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
            
            <tr className={`border-t border-gray-200 transition-all duration-150 whitespace-nowrap`}>
            
                {budgetHeaders.map((header, idx) => (
                  <td key={header.key} className="px-2 py-4">     
                    {errors && errors[header.key] && <p className="text-red-500">{errors[header.key]}</p>}
                    <Outlet context={header}/>
                  </td>
                ))}
                <td className="px-6 py-4">
                  {isAddPage && <button type="submit" name="intent" value="add" className="text-blue-600 hover:underline">Add</button>}
                </td>
            </tr>
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - visibleCount, 1))}
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      </Form>
    </div>
    
    );
  }