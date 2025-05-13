import { budgetHeaders} from '../utils/constantHelper';
import { spentTypeColorMap, tdCSS } from '../utils/cssConstantHelper';

const LOG_PREFIX = "UpdateBudgetPage::"
const keys = Object.keys(spentTypeColorMap);
const randomKey = Object.keys(spentTypeColorMap)[Math.floor(Math.random() * Object.keys(spentTypeColorMap).length)];

// Get the corresponding value
const randomValue = spentTypeColorMap[randomKey];

export default function LoadingTableComponent({}) {
    return (
        <>
        {[...Array(25)].map((_, idx) => {
                const keys = Object.keys(spentTypeColorMap);
                const randomKey = Object.keys(spentTypeColorMap)[Math.floor(Math.random() * Object.keys(spentTypeColorMap).length)];
                return <tr key={idx} className={`animate-pulse ${spentTypeColorMap[randomKey]}`}>
            {[...Array(budgetHeaders.length + 1)].map((_, idx) => {
                return <td key={idx} className={`${tdCSS}`}> </td>
            })}
        </tr>
        
        })}
        </>
    );
};
