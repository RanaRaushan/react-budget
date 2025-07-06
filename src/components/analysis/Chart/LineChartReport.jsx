import { LineChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';

export default function LineChartReportComponent({ props }) {
  const { callbackData } = props;
  const [selected, setSelected] = useState(null);
  const [activeReport, setActiveReport] = useState(null);

  useEffect(() => {
    console.log('calling fetchData in useEffect');
    callbackData() // your real API
      .then((res) => setActiveReport(res))
      .catch((err) => console.error('Failed to fetch reports', err));
  }, []);


  return (
    <div>
      <>
        {activeReport && (
          <LineChart
            series={[
              { curve: 'linear', data: [1, 5, 2, 6, 3, 9.3] },
              { curve: 'linear', data: [6, 3, 7, 9.5, 4, 2] },
            ]}
          />
        )}
      </>
    </div>
  );
}
