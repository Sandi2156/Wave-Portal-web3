const  isConnected = async()=>{
   try{
      const {ethereum} = window;
    if(!ethereum)
    {
      alert("Make sure you have metamask..");
      return;
    }
    else{
      console.log('got the ethereum',ethereum);
      getAllWaves();
    }

    const accounts = await ethereum.request({method : "eth_accounts"});
    if(accounts.length != 0)
    {
      console.log("account found ",accounts[0]);
      setAccount(accounts[0]);
    }
    else
    {
      console.log("no account found");
      return;
    }
   }
   catch(error)
   {
     console.log(error);
   }
  }

  export default isConnected;