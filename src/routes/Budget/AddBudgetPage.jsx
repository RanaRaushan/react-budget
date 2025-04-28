import { useEffect, useState } from 'react';
import { useActionData, useOutletContext } from 'react-router-dom';
import { budgetHeaders, dateFields, enumFields, itemCategoryEnum, lockedFields, paymentTypeEnum, spentTypeEnum } from '../../utils/constantHelper';
import { ddOptionCSS, inputCSS, inputddCSS, tdCSS } from '../../utils/cssConstantHelper';
import { BUDGET_ADD_API_URL, BUDGET_UPDATE_API_URL } from '../../utils/APIHelper';

const LOG_PREFIX = "AddBudgetPage::"

// export async function action({ request }) {
//   let formData = await request.formData();
//   let intent = formData.get("intent");
//   const payload = {};
//   let errors = {};
//   let fieldValue
//   budgetHeaders.map((header, idx) => (
//     fieldValue = formData.get(intent+"-"+header.key),
//     payload[header.key] = fieldValue,
//     errors = {...errors, ...validateInputs(header, fieldValue, intent+"-")}
//   ))
//   console.log(LOG_PREFIX+"calling action: errors",errors)
//   if (Object.keys(errors).length > 0){
//     return errors;
//   }
// //   if (intent === "edit" && payload) {
// //     await post(BUDGET_UPDATE_API_URL, payload);
// //     // return redirect(BUDGET_FE_URL);
// //   }

//   if (intent === "add" && payload) {
//     await post(BUDGET_ADD_API_URL, payload);
//     // return redirect(BUDGET_ADD_FE_URL);
//   }
//   return {}
// }

function getLocalDateTimeString() {
    const now = new Date();
    const offset = now.getTimezoneOffset(); // in minutes
  
    // Adjust time to local timezone
    const localDateTime = new Date(now.getTime() - offset * 60 * 1000);
  
    return localDateTime.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }

export default function AddItemPage() {
    const [formData, setFormData] = useState(budgetHeaders.reduce((acc, col) => {
        acc[col.key] = "";
        return acc;
      }, {}));

  const errors = useOutletContext();
  const intent = "add-"
  
  

  console.log(LOG_PREFIX+"calling AddItemPage")
  return (
    
        budgetHeaders.map((header, idx) => (
            <td key={header.key} className={`${tdCSS} --${dateFields} ${header.key} ${dateFields.includes(header.key)}--`}>
            {errors && errors[intent+header.key] && <p className="text-red-500 text-xs">{errors[intent+header.key]}</p>}
            
            <>
                {
                dateFields.includes(header.key) 
                    ? <input 
                        disabled={lockedFields.includes(header.key)}
                        type={lockedFields.includes(header.key) ? "datetime-local" : "date"}
                        placeholder={header.key}
                        name={`${intent}${header.key}`}
                        value={formData[header.key]}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [`${header.key}`]: e.target.value }))}
                        className={`${inputCSS}`}
                    />
                    : enumFields.includes(header.key) 
                        ? <select
                            name={`${intent}${header.key}`}
                            value={formData[header.key]}
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
            </td>
        ))
    
  );
};
