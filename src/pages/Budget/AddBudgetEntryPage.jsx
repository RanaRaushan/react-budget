import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  dateFields,
  enumFields,
  inputDropDownFields,
  itemCategoryEnum,
  itemDetailHeaders,
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
import { get_budget_detail_entry_byId } from '../../utils/APIHelper';
import InputDropdownComponent from '../../components/CustomInput/InputDropdown';

const LOG_PREFIX = 'AddBudgetEntryPage::';

export default function AddBudgetEntryPage() {
  const [formData, setFormData] = useState(
    itemDetailHeaders.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {}),
  );

  const { suggestion, errors, intent } = useOutletContext();

  const getBudgetEntryForId = async (existingId) => {
    let item = await get_budget_detail_entry_byId({}, existingId);
    const { id, perUnitPrice, referTransactionId, ...rest } = item;
    const transformed = {
      ...rest,
      unit: item.unit?.name || '',
    };
    console.log('data', transformed);
    return transformed;
  };

  const handleInputChange =
    (key) =>
    async (value, rowSummaryId = undefined) => {
      const existingRowData = undefined && rowSummaryId && { // RANA:TODO:: need to check as it is not user friendly yet
        ...(await getBudgetEntryForId(rowSummaryId)),
      };
      setFormData((prev) => {
        const data = existingRowData ?? {
          ...prev,
          [key]: value,
        };
        return data;
      });
    };
  return itemDetailHeaders.map((header, idx) => (
    <td key={header.key} className={`${tdCSS}`}>
      <FormErrorsComponent errors={errors} header={header} intent={intent} />

      <div className="relative">
        {dateFields.includes(header.key) ? (
          <input
            disabled={lockedFields.includes(header.key)}
            type={lockedFields.includes(header.key) ? 'datetime-local' : 'date'}
            placeholder={header.key}
            name={`${intent}-${header.key}`}
            value={formData[header.key]}
            onChange={(e) => handleInputChange(header.key)(e.target.value)}
            className={`${inputCSS} ${
              intent + '-' + header.key in (errors ?? {})
                ? 'border border-red-500'
                : ''
            }`}
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
              <option
                className={`${ddOptionCSS} ${
                  intent + '-' + header.key in (errors ?? {})
                    ? 'border border-red-500'
                    : ''
                }`}
                key={ddKey}
                value={ddKey}
              >
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
                handleInputChange(header.key)(summary, id),
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
            value={formData[header.key]?? ''}
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
