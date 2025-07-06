import { theadCSS } from '../../utils/cssConstantHelper';

const LOG_PREFIX = "SamplePreviewTable::"

const SamplePreviewTableComponent = ({ data }) => {
  if (!data.length) return null;

  const headers = Object.keys(data[0]);

  return (
    <table className="w-full text-sm border mt-2">
      <thead className={`${theadCSS}`}>
        <tr>
          {headers.map((key) => (
            <th key={key} className="px-2 py-1 border">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {headers.map((key) => (
              <td key={key} className="px-2 py-1 border">
                {row[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SamplePreviewTableComponent;
