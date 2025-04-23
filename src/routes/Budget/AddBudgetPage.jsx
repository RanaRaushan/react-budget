import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { budgetHeaders, dateFields, enumFields, itemCategoryEnum, lockedFields, paymentTypeEnum, spentTypeEnum } from '../../utils/constantHelper';


export async function loader({ request }) {
}


function getLocalDateTimeString() {
    const now = new Date();
    const offset = now.getTimezoneOffset(); // in minutes
  
    // Adjust time to local timezone
    const localDateTime = new Date(now.getTime() - offset * 60 * 1000);
  
    return localDateTime.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }

export default function AddItemPage() {
    const [searchAddValue, setSearchAddValue] = useState("");

  const header = useOutletContext();
  return (
    <>
        {
        dateFields.includes(header.key) 
            ? <input 
                disabled={lockedFields.includes(header.key)}
                type={lockedFields.includes(header.key) ? "datetime-local" : "date"}
                placeholder={header.key}
                name={header.key}
                value={lockedFields.includes(header.key) ? getLocalDateTimeString() : searchAddValue}
                onChange={(e) => {lockedFields.includes(header.key) ? setSearchAddValue(getLocalDateTimeString()) : setSearchAddValue(e.target.value)}}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            : enumFields.includes(header.key) 
                ? <select
                    value={searchAddValue}
                    name={header.key}
                    onChange={(e) => setSearchAddValue(e.target.value)}
                    className="w-full border border-gray-300 bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">{header.label}</option>
                    {Object.entries(header.key == 'spentType' ? spentTypeEnum : header.key == 'itemType' ? itemCategoryEnum : paymentTypeEnum).map(([ddKey, ddLabel]) => (
                    <option key={ddKey} value={ddKey}>
                        {ddLabel}
                    </option>
                    ))}
                </select>
                : <input
                type="text"
                disabled={lockedFields.includes(header.key)}
                placeholder={header.label}
                name={header.key}
                value={searchAddValue}
                onChange={(e) => setSearchAddValue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        }
    </>
  );
};
