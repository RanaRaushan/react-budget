import { useState } from 'react';
import { SpinnerDotted } from 'spinners-react';

const LOG_PREFIX = 'UpdateBudgetPage::';

export default function DownloadBudgetComponent({ props }) {
  const { callbackData, buttonText } = props;
  const [loading, setLoading] = useState(false);

  const createDownloadLink = async (data, fileName) => {
    try {
      const cleanBase64 = data?.includes(',') ? data.split(',')[1] : data;
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length)
        .fill()
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const downloadExcelFile = async () => {
    // setLoading(true);
    try {
      const { data, fileName } = await callbackData();
      await createDownloadLink(data, fileName);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <>
      <button disabled={loading} onClick={downloadExcelFile}>
        {loading ? (
          <SpinnerDotted
            size={30}
            thickness={100}
            speed={100}
            color="rgba(57, 143, 172, 1)"
          />
        ) : (
          buttonText
        )}
      </button>
    </>
  );
}
