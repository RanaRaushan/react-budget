import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { budgetHeaders, dateFields, enumFields, itemCategoryEnum, lockedFields, paymentTypeEnum, spentTypeEnum } from '../../utils/constantHelper';
import { ddOptionCSS, inputCSS, inputddCSS } from '../../utils/cssConstantHelper';



function getLocalDateTimeString() {
    const now = new Date();
    const offset = now.getTimezoneOffset(); // in minutes
  
    // Adjust time to local timezone
    const localDateTime = new Date(now.getTime() - offset * 60 * 1000);
    console.log("now.toISOString()", now.toISOString().split("T")[0])
    return now.toISOString().split("T")[0]; // "YYYY-MM-DDTHH:MM"
  }

export default function UpdateItemPage({header, item}) {
    const [searchAddValue, setSearchAddValue] = useState("");
    const [formData, setFormData] = useState(budgetHeaders.reduce((acc, col) => {
        acc[col.key] = item[col.key];
        return acc;
      }, {}));

  const intent = "edit-"
//   console.log("calling UpdateItemPage", header, item)
  return (
    <>
        {
        dateFields.includes(header.key) 
            ? <input 
                type="date"
                placeholder={header.key}
                name={`${intent}${header.key}`}
                value={formData[header.key]}
                onChange={(e) => setFormData((prev) => ({ ...prev, [`${header.key}`]: e.target.value }))}
                className={`${inputCSS}`}
            />
            : enumFields.includes(header.key) 
                ? <select
                    value={formData[header.key]}
                    name={`${intent}${header.key}`}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [`${header.key}`]: e.target.value }))}
                    className={`${inputddCSS}`}
                >
                    <option className={`${ddOptionCSS}`} value="">{header.label}</option>
                    {Object.entries(header.key == 'spentType' ? spentTypeEnum : header.key == 'itemType' ? itemCategoryEnum : paymentTypeEnum).map(([ddKey, ddLabel]) => (
                    <option className={`${ddOptionCSS}`} key={ddKey} value={ddKey}>
                        {ddLabel}
                    </option>
                    ))}
                </select>
                : <input
                type="text"
                disabled={lockedFields.includes(header.key)}
                placeholder={header.label}
                name={`${intent}${header.key}`}
                value={formData[header.key]}
                onChange={(e) => setFormData((prev) => ({ ...prev, [`${header.key}`]: e.target.value }))}
                className={`${inputCSS}`}
            />
        }
    </>
  );
};
