import { useState } from 'react';
import { dateFields, enumFields, itemCategoryEnum, lockedFields, paymentTypeEnum, spentTypeEnum } from '../utils/constantHelper';
import { ddOptionCSS, inputCSS, inputddCSS } from '../utils/cssConstantHelper';

const LOG_PREFIX = "UpdateBudgetPage::"

export default function UpdateItemComponent({header, item, intent, formInputs}) {

  return (
    <>
        {
        dateFields.includes(header.key) 
            ? <input 
                type="date"
                placeholder={header.key}
                name={`${intent}-${header.key}`}
                defaultValue={new Date(item[header.key]).toISOString().split('T')[0]}
                onChange={(e) => e.target.value}
                className={`${inputCSS}`}
            />
            : enumFields.includes(header.key) 
                ? <select
                    name={`${intent}-${header.key}`}
                    defaultValue={item[header.key]}
                    onChange={(e) => e.target.value}
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
                name={`${intent}-${header.key}`}
                defaultValue={item[header.key]}
                onChange={(e) => e.target.value}
                className={`${inputCSS}`}
            />
        }
    </>
  );
};
