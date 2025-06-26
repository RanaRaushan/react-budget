import {
  dateFields,
  enumFields,
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
  tableRowCSS,
  tdCSS,
} from '../../utils/cssConstantHelper';
import FormErrorsComponent from '../../components/FormErrors';

const LOG_PREFIX = 'BulkddBudgetEntryPage::';

export default function BulkddBudgetEntryPage({ props }) {
  const { intent, inputRows, onChange, onRemove } = props;

  //   console.log('inputRows', inputRows);
  return inputRows.map((row, rowIndex) => {
    return (
      row && (
        <tr key={rowIndex} className={tableRowCSS}>
          {itemDetailHeaders.map((header, idx) => (
            <td key={header.key + rowIndex + idx} className={`${tdCSS}`}>
              <FormErrorsComponent
                errors={row.errors}
                header={header}
                intent={intent}
              />
              <div className="relative">
                {dateFields.includes(header.key) ? (
                  <input
                    disabled={lockedFields.includes(header.key)}
                    type={
                      lockedFields.includes(header.key)
                        ? 'datetime-local'
                        : 'date'
                    }
                    placeholder={header.key}
                    name={`${intent}[${rowIndex}]-${header.key}`}
                    value={row[header.key]}
                    onChange={(e) =>
                      onChange(rowIndex, header.key, e.target.value)
                    }
                    className={`${inputCSS}`}
                  />
                ) : enumFields.includes(header.key) ? (
                  <select
                    name={`${intent}[${rowIndex}]-${header.key}`}
                    value={row[header.key]}
                    onChange={(e) =>
                      onChange(rowIndex, header.key, e.target.value)
                    }
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
                        : paymentTypeEnum,
                    ).map(([ddKey, ddLabel]) => (
                      <option
                        className={`${ddOptionCSS}`}
                        key={ddKey}
                        value={ddKey}
                      >
                        {ddLabel}
                      </option>
                    ))}
                  </select>
                ) : 
                // inputDropDownFields.includes(header.key) ? (
                //   <InputDropdownComponent
                //     props={{
                //       suggestion,
                //       disabled: lockedFields.includes(header.key),
                //       placeholder: header.label,
                //       name: `${intent}-${header.key}`,
                //       value: formData[header.key],
                //       onInputChange: (value) =>
                //         handleInputChange(header.key)(value),
                //       className: `${inputCSS}`,
                //     }}
                //   />
                // ) : 
                (
                  <input
                    type="text"
                    disabled={lockedFields.includes(header.key)}
                    placeholder={header.label}
                    name={`${intent}[${rowIndex}]-${header.key}`}
                    value={row[header.key]}
                    onChange={(e) =>
                      onChange(rowIndex, header.key, e.target.value)
                    }
                    className={`${inputCSS}`}
                  />
                )}
              </div>
            </td>
          ))}
          <td className={`${tdCSS}`}>
            <button
              onClick={() => onRemove(rowIndex)}
              className="text-blue-600 hover:underline"
            >
              X
            </button>
          </td>
        </tr>
      )
    );
  });
}
