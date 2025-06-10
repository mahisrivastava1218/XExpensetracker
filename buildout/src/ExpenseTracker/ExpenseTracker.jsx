
import DeleteIcon from '@mui/icons-material/Delete';
import style from "./ExpenseTracker.module.css";
import popupStyles from "./Popstyle.module.css";
import Edit from "@mui/icons-material/Edit";
import Food from '@mui/icons-material/LocalDining';
import Travel from '@mui/icons-material/DepartureBoard';
import Entertainment from'@mui/icons-material/VideogameAssetOff';
import { useState,useEffect } from "react";

export default function ExpenseTracker(){
  // we want to show popup but css will same only under the box content change 
  const[showPopup,setShowPopup]= useState(false);
  const[popupType,setPopupType]= useState("");
  const[amount,setAmount] = useState("");
  // localstorage wallet
  const[balance,setBalance] = useState(0);
  const[expense,setExpense] = useState({
    title:"",
    price:"",
    category:"",
    date:""
  });
  const[expenseList,setExpenseList] = useState([]) //to store all expenses
  
  useEffect(()=>{
    const savedBalance=localStorage.getItem("balance");
    if(savedBalance){
      setBalance(Number(savedBalance));
    }
    //get expenses from localstorage - Fixed key name for Cypress tests
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")|| "[]");
    setExpenseList(savedExpenses);
  },[])
  
  //save balance to localStorage when it changes
  useEffect(()=>{
    localStorage.setItem("balance", balance.toString());
  },[balance]);
  
  //save updated expenses when expense list change - Fixed key name
  useEffect(()=>{
    localStorage.setItem("expenses",JSON.stringify(expenseList));
  },[expenseList]);
  
  const handleClickAddExpense=()=>{ 
      setPopupType("expense");
      setShowPopup(true);   
  }
  
  const handleClickAddIncome=()=>{
      setPopupType("balance");
      setShowPopup(true);
  }
  
  const handleAddBalance=()=>{
    const amountNum = Number(amount);
    if(amount && amountNum > 0){
         const newBalance = balance + amountNum;
         setBalance(newBalance);
         alert("Balance added successfully");
        //  clear input
         setAmount("");
         setShowPopup(false);
    }else{
      alert("Please enter a valid positive amount")
    }
  }
  
  const handleCancelBalance=()=>{
    setAmount("");
    setShowPopup(false);
  }
  
  // FIXED: Now deducts balance and adds proper validation
  const handleAddExpense=()=>{
    const{title,price,category,date} = expense;
    if(title && price && category && date){ 
      const expenseAmount = Number(price);
      
      // Check if sufficient balance
      if(balance < expenseAmount) {
        alert("Insufficient balance!");
        return;
      }
      
      // Deduct from balance - This was missing!
      setBalance(balance - expenseAmount);
      
      const updatedList = [...expenseList, expense];
      setExpenseList(updatedList);
      alert("Expense added successfully");
      setExpense({ title: "", price: "", category: "", date: "" });
      setShowPopup(false);
    }else{
      alert("Please fill all expense fields");
    }
  }
  
  const handleCancelExpense=()=>{
    setExpense({
        title:"",
        price:"",
        category:"",
        date:""
    })
    setShowPopup(false);
  }
  
  const handleChange=(e)=>{
    const{name,value}=e.target;
    setExpense((prev)=>({
      ...prev,
      [name]:value
    }));
  }
  
  // NEW: Delete expense functionality
  const handleDeleteExpense = (indexToDelete) => {
    const expenseToDelete = expenseList[indexToDelete];
    // Return money to balance
    setBalance(balance + Number(expenseToDelete.price));
    
    // Remove from list
    const updatedList = expenseList.filter((_, index) => index !== indexToDelete);
    setExpenseList(updatedList);
    alert("Expense deleted successfully");
  };
  
  const getCategoryIcon=(category)=>{
    switch(category){
     case "Food" : return <Food/>
     case "Entertainment": return <Entertainment/>
     case "Travel": return <Travel/>
     default: return null;
    }
  }
  
  // NEW: Calculate top expenses by category
  const getTopExpenses = () => {
    const categoryTotals = expenseList.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.price);
      return acc;
    }, {});
    
    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };
  
  const totalExpenses = expenseList.reduce((acc,curr)=>acc+Number(curr.price),0);
  const totalbalance = balance;
  
  return(
        <div style={{width:"100vw",height:"100vh",boxSizing:"border-box",backgroundColor:"#3B3B3B",display:"flex",flexDirection:"column"}}>
          <h1 style={{color:"white",marginLeft:"30px",fontWeight:"700",fontSize:"32px"}}>Expense Tracker</h1>
          <header style={{backgroundColor:"#626262",height:"40%",marginLeft:"32px",marginRight:"32px",display:"flex",flexWrap:"wrap",justifyContent:"space-between"}}>
          <div style={{height:"100%",width:"70%",display:"flex",justifyContent:"space-around"}}>
            <div style={{height:"80%",width:"35%",backgroundColor:"#9B9B9B",margin:"20px",borderRadius:"15px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <h2 className={style.heading} data-testid="wallet-balance">Wallet Balance: <span style={{color:"#B5DC52"}}>₹{totalbalance}</span></h2>
              <button 
                onClick={handleClickAddIncome} 
                type="button" 
                aria-label="Add income to wallet balance"
                style={{cursor:"pointer",backgroundColor:"#B5DC52",width:"167px",height:"38px",borderRadius:"15px",fontSize:"16px",fontWeight:"700",color:"white",border:"none"}}
              >
                + Add Income
              </button>
            </div>
            <div style={{height:"80%",width:"35%",backgroundColor:"#9B9B9B",margin:"20px",borderRadius:"15px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <h2 className={style.heading} data-testid="total-expenses">Expenses: <span style={{color:"#F4BB4A"}}>₹{totalExpenses}</span></h2>
              <button 
                onClick={handleClickAddExpense} 
                type="button" 
                aria-label="Add new expense"
                style={{cursor:"pointer",backgroundColor:"#FF4747",width:"167px",height:"38px",borderRadius:"15px",fontSize:"16px",fontWeight:"700",color:"white",border:"none"}}
              >
                + Add Expense
              </button>
            </div>
          </div>
          {showPopup && (
            <div className={popupStyles.overlay} data-testid="popup-overlay">
            {popupType === "expense" ? (
                <div className={popupStyles.expensepopup} data-testid="expense-popup" style={{gap:"20px",display:"flex",flexDirection:"column",border:"none"}}>
                <h2 style={{fontWeight:"700",fontSize:"30px",marginLeft:"30px"}}>Add Expenses</h2>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
                  <input name="title" value={expense.title} data-testid="expense-title" className={style.input} placeholder="Title" onChange={handleChange}/>
                   <input name="price" value={expense.price} data-testid="expense-price" className={style.input} placeholder="Price" onChange={handleChange}/>
                </div>
                 <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
                  <select className={style.category} name="category" value={expense.category} data-testid="expense-category" onChange={handleChange}>
                    <option>Select Category</option>
                    <option>Food</option>
                    <option>Entertainment</option>
                    <option>Travel</option>
                  </select>
                   <input name="date" type="date" value={expense.date} data-testid="expense-date" className={style.category} placeholder="dd/mm/yyyy" onChange={handleChange}/>
                </div>
                 <div style={{display:"flex",gap:"20px",marginLeft:"35px"}}>
                  <button onClick={handleAddExpense} type="submit" data-testid="submit-expense-btn" className={style.addbutton}>Add Expense</button>
                  <button onClick={handleCancelExpense} data-testid="cancel-expense-btn" className={style.cancelbutton}>Cancel</button>
                </div>
              </div>
            ):(
                <div className={popupStyles.balancepopup} data-testid="balance-popup" style={{gap:"20px",display:"flex",flexDirection:"column",border:"none"}}>
                <h2 style={{fontWeight:"700",fontSize:"30px",marginLeft:"30px"}}>Add Balance</h2>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
                   <input 
                     value={amount} 
                     name="amount" 
                     className={style.input} 
                     type="number" 
                     placeholder="Income Amount" 
                     data-testid="income-amount"
                     onChange={(e)=>setAmount(e.target.value)}
                   />
                   <button 
                     onClick={handleAddBalance} 
                     type="submit" 
                     className={style.addBalance}
                   >
                     Add Balance
                   </button>
                   <button 
                     onClick={handleCancelBalance}
                     className={style.cancelbutton}
                   >
                     Cancel
                   </button>
                </div>
              </div>
            )}
            </div>
          )}
          <div style={{height:"100%",width:"29%",display:"flex",flexDirection:"column",gap:"10px"}}>
            <div style={{backgroundColor:"white",width:"100%",height:"80%"}}></div>
            <div style={{width:"100%",height:"5%",display:"flex",flexWrap:"wrap",color:"white",bottom:"11px",gap:"10px",alignItems:"center",justifyContent:"center"}}>
              <div style={{height:"100%",backgroundColor:"#A000FF",width:"10%",color:"white"}}></div>
              <div>Food</div>
               <div style={{height:"100%",backgroundColor:"#FF9304",width:"10%",color:"white"}}></div>
              <div>Entertainment</div>
               <div style={{height:"100%",backgroundColor:"#FDE006",width:"10%",color:"white"}}></div>
              <div>Travel</div>
            </div>
          </div>
          </header>
          <footer style={{width:"100%",height:"55%",top:"10px",display:"flex",flexWrap:"wrap",margin:"32px",gap:"15px"}}>
            <div style={{width:"60%",display:"flex",flexDirection:"column"}}>
                   <h2 className={style.footerHeading}>Transactions</h2>
               <div style={{width:"100%",height:"100%"}}>
                <div style={{backgroundColor:"white",width:"100%",height:"100%",borderRadius:"10px",display:"flex",flexDirection:"column",paddingLeft:"10px"}} data-testid="transactions-list">
                  {expenseList.length>0 ? (
                    expenseList.map((item,index)=>(
                    <div key={index} style={{display:"flex",justifyContent:"space-between",marginBottom: "10px"}} data-testid={`transaction-${index}`}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
                      {getCategoryIcon(item.category)}
                      <div style={{display:"flex",flexDirection:"column"}}>
                      <div><strong>{item.title}</strong></div>
                      <div>{item.date}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
                      <div>₹{item.price}</div>
                      <Edit alt="edit"/>
                      <DeleteIcon 
                        style={{cursor:"pointer"}} 
                        onClick={() => handleDeleteExpense(index)}
                        data-testid={`delete-${index}`}
                      />
                    </div>
                    </div>
                    ))
                ):(
                  <div data-testid="no-transactions">No transactions!</div>
                )}
                </div>
               </div>
            </div>
            <div style={{height:"100%",width:"35%",display:"flex",flexDirection:"column"}}>
               <h2 className={style.footerHeading}>Top Expenses</h2>
               <div style={{backgroundColor:"white",width:"100%",height:"100%",display:"flex",flexDirection:"column",borderRadius:"10px"}}>
                {getTopExpenses().length > 0 ? (
                  getTopExpenses().map(([category, amount]) => (
                    <div key={category} style={{width:"100%",height:"10%",margin:"30px"}}>
                      {category}<span style={{marginLeft:"10px"}}>₹{amount}</span>
                    </div>
                  ))
                ) : (
                  <div style={{width:"100%",height:"10%",margin:"30px"}}>No expenses yet!</div>
                )}
               </div>
            </div>
          </footer>
        </div>
    )
}