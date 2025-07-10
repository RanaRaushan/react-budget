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

  console.log('activeReports', activeReports, monthNames);
  return (
    <div className='bg-neutral-800'>
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
              xAxis={[{ data: monthNames, label: "Months" }]}
              yAxis = {[{label: "Amount", labelStyle:{color: 'white'} }]}
              series={
                activeReports.map((activeReportData, idx) => {
                  return {
                    label: activeReportData.spentType,
                    curve: 'linear',
                    data: monthNames.map((month, idx) => 
                      activeReportData.monthlyExpense?.monthlyAmounts[month.toUpperCase()]
                        ?.monthlyItemCategoryTotalAmount ?? 0,
                    ),
                    // valueFormatter: (val) => `${val}`
                  };
                })
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
