
import React, { useState, useEffect } from "react";
import "./homePage.css";
import { HiChevronUp } from "react-icons/hi";
import { FaSkullCrossbones } from "react-icons/fa";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { useNavigate, useLoaderData } from "react-router-dom";
import {get} from '../utils/APIHelper.js';
import {budgetHeaders, itemDetailHeaders, spentTypeEnum, paymentTypeEnum, itemCategoryEnum, enumFields, dateFields} from '../utils/Helper.js';




export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams;
  const filteredBudgetData = await get("/budget", q.toString()) || [];
  return { filteredBudgetData };
}


export default function HomePage() {
  const navigate = useNavigate();
  const { filteredBudgetData } = useLoaderData();
  // console.log("filteredBudgetData", filteredBudgetData)

  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  const [searchKey, setSearchKey] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [sortColumn, setSortColumn] = useState("spentDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [globalParam, setGlobalParam] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);

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

  const handleSearch = (newParams) => {
    // const sortingValue = `${sortColumn}-${sortDirection}`;
    const selectedYearParmVal = `${selectedYear}`;
    const params = new URLSearchParams({
      selectedYear: selectedYearParmVal,
      // sortingValue: sortingValue,
      ...newParams
    });
    console.log("calling search", params.toString())
    navigate(`/?${params.toString()}`);
  };

  const handleAddParam = (e) => {
    e.preventDefault();
    const searchParmValue = `${searchValue}`;
    const searchKeyParm = `${searchKey}`;
    if (searchParmValue){
      setGlobalParam((prev) => ({
        ...prev,
        [searchKeyParm]: searchParmValue,
      }));
    }
  };

  const handleRemoveParam = (e, keyToRemove) => {
    e.preventDefault();
    const newParams = { ...globalParam };
    delete newParams[keyToRemove];
    setGlobalParam(newParams);
  };

  useEffect(() => {
    handleSearch(globalParam)
    return () => clearTimeout(globalParam)
  }, [globalParam]);

  
  return (
      <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Key Dropdown */}
          <select
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
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
          onChange={(e) => setSelectedYear(e.target.value)}
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


      {Object.keys(globalParam).length !== 0 && 
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow border border-gray-200">

          {/* Dynamic Labels for Global Params */}
          <div className="flex flex-wrap gap-2">
            <div className="text-lg font-semibold mb-2">Filters:</div>
            {Object.entries(globalParam).map(([key, value]) => (
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
          {filteredBudgetData.map((item, index) => (
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
                  <button className="text-blue-600 hover:underline">Edit</button>
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
          ))}
        </tbody>
      </table>
    </div>
    </div>
    );
  }