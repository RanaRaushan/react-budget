import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { budgetHeaders, dateFields, enumFields, itemCategoryEnum, lockedFields, paymentTypeEnum, spentTypeEnum } from '../../utils/constantHelper';
import { ddOptionCSS, inputCSS, inputddCSS } from '../../utils/cssConstantHelper';

const LOG_PREFIX = "UpdateBudgetPage::"

export default function UpdateItemPage({header, item}) {
    const [formData, setFormData] = useState(budgetHeaders.reduce((acc, col) => {
        acc[col.key] = item[col.key];
        return acc;
      }, {}));

  const intent = "edit-"
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
                readOnly={lockedFields.includes(header.key)}
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
