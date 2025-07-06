import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  budgetHeaders,
  dateFields,
  enumFields,
  inputDropDownFields,
  itemCategoryEnum,
  lockedFields,
  paymentTypeEnum,
  spentTypeEnum,
} from '../../utils/constantHelper';
import {
  ddOptionCSS,
  inputCSS,
  inputddCSS,
  tdCSS,
} from '../../utils/cssConstantHelper';
import FormErrorsComponent from '../../components/FormErrors';
import InputDropdownComponent from '../../components/customInput/InputDropdown';
import QuickDateInputComponent from '../../components/customInput/QuickDateInput';

const LOG_PREFIX = 'AddBudgetPage::';

export default function AddBudgetItemPage() {
  const [formData, setFormData] = useState(
    budgetHeaders.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {}),
  );

  const { errors, intent, suggestion } = useOutletContext();

  const handleInputChange = (key) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return budgetHeaders.map((header, idx) => (
    <td key={header.key} className={`${tdCSS} relative`}>
      <FormErrorsComponent errors={errors} header={header} intent={intent} />

      <div className="relative">
        {dateFields.includes(header.key) ? (
          // <input
          //   disabled={lockedFields.includes(header.key)}
          //   type={lockedFields.includes(header.key) ? 'datetime-local' : 'date'}
          //   placeholder={header.key}
          //   name={`${intent}-${header.key}`}
          //   value={formData[header.key]}
          //   onChange={(e) => handleInputChange(header.key)(e.target.value)}
          //   className={`${inputCSS} ${intent + "-" + header.key in (errors??{}) ? 'border border-red-500' : ''}`}
          // />
          <QuickDateInputComponent
            props={{
              key: header.key,
              name: `${intent}-${header.key}`,
              value: formData[header.key],
              onInputChange: (val) => handleInputChange(header.key)(val),
            }}
          />
        ) : enumFields.includes(header.key) ? (
          <select
            name={`${intent}-${header.key}`}
            value={formData[header.key]}
            onChange={(e) => handleInputChange(header.key)(e.target.value)}
            className={`${inputddCSS} ${
              intent + '-' + header.key in (errors ?? {})
                ? 'border border-red-500'
                : ''
            }`}
          >
            <option className={`${ddOptionCSS}`} value="">
              {header.label}
            </option>
            {Object.entries(
              header.key == 'spentType'
                ? spentTypeEnum
                : header.key == 'itemType'
                ? itemCategoryEnum
                : paymentTypeEnum,
            ).map(([ddKey, ddLabel]) => (
              <option className={`${ddOptionCSS}`} key={ddKey} value={ddKey}>
                {ddLabel}
              </option>
            ))}
          </select>
        ) : inputDropDownFields.includes(header.key) ? (
          <InputDropdownComponent
            props={{
              suggestion: suggestion[header.key],
              disabled: lockedFields.includes(header.key),
              placeholder: header.label,
              name: `${intent}-${header.key}`,
              value: formData[header.key],
              onInputChange: ({ id, summary }) =>
                handleInputChange(header.key)(summary),
              className: `${inputCSS} ${
                intent + '-' + header.key in (errors ?? {})
                  ? 'border border-red-500'
                  : ''
              }`,
            }}
          />
        ) : (
          <input
            type="text"
            disabled={lockedFields.includes(header.key)}
            placeholder={header.label}
            name={`${intent}-${header.key}`}
            value={formData[header.key]}
            onChange={(e) => handleInputChange(header.key)(e.target.value)}
            className={`${inputCSS} ${
              intent + '-' + header.key in (errors ?? {})
                ? 'border border-red-500'
                : ''
            }`}
          />
        )}
      </div>
    </td>
  ));
}
