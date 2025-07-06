import { Link } from 'react-router-dom';
import {
  download_all_budget_data,
  get_analysis_report_data,
} from '../utils/APIHelper';
import DownloadBudgetComponent from '../components/exporting/DownloadBudget';
import { useAuth } from '../hooks/AuthProvider';
import { useState } from 'react';
import { getCurrentYear, getYearOption } from '../utils/functionHelper';
import { ddOptionCSS, inputddCSS } from '../utils/cssConstantHelper';
import ReportAnalysisComponent from '../components/analysis/AnalysisReport';

export default function HomePage() {
  const auth = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalPromise, setModalPromise] = useState({
    resolve: null,
    reject: null,
  });
  const [formData, setformData] = useState({
    selectedYear: getCurrentYear(),
  });

  const getDownloadData = () => {
    return new Promise((resolve, reject) => {
      setShowModal(true);
      setModalPromise({ resolve }); // Save resolver to use after modal submit
    });
  };

  const fetchAllBudgetDataToDownload = async () => {
    setLoading(true);
    const response =
      (auth?.token && (await download_all_budget_data({ data: formData }))) ||
      [];
    let data;
    let fileName = 'report.xlsx';
    if (response.empty !== true) {
      data = response.data;
      fileName = response.fileName;

      // ✅ Resolve to custom download
      modalPromise?.resolve?.({ data, fileName });
      setShowModal(false);
      setLoading(false);
      return { data, fileName };
    }
    setLoading(false);
    return { data, fileName };
  };

  const fetchReportAnalysis = async () => {
    const response =
      (auth?.token &&
        (await get_analysis_report_data(
          new URLSearchParams({
            betweenDate: '2025-06-01:2025-06-30',
          }).toString(),
        ))) ||
      [];
    return response;
  };

  const labelCSS = 'block mb-2.5 text-white text-[1.125em] font-bold';
  const inputCSS =
    'w-full min-w-80 p-2.5 rounded-3xl border-none text-[0.875em] font-inherit bg-[#3B3B3B] text-gray-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]';
  const buttonCSS = 'py-2.5 rounded cursor-pointer font-inherit';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6">
      <h1 className="text-4xl font-bold text-green-400 mb-4 text-center">
        💰 Welcome to Budget Tracker
      </h1>

      <p className="text-lg text-gray-300 mb-6 text-center max-w-md">
        Take control of your spending and stay on top of your finances.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-10 max-w-6xl">
        <Link to="/budgets">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition">
            📄 View Your Budget
          </button>
        </Link>

        <span title="Download your all budget">
          <DownloadBudgetComponent
            props={{
              callbackData: getDownloadData,
              buttonText: '⬇️ Export Your all Budget Data',
            }}
          />
        </span>
        
        <ReportAnalysisComponent props={{ callbackData: fetchReportAnalysis, auth: auth }} />
      </div>

      <footer className="text-sm text-gray-500">
        Author: <span className="font-semibold text-white">@Rana</span>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-indigo-600 p-6 rounded-lg max-w-md w-full text-white">
            <h2 className="text-xl font-semibold mb-4">Before You Download</h2>
            <label className={`${labelCSS}`}>Which year?</label>
            <select
              value={formData['selectedYear'] ?? getCurrentYear()}
              onChange={(e) =>
                setformData((param) => {
                  return { selectedYear: e.target.value };
                })
              }
              className={`bg-neutral-800 ${inputddCSS}`}
            >
              <option className={`${ddOptionCSS}`} value="ALL">
                All
              </option>
              {getYearOption().map((year) => (
                <option
                  className={`${ddOptionCSS}`}
                  key={`${year}`}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-5">
              {!loading && (
                <button
                  onClick={() => {
                    modalPromise?.reject?.(null);
                    setShowModal(false);
                  }}
                  className={`${buttonCSS}`}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={fetchAllBudgetDataToDownload}
                className={`${buttonCSS}`}
              >
                {loading ? 'Downloading...' : 'Confirm & Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
