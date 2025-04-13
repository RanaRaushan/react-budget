import React, { useState } from "react";

const StylishTableWithSearch = ({ data }) => {
  const [searchKey, setSearchKey] = useState("name");
  const [searchValue1, setSearchValue1] = useState("");
  const [searchValue2, setSearchValue2] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const searchOptions = ["name", "email", "role", "status"];
  const yearOptions = ["2023", "2024", "2025"];

  const headers = ["ID", "Name", "Email", "Role", "Status", "Created At", "Actions"];

  const handleEdit = (item) => {
    alert(`Editing ${item.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Key Dropdown */}
          <select
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {searchOptions.map((key) => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>

          {/* Search Inputs */}
          <input
            type="text"
            placeholder="Search value 1"
            value={searchValue1}
            onChange={(e) => setSearchValue1(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            placeholder="Search value 2"
            value={searchValue2}
            onChange={(e) => setSearchValue2(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Year Dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-indigo-600 text-white uppercase tracking-wide">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-4 whitespace-nowrap font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 hover:font-semibold"
              >
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">{item.role}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">{item.createdAt}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 hover:underline transition"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StylishTableWithSearch;
