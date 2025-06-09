import style from "./ExpenseTracker.module.css";
import popupStyles from "./Popstyle.module.css";
import { useState } from "react";
export default function ExpenseTracker(){
  // we want to show popup but css will same only under the box content change 
  const[showPopup,setShowPopup]= useState(false);
  const[popupType,setPopupType]= useState("");
  const [amount,setAmount] = useState("");
  const[expense,setExpense] = useState({
    title:"",
    price:"",
    category:"",
    date:""
  });
  const handleClickAddExpense=()=>{ 
      setPopupType("expense");
      setShowPopup(true);   
  }
  const handleClickAddIncome=()=>{
      setPopupType("balance");
      setShowPopup(true);
  }
  const handleAddBalance=()=>{
    if(amount){
         localStorage.setItem("balance",amount);
         alert("Balance added successfully");
        //  clear input
         setAmount("");
    }else{
      alert("Please fill amount")
    }
  }
  const handleCancelBalance=()=>{
    setAmount("");
  }
  const handleAddExpense=()=>{
    const{title,price,category,date} = expense;
    if(title && price && category && date){ 
      localStorage.setItem("expense",JSON.stringify(expense));
       alert("Expense added successfully");
        //  clear input
         setExpense({
           title:"",
           price:"",
           category:"",
           date:""
         });
    }else{
      alert("Please fill Expense");
    }
  }
  const handleCancelExpense=()=>{
    setExpense({
        title:"",
        price:"",
        category:"",
        date:""
    })
  }
  const handleChange=(e)=>{
    const{name,value}=e.target;
    setExpense((prev)=>({
      ...prev,
      [name]:value
    }));
  }
  console.log(localStorage.getItem("expense","balance"));
    return(
        <div style={{width:"100%",height:"100%",backgroundColor:"#3B3B3B",display:"flex",flexDirection:"column",boxSizing:"border-box"}}>
          <h1 style={{color:"white",marginLeft:"30px",fontWeight:"700",fontSize:"32px"}}>Expense Tracker</h1>
          <header style={{backgroundColor:"#626262",height:"40%",marginLeft:"32px",marginRight:"32px",display:"flex",flexWrap:"wrap",justifyContent:"space-between"}}>
          <div style={{height:"100%",width:"70%",display:"flex",justifyContent:"space-around"}}>
            <div style={{height:"80%",width:"35%",backgroundColor:"#9B9B9B",margin:"20px",borderRadius:"15px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <h2 className={style.heading} labeled="Wallet Balance">Wallet Balance: <span style={{color:"#B5DC52"}}>₹5000</span></h2>
              <button onClick={handleClickAddIncome} type="button" labeled="+ Add Income" style={{cursor:"pointer",backgroundColor:"#B5DC52",width:"167px",height:"38px",borderRadius:"15px",fontSize:"16px",fontWeight:"700",color:"white",border:"none"}}>+Add Income</button>
            </div>
            <div style={{height:"80%",width:"35%",backgroundColor:"#9B9B9B",margin:"20px",borderRadius:"15px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <h2 className={style.heading}>Expenses: <span style={{color:"###F4BB4A"}}>₹0</span></h2>
              <button onClick={handleClickAddExpense} type="button" labeled="+ Add Expense" style={{cursor:"pointer",backgroundColor:"#FF4747",width:"167px",height:"38px",borderRadius:"15px",fontSize:"16px",fontWeight:"700",color:"white",border:"none"}}>+Add Expense</button>
            </div>
          </div>
          {showPopup && (
            <div className={popupStyles.overlay}>
            {popupType === "expense" ? (
                <div className={popupStyles.expensepopup} style={{gap:"20px",display:"flex",flexDirection:"column",border:"none"}}>
                <h2 style={{fontWeight:"700",fontSize:"30px",marginLeft:"30px"}}>Add Expenses</h2>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
                  <input name="title" value={expense.title}  className={style.input} placeholder="Title" onChange={handleChange}/>
                   <input name="price" value={expense.price}  className={style.input} placeholder="Price" onChange={handleChange}/>
                </div>
                 <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
                  <select className={style.category} name="category" value={expense.category} onChange={handleChange}>
                    <option>Select Category</option>
                    <option>Food</option>
                    <option>Entertainment</option>
                    <option>Travel</option>
                  </select>
                   <input name="date" type="date" value={expense.date} className={style.category} placeholder="dd/mm/yyyy" onChange={handleChange}/>
                </div>
                 <div style={{display:"flex",gap:"20px",marginLeft:"35px"}}>
                  <button  onClick={handleAddExpense} type="submit" labeled="Add Expense"  className={style.addbutton}>Add Expense</button>
                  <button onClick={handleCancelExpense} className={style.cancelbutton}>Cancel</button>
                </div>
              </div>
            ):(
                <div className={popupStyles.balancepopup} style={{gap:"20px",display:"flex",flexDirection:"column",border:"none"}}>
                <h2 style={{fontWeight:"700",fontSize:"30px",marginLeft:"30px"}}>Add Balance</h2>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
                   <input value={amount} name="amount" className={style.input} type="number" placeholder="Income Amount" onChange={(e)=>setAmount(e.target.value)}/>
                   <button onClick={handleAddBalance} type="submit" labeled="Add Balance" className={style.addBalance}>Add Balance</button>
                   <button onClick={handleCancelBalance}className={style.cancelbutton}>Cancel</button>
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
            <div style={{height:"100%",width:"60%",display:"flex",flexDirection:"column"}}>
                   <h2 className={style.footerHeading}>Recent Transactions</h2>
               <div style={{width:"100%",height:"100%"}}>
                <div  style={{backgroundColor:"white",width:"100%",height:"15%",borderRadius:"10px",display:"flex",alignItems:"center",paddingLeft:"10px"}}>No transactions!</div>
               </div>
            </div>
            <div style={{height:"100%",width:"35%",display:"flex",flexDirection:"column"}}>
               <h2 className={style.footerHeading}>Top Expenses</h2>
               <div style={{backgroundColor:"white",width:"100%",height:"100%",display:"flex",flexDirection:"column",borderRadius:"10px"}}>
                <div style={{width:"100%",height:"10%",margin:"30px"}}>Entertainment<span  style={{marginLeft:"10px"}}>hello</span></div>
                <div style={{width:"100%",height:"10%",margin:"30px"}}>Food<span  style={{marginLeft:"10px"}}>hello</span></div>
                <div style={{width:"100%",height:"10%",margin:"30px"}}>Travel<span  style={{marginLeft:"10px"}}>hello</span></div>
               </div>
            </div>
          </footer>
        </div>
    )
}