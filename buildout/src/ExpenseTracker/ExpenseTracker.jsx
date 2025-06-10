import DeleteIcon from '@mui/icons-material/Delete';
import style from "./ExpenseTracker.module.css";
import popupStyles from "./Popstyle.module.css";
import Edit from "@mui/icons-material/Edit";
import { PiPizza, PiGift } from "react-icons/pi";
import { BsSuitcase2 } from "react-icons/bs";
import { useState, useEffect } from "react";
import PieChart from "./Piechart/Piechart.jsx"
import BarChart from "./BarChart/BarChart.jsx"
export default function ExpenseTracker(){
  const[showPopup, setShowPopup] = useState(false);
  const[popupType, setPopupType] = useState("");
  const[amount, setAmount] = useState("");
  const[balance, setBalance] = useState(0);
  const[expense, setExpense] = useState({
    title: "",
    price: "",
    category: "",
    date: ""
  });
  
  // Calculate category spending dynamically
  const[categorySpends, setCategorySpends] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });
  
  const[expenseList, setExpenseList] = useState([]);
  const[editId, setEditId] = useState(0);
  const[isEditing, setIsEditing] = useState(false);
  const[currentPage, setCurrentPage] = useState(1);
  const[isMounted, setIsMounted] = useState(false);
  const maxRecords = 3;
  const[totalPages, setTotalPages] = useState(0);
  const[currentTransactions, setCurrentTransactions] = useState([]);
  
  // Initialize data from localStorage
  useEffect(() => {
    try {
      const localBalance = localStorage.getItem("balance");
      
      if (localBalance && !isNaN(Number(localBalance))) {
        setBalance(Number(localBalance));
      } else {
        // Set default balance if none exists or is invalid
        setBalance(5000);
        localStorage.setItem("balance", "5000");
      }
      
      const items = JSON.parse(localStorage.getItem("expenses") || "[]");
      // Add IDs to existing expenses if they don't have them
      const expensesWithIds = items.map((expense, index) => ({
        ...expense,
        id: expense.id || Date.now() + index
      }));
      
      setExpenseList(expensesWithIds);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setBalance(5000);
      setExpenseList([]);
    }
    
    setIsMounted(true);
  }, []);
  
  // Save balance to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("balance", balance.toString());
        console.log("Balance saved to localStorage:", balance);
      } catch (error) {
        console.error("Error saving balance to localStorage:", error);
      }
    }
  }, [balance, isMounted]);
  
  // Save expenses and calculate category spending when expense list changes
  useEffect(() => {
    try {
      if (expenseList.length > 0 || isMounted) {
        localStorage.setItem("expenses", JSON.stringify(expenseList));
      }
    } catch (error) {
      console.error("Error saving expenses to localStorage:", error);
    }
    
    // Calculate category spending
    let foodSpends = 0, entertainmentSpends = 0, travelSpends = 0;
    
    expenseList.forEach((item) => {
      const price = Number(item.price) || 0;
      if (item.category === "food") {
        foodSpends += price;
      } else if (item.category === "entertainment") {
        entertainmentSpends += price;
      } else if (item.category === "travel") {
        travelSpends += price;
      }
    });
    
    setCategorySpends({
      food: foodSpends,
      entertainment: entertainmentSpends,
      travel: travelSpends,
    });
  }, [expenseList, isMounted]);

  // Pagination logic
  useEffect(() => {
    const startIndex = (currentPage - 1) * maxRecords;
    const endIndex = Math.min(currentPage * maxRecords, expenseList.length);
    setCurrentTransactions([...expenseList].slice(startIndex, endIndex));
    setTotalPages(Math.ceil(expenseList.length / maxRecords));
  }, [currentPage, expenseList]);

  // Update page if all items on current page have been deleted
  useEffect(() => {
    if(totalPages < currentPage && currentPage > 1){
      setCurrentPage(prev => prev - 1);
    }
  }, [totalPages]);
  
  const handleClickAddExpense = () => { 
    setPopupType("expense");
    setIsEditing(false);
    setExpense({
      title: "",
      price: "",
      category: "",
      date: ""
    });
    setShowPopup(true);   
  }
  
  const handleClickAddIncome = () => {
    setPopupType("balance");
    setAmount(""); // Reset amount when opening popup
    setShowPopup(true);
  }
  
  const handleAddBalance = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    console.log("Add Balance clicked - Current amount:", amount);
    console.log("Add Balance clicked - Current balance:", balance);
    
    // Validate input
    if (!amount || amount.trim() === "") {
      alert("Please enter an amount");
      return;
    }
    
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum)) {
      alert("Please enter a valid number");
      return;
    }
    
    if (amountNum <= 0) {
      alert("Income should be greater than 0");
      return;
    }
    
    // Update balance
    setBalance(prevBalance => {
      const newBalance = prevBalance + amountNum;
      console.log("Balance updated from", prevBalance, "to", newBalance);
      return newBalance;
    });
    
    alert("Balance added successfully!");
    setAmount("");
    setShowPopup(false);
  }
  
  const handleCancelBalance = () => {
    setAmount("");
    setShowPopup(false);
  }
  
  const handleAddExpense = () => {
    const {title, price, category, date} = expense;
    
    if(!title || !price || !category || !date) {
      alert("Please fill all expense fields");
      return;
    }
    
    const expenseAmount = parseFloat(price);
    
    if(isNaN(expenseAmount) || expenseAmount <= 0) {
      alert("Please enter a valid expense amount");
      return;
    }
    
    if(isEditing) {
      // Handle edit
      const existingExpense = expenseList.find(exp => exp.id === editId);
      if (!existingExpense) {
        alert("Expense not found");
        return;
      }
      
      const oldAmount = Number(existingExpense.price) || 0;
      const amountDifference = expenseAmount - oldAmount;
      
      // Check if sufficient balance for the difference
      if(balance < amountDifference) {
        alert("Insufficient balance!");
        return;
      }
      
      // Update balance
      setBalance(prevBalance => prevBalance - amountDifference);
      
      // Update expense in list
      const updatedList = expenseList.map(exp => 
        exp.id === editId ? { ...expense, price: expenseAmount.toString(), id: editId } : exp
      );
      setExpenseList(updatedList);
      alert("Expense updated successfully");
    } else {
      // Handle add new
      if(balance < expenseAmount) {
        alert("Insufficient balance!");
        return;
      }
      
      setBalance(prevBalance => prevBalance - expenseAmount);
      
      const newExpense = { 
        ...expense, 
        price: expenseAmount.toString(),
        id: Date.now() 
      };
      setExpenseList(prevList => [...prevList, newExpense]);
      alert("Expense added successfully");
    }
    
    setExpense({ title: "", price: "", category: "", date: "" });
    setShowPopup(false);
    setIsEditing(false);
  }
  
  const handleCancelExpense = () => {
    setExpense({
      title: "",
      price: "",
      category: "",
      date: ""
    });
    setIsEditing(false);
    setShowPopup(false);
  }
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value
    }));
  }
  
  const handleDeleteExpense = (id) => {
    const expenseToDelete = expenseList.find(exp => exp.id === id);
    if (!expenseToDelete) {
      alert("Expense not found");
      return;
    }
    
    const expenseAmount = Number(expenseToDelete.price) || 0;
    
    // Return money to balance
    setBalance(prevBalance => prevBalance + expenseAmount);
    
    // Remove from list
    const updatedList = expenseList.filter(exp => exp.id !== id);
    setExpenseList(updatedList);
    alert("Expense deleted successfully");
  };

  const handleEditExpense = (id) => {
    const expenseToEdit = expenseList.find(exp => exp.id === id);
    if (!expenseToEdit) {
      alert("Expense not found");
      return;
    }
    
    setExpense(expenseToEdit);
    setEditId(id);
    setIsEditing(true);
    setPopupType("expense");
    setShowPopup(true);
  };
  
  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()){
     case "food" : return <PiPizza style={{fontSize: "20px"}}/>
     case "entertainment": return <PiGift style={{fontSize: "20px"}}/>
     case "travel": return <BsSuitcase2 style={{fontSize: "20px"}}/>
     default: return null;
    }
  }
  
  const getTopExpenses = () => {
    const categoryTotals = expenseList.reduce((acc, expense) => {
      const amount = Number(expense.price) || 0;
      acc[expense.category] = (acc[expense.category] || 0) + amount;
      return acc;
    }, {});
    
    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const totalExpenses = expenseList.reduce((acc, curr) => {
    const amount = Number(curr.price) || 0;
    return acc + amount;
  }, 0);
  
  // Ensure balance is always a number for display
  const displayBalance = isNaN(balance) ? 0 : balance;
  const displayTotalExpenses = isNaN(totalExpenses) ? 0 : totalExpenses;
  
  return(
    <div style={{width:"100vw",height:"100vh",boxSizing:"border-box",backgroundColor:"#3B3B3B",display:"flex",flexDirection:"column"}}>
      <h1 style={{color:"white",marginLeft:"30px",fontWeight:"700",fontSize:"32px"}}>Expense Tracker</h1>
      <header style={{backgroundColor:"#626262",height:"40%",marginLeft:"32px",marginRight:"32px",display:"flex",flexWrap:"wrap",justifyContent:"space-between"}}>
        <div style={{height:"100%",width:"70%",display:"flex",justifyContent:"space-around"}}>
          <div style={{height:"80%",width:"35%",backgroundColor:"#9B9B9B",margin:"20px",borderRadius:"15px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <h2 className={style.heading}>
              Wallet Balance: <span style={{color:"#B5DC52"}}>₹{displayBalance.toFixed(2)}</span>
            </h2>
            <button 
              onClick={handleClickAddIncome} 
              type="button"
              labeled="+ Add Income"
              style={{cursor:"pointer",backgroundColor:"#B5DC52",width:"167px",height:"38px",borderRadius:"15px",fontSize:"16px",fontWeight:"700",color:"white",border:"none"}}
            >
              + Add Income
            </button>
          </div>
          <div style={{height:"80%",width:"35%",backgroundColor:"#9B9B9B",margin:"20px",borderRadius:"15px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <h2 className={style.heading} data-testid="total-expenses">
              Expenses: <span style={{color:"#F4BB4A"}}>₹{displayTotalExpenses.toFixed(2)}</span>
            </h2>
            <button 
              onClick={handleClickAddExpense} 
              type="button" 
              aria-label="Add new expense"
              labeled="+ Add Expense"
              style={{cursor:"pointer",backgroundColor:"#FF4747",width:"167px",height:"38px",borderRadius:"15px",fontSize:"16px",fontWeight:"700",color:"white",border:"none"}}
            >
              + Add Expense
            </button>
          </div>
        </div>
        
        {/* Pie Chart Section */}
        <div style={{height:"100%",width:"29%",display:"flex",flexDirection:"column",gap:"10px"}}>
          <div style={{backgroundColor:"white",width:"100%",height:"80%"}}>
            <PieChart
              data={[
                { name: "Food", value: categorySpends.food },
                { name: "Entertainment", value: categorySpends.entertainment },
                { name: "Travel", value: categorySpends.travel },
              ]}
            />
          </div>
        </div>
      </header>
      
      {/* Popup Modal */}
      {showPopup && (
        <div className={popupStyles.overlay} data-testid="popup-overlay">
          {popupType === "expense" ? (
            <div className={popupStyles.expensepopup} style={{gap:"20px",display:"flex",flexDirection:"column",border:"none"}}>
              <h2 style={{fontWeight:"700",fontSize:"30px",marginLeft:"30px"}}>
                {isEditing ? "Edit Expense" : "Add Expenses"}
              </h2>
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
                <input 
                  name="title" 
                  value={expense.title} 
                  className={style.input} 
                  placeholder="Title" 
                  onChange={handleChange}
                />
                <input 
                  name="price" 
                  value={expense.price} 
                  className={style.input} 
                  type="number"
                  placeholder="Price" 
                  onChange={handleChange}
                />
              </div>
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
                <select className={style.category} name="category" value={expense.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="food">Food</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="travel">Travel</option>
                </select>
                <input 
                  name="date" 
                  type="date" 
                  value={expense.date} 
                  className={style.category} 
                  onChange={handleChange}
                />
              </div>
              <div style={{display:"flex",gap:"20px",marginLeft:"35px"}}>
                <button type="submit" onClick={handleAddExpense} type="button" data-testid="submit-expense-btn" className={style.addbutton}>
                  {isEditing ? "Update Expense" : "Add Expense"}
                </button>
                <button onClick={handleCancelExpense} type="button" className={style.cancelbutton}>Cancel</button>
              </div>
            </div>
          ):(
            <div className={popupStyles.balancepopup}  style={{gap:"20px",display:"flex",flexDirection:"column",border:"none"}}>
              <h2 style={{fontWeight:"700",fontSize:"30px",marginLeft:"30px"}}>Add Balance</h2>
              <form onSubmit={handleAddBalance} style={{display:"flex", flexDirection:"column", gap:"15px", padding:"0 20px"}}>
                <input 
                  value={amount} 
                  name="amount" 
                  className={style.input} 
                  type="number" 
                  placeholder="Income Amount" 
                  onChange={(e)=>setAmount(e.target.value)}
                  required
                />
                <div style={{display:"flex", gap:"20px", width:"100%", justifyContent:"center"}}>
                  <button 
                    type="number" 
                    labeled="Add Balance"
                    className={style.addBalance}
                  >
                    Add Balance
                  </button>
                  <button 
                    type="button"
                    onClick={handleCancelBalance}
                    className={style.cancelbutton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
      
      {/* Footer Section */}
      <footer style={{width:"100%",height:"55%",top:"10px",display:"flex",flexWrap:"wrap",margin:"32px",gap:"15px"}}>
        <div style={{width:"60%",display:"flex",flexDirection:"column"}}>
          <h2 className={style.footerHeading}>Recent Transactions</h2>
          <div style={{width:"100%",height:"100%"}}>
            <div style={{backgroundColor:"white",width:"100%",height:"100%",borderRadius:"10px",display:"flex",flexDirection:"column",paddingLeft:"10px"}} data-testid="transactions-list">
              {expenseList.length > 0 ? (
                <>
                  {currentTransactions.map((item) => (
                    <div key={item.id} style={{
                      display:"flex",
                      justifyContent:"space-between",
                      alignItems:"center",
                      padding:"10px",
                      marginBottom: "10px",
                      borderBottom: "1px solid #eee"
                    }} data-testid={`transaction-${item.id}`}>
                      <div style={{display:"flex",alignItems:"center",gap:"15px"}}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {getCategoryIcon(item.category)}
                        </div>
                        <div style={{display:"flex",flexDirection:"column"}}>
                          <h5 style={{margin: "0", fontSize: "16px", fontWeight: "600"}}>{item.title}</h5>
                          <p style={{margin: "0", fontSize: "14px", color: "#666"}}>{item.date}</p>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:"15px"}}>
                        <p style={{margin: "0", fontSize: "16px", fontWeight: "600"}}>₹{(Number(item.price) || 0).toFixed(2)}</p>
                        <div style={{display:"flex",gap:"10px"}}>
                          <button 
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "5px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            onClick={() => handleEditExpense(item.id)}
                            data-testid={`edit-${item.id}`}
                          >
                            <Edit style={{fontSize: "18px", color: "#007bff"}} />
                          </button>
                          <button 
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "5px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            onClick={() => handleDeleteExpense(item.id)}
                            data-testid={`delete-${item.id}`}
                          >
                            <DeleteIcon style={{fontSize: "18px", color: "#dc3545"}} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"10px", marginTop:"10px"}}>
                      <button 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        style={{
                          padding:"5px 10px",
                          backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
                          color:"white",
                          border:"none",
                          borderRadius:"5px",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer"
                        }}
                        data-testid="prev-page"
                      >
                        Previous
                      </button>
                      <span style={{margin:"0 10px"}} data-testid="page-info">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        style={{
                          padding:"5px 10px",
                          backgroundColor: currentPage === totalPages ? "#ccc" : "#007bff",
                          color:"white",
                          border:"none",
                          borderRadius:"5px",
                          cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                        }}
                        data-testid="next-page"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div data-testid="no-transactions" style={{padding:"20px",textAlign:"center"}}>No transactions!</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Top Expenses Section */}
        <div style={{height:"100%",width:"35%",display:"flex",flexDirection:"column"}}>
          <h2 className={style.footerHeading}>Top Expenses</h2>
          <div style={{backgroundColor:"white",width:"100%",height:"100%",display:"flex",flexDirection:"column",borderRadius:"10px"}}>
                <BarChart
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ]}
        />
          </div>
        </div>
      </footer>
    </div>
  )
}