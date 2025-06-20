import { useState } from 'react';
import { SpinnerDotted } from 'spinners-react';

const LOG_PREFIX = 'UpdateBudgetPage::';

export default function DownloadBudgetComponent({ props }) {
  const {callbackData} = props
  const [loading, setLoading] = useState(false);

  const savefilepicker = async (data, fileName) => {
    const cleanBase64 = data?.includes(',') ? data.split(',')[1] : data;
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob with the appropriate MIME type
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    if (!window.showSaveFilePicker) {
      alert(
        'Your browser does not support the Save As dialog (use Chrome or Edge)',
      );
      return;
    }
    if ('showSaveFilePicker' in window) {
      // Show Save File dialog
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: 'Excel Files',
            accept: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                ['.xlsx'],
            },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // Fallback to normal download if showSaveFilePicker not supported
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = defaultName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const createDownloadLink = async (data, fileName) => {
  try {
    const cleanBase64 = data?.includes(',') ? data.split(',')[1] : data;
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob with the appropriate MIME type
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
    setLoading(true);
    try {
      const { data, fileName } = await callbackData();
      await createDownloadLink(data, fileName);
    } catch (err) {
      console.error('Download failed:', err);
      //   alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <button onClick={() => downloadExcelFile()}>Downloading</button> */}
      <button disabled={loading} onClick={() => downloadExcelFile()}>
        {loading ? (
          <SpinnerDotted
            size={30}
            thickness={100}
            speed={100}
            color="rgba(57, 143, 172, 1)"
          />
        ) : (
          'Download'
        )}
      </button>
    </>
  );
}
