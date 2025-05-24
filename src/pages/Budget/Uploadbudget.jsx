import React, { useEffect, useState } from "react";
import { upload_budget } from "../../utils/APIHelper";
import { buttonCSS, errorTextCSS, inputCSS } from "../../utils/cssConstantHelper";
import { useFetcher } from "react-router-dom";

export async function action({ request }) {
    const formData = await request.formData();
    if (!formData || formData.get("file") === "null" || !formData.get("file")){
      return {error:"Please select a file first."};
    }
    const res = await upload_budget(formData);
    return {error:res?.error, message:res?.message}
  }

export default function Uploadbudget() {
  const [file, setFile] = useState(null);
  const fetcher = useFetcher();
  const [message, setMessage] = useState(fetcher.data?.error || fetcher.data?.message  || "");

    useEffect(() => {
      if (fetcher.data) {
        setMessage(fetcher.data?.error || fetcher.data?.message);
      }
    }, [fetcher.data]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    fetcher.submit(formData, {
        method: "POST",
        encType: "multipart/form-data"
      });
  };
  let status =
    fetcher.state;

  let isLoading = status !== "idle";

  return (
    <fetcher.Form method="post" >
        <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-600 p-6 rounded-xl shadow border border-gray-200">
        <div className="bg-blue shadow-lg rounded-2xl p-8 w-full max-w-md bg-neutral-800 space-y-4">
            <h2 className="text-[1.25em] font-semibold mb-4 text-center">Upload Excel File</h2>

            <input
            disabled={isLoading}
            type="file"
            accept=".xlsx"
            name="file"
            onChange={handleFileChange}
            className={inputCSS}
            />

            <button
            disabled={isLoading}
            onClick={(e) => {handleUpload(e)}}
            className={buttonCSS}
            >
            {isLoading ? "Uploading...": "Upload" }
            </button>

            {message && (
            <p className={`mt-4 text-center text-red-500 text-l`}>{message}</p>
            )}
        </div>
        </div>
    </fetcher.Form>
  );
};
