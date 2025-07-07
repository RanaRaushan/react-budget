import { LineChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import { monthNames } from '../../../utils/constantHelper';
import { SpinnerDotted } from 'spinners-react';

export default function LineChartReportComponent({ props }) {
  const { callbackData } = props;
  const [selected, setSelected] = useState(null);
  const [activeReports, setActiveReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('calling fetchData in useEffect');
    const fetchAndMerge = async () => {
      try {
        const [res1, res2] = await Promise.all([
          callbackData('Expense').then((r) => r),
          callbackData('Income').then((r) => r),
        ]);
        const combined = [res1, res2];

        setActiveReports(combined);
      } catch (err) {
        console.error('API fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndMerge();
  }, []);

  console.log('activeReports', activeReports);
  return (
    <div>
      <>
        {loading ? (
          <SpinnerDotted
            size={50}
            thickness={150}
            speed={100}
            color="rgba(255, 255, 255, 1)"
          />
        ) : (
          activeReports?.length && (
            <LineChart
              //   xAxis={
              //     monthNames.map((month, idx) => {return {curve: 'linear', 'data': monthNames}})
              //   //   [
              //   //   { curve: 'linear', data: [1, 5, 2, 6, 3, 9.3] },
              //   //   { curve: 'linear', data: [6, 3, 7, 9.5, 4, 2] },
              //   // ]
              // }
              xAxis={{ data: monthNames.values() }}
              // yAxis = {{curve: 'linear', 'data': monthNames}}

              series={
                activeReports.map((data, idx) => {
                  return {
                    curve: 'linear',
                    data: monthNames.map((month, idx) => [
                      data.monthlyExpense?.monthlyAmounts[month.toUpperCase()]
                        ?.monthlyItemCategoryTotalAmount ?? 0,
                    ]),
                  };
                })
                // [
                //   { curve: 'linear', data: [1, 5, 2, 6, 3, 9.3] },
                //   { curve: 'linear', data: [6, 3, 7, 9.5, 4, 2] },
                // ]
              }
              height={300}
              grid={{ vertical: true, horizontal: true }}
            />
          )
        )}
      </>
    </div>
  );
}
