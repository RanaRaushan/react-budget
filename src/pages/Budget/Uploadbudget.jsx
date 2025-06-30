import { useEffect, useState } from 'react';
import { upload_budget } from '../../utils/APIHelper';
import { buttonCSS, inputCSS, theadCSS } from '../../utils/cssConstantHelper';
import { useFetcher } from 'react-router-dom';
import SamplePreviewTableComponent from '../../components/SamplePreviewTable';
import * as XLSX from 'xlsx';

export async function action({ request }) {
  const formData = await request.formData();
  formData.append('forUserId', 'rana@gmail.com');
  if (!formData || formData.get('file') === 'null' || !formData.get('file')) {
    return { error: 'Please select a file first.' };
  }
  const res = await upload_budget(formData, formData.get('type'));
  return { error: res?.error, message: res?.message };
}

export default function Uploadbudget() {
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState([]);
  const [file, setFile] = useState([]);
  const [uploadType, setUploadType] = useState('');
  const [loading, setLoading] = useState(false);
  const fetcher = useFetcher();
  const [message, setMessage] = useState(
    fetcher.data?.error || fetcher.data?.message || '',
  );

  useEffect(() => {
    if (fetcher.data) {
      setMessage(fetcher.data?.error || fetcher.data?.message);
    }
  }, [fetcher.data]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(sheet, {
        defval: '', // ✅ Use '' (or null) for empty cells
        header: 1, // Use first row as headers
      });
      const [headerRow, ...dataRows] = raw;

      // Step 2: Filter out empty headers
      const headers = headerRow.map((h) => (h ?? '').toString().trim());
      const validIndexes = headers
        .map((val, idx) => ({ val, idx }))
        .filter((h) => h.val !== '');

      // Step 3: Build cleaned JSON
      const json = dataRows.map((row) => {
        const obj = {};
        validIndexes.forEach(({ val, idx }) => {
          obj[val] = row[idx] ?? '';
        });
        return obj;
      });
      setFileData(json.slice(0, 5)); // show only 5 rows for preview
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileName || !uploadType) {
      alert('Please select a file and a type.');
      return;
    }
    setLoading(true);
    try {
      // Replace with real API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);
      fetcher.submit(formData, {
        method: 'POST',
        encType: 'multipart/form-data',
      });
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  let status = fetcher.state;

  let isLoading = status !== 'idle';

  return (
    <div className="flex flex-col items-center justify-center bg-indigo-600 p-6 rounded-xl shadow border border-gray-200">
      <div className="bg-neutral-800 rounded-lg shadow-xl p-8 w-full max-w-4xl flex flex-wrap space-x-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Upload Excel File</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload an Excel file and choose the import type.
          </p>
          <div className="space-y-4">
            <input
              disabled={isLoading}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />

            {file && fileName && (
              <div className="text-sm text-gray-500 font-medium">
                Selected file:{' '}
                <span className="text-indigo-600">{fileName}</span>
              </div>
            )}

            <select
              disabled={isLoading}
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select upload type</option>
              <option value="budget">Budget Transaction</option>
              <option value="budgetEntry">Budget Item Entry</option>
            </select>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={() => {
                  setFileName('');
                  setFileData([]);
                  setUploadType('');
                }}
                className="px-4 py-2 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className=" border border-gray-200 rounded-md p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">{`Sample Format ${
              uploadType && `(for ${uploadType})`
            }`}</h3>
            {/* <a
            href="/sample/products.xlsx" // replace with your actual sample file path
            download
            className="text-indigo-600 text-sm hover:underline"
          >
            Download Sample
          </a> */}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className={`${theadCSS}`}>
                <tr>
                  <th className="px-2 py-1 border text-left">Name</th>
                  <th className="px-2 py-1 border text-left">Price</th>
                  <th className="px-2 py-1 border text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border">Apple</td>
                  <td className="px-2 py-1 border">1.2</td>
                  <td className="px-2 py-1 border">100</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border">Banana</td>
                  <td className="px-2 py-1 border">0.5</td>
                  <td className="px-2 py-1 border">50</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border">Carrot</td>
                  <td className="px-2 py-1 border">0.8</td>
                  <td className="px-2 py-1 border">200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {message && (
          <p className={`mt-4 text-center text-red-500 text-l`}>{message}</p>
        )}
        {!message && fileData.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">
              Sample Preview Uploaded data:
            </h3>
            <SamplePreviewTableComponent data={fileData} />
          </div>
        )}
      </div>
    </div>
  );
}
