import { useEffect, useState } from 'react';
import { useActionData, useOutletContext } from 'react-router-dom';
import { budgetHeaders, dateFields, enumFields, itemCategoryEnum, lockedFields, paymentTypeEnum, spentTypeEnum } from '../../utils/constantHelper';
import { ddOptionCSS, errorTextCSS, inputCSS, inputddCSS, tdCSS } from '../../utils/cssConstantHelper';
import { BUDGET_ADD_API_URL, BUDGET_UPDATE_API_URL } from '../../utils/APIHelper';
import FormErrorsComponent from '../../components/FormErrors';

const LOG_PREFIX = "AddBudgetPage::"

export default function AddBudgetItemPage() {
    const [formData, setFormData] = useState(budgetHeaders.reduce((acc, col) => {
        acc[col.key] = "";
        return acc;
      }, {}));

  const {errors, intent} = useOutletContext();
    
  return (
    
        budgetHeaders.map((header, idx) => (
            <td key={header.key} className={`${tdCSS}`}>
            <FormErrorsComponent errors={errors} header={header} intent={intent}/>
            
            <>
                {
                dateFields.includes(header.key) 
                    ? <input 
                        disabled={lockedFields.includes(header.key)}
                        type={lockedFields.includes(header.key) ? "datetime-local" : "date"}
                        placeholder={header.key}
                        name={`${intent}-${header.key}`}
                        value={formData[header.key]}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [`${header.key}`]: e.target.value }))}
                        className={`${inputCSS}`}
                    />
                    : enumFields.includes(header.key) 
                        ? <select
                            name={`${intent}-${header.key}`}
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
                        name={`${intent}-${header.key}`}
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
