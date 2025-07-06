import { useState } from 'react';
import {
  compoundingFrequencyEnum,
  dateFields,
  enumFields,
  inputDropDownFields,
  investmentTypeEnum,
  itemCategoryEnum,
  lockedFields,
  paymentTypeEnum,
  spentTypeEnum,
} from '../utils/constantHelper';
import { ddOptionCSS, inputCSS, inputddCSS } from '../utils/cssConstantHelper';
import { getFormatedDateFromString } from '../utils/functionHelper';

const LOG_PREFIX = 'UpdateBudgetPage::';

export default function UpdateItemComponent({ props }) {
  const [descInput, setDescInput] = useState('');
  // console.log('suggestion props', props);
  const { header, item, intent, suggestion, errors } = props;
  return (
    <div className="relative">
      {dateFields.includes(header.key) ? (
        <input
          type="date"
          placeholder={header.key}
          name={`${intent}-${header.key}`}
          defaultValue={getFormatedDateFromString(item[header.key])}
          onChange={(e) => e.target.value}
          className={`${inputCSS} ${
            intent + '-' + header.key in (errors ?? {})
              ? 'border border-red-500'
              : ''
          }`}
        />
      ) : enumFields.includes(header.key) ? (
        <select
          name={`${intent}-${header.key}`}
          defaultValue={item[header.key]?? ''}
          onChange={(e) => e.target.value}
          className={`${inputddCSS}`}
        >
          <option className={`${ddOptionCSS}`} value="">
            {header.label}
          </option>
          {Object.entries(
            header.key == 'spentType'
              ? spentTypeEnum
              : header.key == 'itemType'
              ? itemCategoryEnum
              : header.key == 'compoundingFrequency'
              ? compoundingFrequencyEnum
              : header.key == 'investmentType'
              ? investmentTypeEnum
              : paymentTypeEnum,
          ).map(([ddKey, ddLabel]) => (
            <option className={`${ddOptionCSS}`} key={ddKey} value={ddKey}>
              {ddLabel}
            </option>
          ))}
        </select>
      ) : (
        // TOOD:: not working, need to revisit
        // : inputDropDownFields.includes(header.key) ? (
        //   <InputDropdownComponent
        //     props={{
        //       suggestion: suggestion[header.key],
        //       disabled: lockedFields.includes(header.key),
        //       placeholder: header.label,
        //       name: `${intent}-${header.key}`,
        //       defaultValue: true,
        //       value: item[header.key],
        //       onInputChange: (value) => value,
        //       className: `${inputCSS} ${
        //         intent + '-' + header.key in (errors ?? {})
        //           ? 'border border-red-500'
        //           : ''
        //       }`,
        //     }}
        //   />
        // )
        <input
          type="text"
          readOnly={lockedFields.includes(header.key)}
          placeholder={header.label}
          name={`${intent}-${header.key}`}
          defaultValue={
            header.key === 'unit' ? item[header.key].name?? '' : item[header.key?? '']
          }
          onChange={(e) => e.target.value}
          className={`${inputCSS}`}
        />
      )}
    </div>
  );
}
