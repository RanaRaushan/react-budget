import { useState } from 'react';
import { compoundingFrequencyEnum, dateFields, enumFields, investmentTypeEnum, itemCategoryEnum, lockedFields, paymentTypeEnum, spentTypeEnum } from '../utils/constantHelper';
import { ddOptionCSS, inputCSS, inputddCSS } from '../utils/cssConstantHelper';
import { getFormatedDate } from '../utils/functionHelper';

const LOG_PREFIX = "UpdateBudgetPage::"

export default function UpdateItemComponent({header, item, intent, hasError}) {

  return (
    <>
        {
        dateFields.includes(header.key) 
            ? <input 
                type="date"
                placeholder={header.key}
                name={`${intent}-${header.key}`}
                defaultValue={getFormatedDate(item[header.key])}
                onChange={(e) => e.target.value}
                className={`${inputCSS} ${hasError? 'border border-red-500' : ''}`}
            />
            : enumFields.includes(header.key) 
                ? <select
                    name={`${intent}-${header.key}`}
                    defaultValue={item[header.key]}
                    onChange={(e) => e.target.value}
                    className={`${inputddCSS}`}
                >
                    <option className={`${ddOptionCSS}`} value="">{header.label}</option>
                    {Object.entries(header.key == 'spentType' ? spentTypeEnum : header.key == 'itemType' ? itemCategoryEnum :  header.key == 'compoundingFrequency' ? compoundingFrequencyEnum : header.key == 'investmentType' ? investmentTypeEnum : paymentTypeEnum).map(([ddKey, ddLabel]) => (
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
