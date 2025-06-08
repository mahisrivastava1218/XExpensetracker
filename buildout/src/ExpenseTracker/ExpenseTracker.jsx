import style from "./ExpenseTracker.module.css";
export default function ExpenseTracker(){
    return(
        <div style={{width:"100%",height:"100%",backgroundColor:"#3B3B3B",display:"flex",flexDirection:"column",boxSizing:"border-box"}}>
          <h1 style={{color:"white",marginLeft:"30px",fontWeight:"700",fontSize:"32px"}}>Expense Tracker</h1>
          <header style={{backgroundColor:"#626262",height:"40%",marginLeft:"32px",marginRight:"32px",display:"flex",flexWrap:"wrap",justifyContent:"space-between"}}>
          <div style={{height:"100%",width:"70%",display:"flex",justifyContent:"space-around"}}>
            <div style={{height:"80%",width:"35%",backgroundColor:"#9B9B9B",margin:"20px",borderRadius:"15px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <h1 className={style.heading}>Wallet Balance: <span style={{color:"#B5DC52"}}>Rs.4500</span></h1>
              <button style={{backgroundColor:"#B5DC52",width:"167px",height:"38px",borderRadius:"15px",fontSize:"16px",fontWeight:"700",color:"white",border:"none"}}>+Add income</button>
            </div>
            <div style={{height:"80%",width:"35%",backgroundColor:"#9B9B9B",margin:"20px",borderRadius:"15px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <h1 className={style.heading}>Expenses: <span style={{color:"###F4BB4A"}}>Rs.500</span></h1>
              <button style={{backgroundColor:"#FF4747",width:"167px",height:"38px",borderRadius:"15px",fontSize:"16px",fontWeight:"700",color:"white",border:"none"}}>+Add Expense</button>
            </div>
          </div>
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
                   <h1 className={style.footerHeading}>Recent Transactions</h1>
               <div style={{width:"100%",height:"100%"}}>
                <div  style={{backgroundColor:"white",width:"100%",height:"15%",borderRadius:"10px",display:"flex",alignItems:"center",paddingLeft:"10px"}}>No transactions!</div>
               </div>
            </div>
            <div style={{height:"100%",width:"35%",display:"flex",flexDirection:"column"}}>
               <h1 className={style.footerHeading}>Top Expenses</h1>
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