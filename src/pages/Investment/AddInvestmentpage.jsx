import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  compoundingFrequencyEnum,
  dateFields,
  enumFields,
  investmentHeaders,
  investmentTypeEnum,
  lockedFields,
} from '../../utils/constantHelper';
import {
  ddOptionCSS,
  inputCSS,
  inputddCSS,
  tdCSS,
} from '../../utils/cssConstantHelper';
import FormErrorsComponent from '../../components/FormErrors';

const LOG_PREFIX = 'AddBudgetPage::';

export default function AddInvestmentPage() {
  const [formData, setFormData] = useState(
    investmentHeaders.reduce((acc, col) => {
      acc[col.key] = undefined;
      return acc;
    }, {}),
  );

  const { errors, intent } = useOutletContext();

  return investmentHeaders.map((header, idx) => (
    <td key={header.key} className={`${tdCSS}`}>
      <FormErrorsComponent errors={errors} header={header} intent={intent} />

      <>
        {dateFields.includes(header.key) ? (
          <input
            disabled={lockedFields.includes(header.key)}
            type={lockedFields.includes(header.key) ? 'datetime-local' : 'date'}
            placeholder={header.key}
            name={`${intent}-${header.key}`}
            value={formData[header.key]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [`${header.key}`]: e.target.value,
              }))
            }
            className={`${inputCSS}`}
          />
        ) : enumFields.includes(header.key) ? (
          <select
            name={`${intent}-${header.key}`}
            value={formData[header.key]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [`${header.key}`]: e.target.value,
              }))
            }
            className={`${inputddCSS}`}
          >
            <option className={`${ddOptionCSS}`} value="">
              {header.label}
            </option>
            {Object.entries(
              header.key == 'investmentType'
                ? investmentTypeEnum
                : compoundingFrequencyEnum,
            ).map(([ddKey, ddLabel]) => (
              <option className={`${ddOptionCSS}`} key={ddKey} value={ddKey}>
                {ddLabel}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            disabled={lockedFields.includes(header.key)}
            placeholder={header.label}
            name={`${intent}-${header.key}`}
            value={formData[header.key]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [`${header.key}`]: e.target.value,
              }))
            }
            className={`${inputCSS}`}
          />
        )}
      </>
    </td>
  ));
}
