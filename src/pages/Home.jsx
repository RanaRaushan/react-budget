import { Link } from "react-router-dom";
import { BUDGET_FE_URL } from "../utils/APIHelper";

export default function HomePage() {
    return (
        <>
          <div>
            <div className="header">
              <h1>Welcome to my Budget App</h1>
              <span className="author">Author@Rana</span>
            </div>
            <div>
                <span>Look at your budget here&nbsp;
                  <Link to={BUDGET_FE_URL}>
                      Budget
                  </Link>
                </span>
            </div>
          </div>
        </>
      );
}