import ExpenseTracker from "./ExpenseTracker/ExpenseTracker";
import {Routes,Route} from "react-router-dom";
function App() {
  return (
    <Routes>
    <Route path="/" element ={<ExpenseTracker/>}/>
    </Routes>
  );
}

export default App;
