import React,{useEffect, useState, useRef} from "react";
import { ethers } from "ethers";
import './App.css';
import contractJson from './utils/WaveContract.json'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import waveImg from './images/2.svg'
import hiImg from './images/hi.png'


export default function App() {

  const [account, setAccount] = useState("");
  const [isMining, setIsMining] = useState(false);
  const [isMined, setIsMined] = useState(false);
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");


  const contractAddress = '0x0CFdF8547E57C7Eeddae7b4b00396136760fa782';
  const contractABI = contractJson.abi;
  const isConnected = async()=>{
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

  const connectWallet = async()=>{
    try{
      const {ethereum} = window;
      if(!ethereum){
        console.log('!get metamask');
        return;
      }
      const accounts = await ethereum.request({method : "eth_requestAccounts"});
      console.log("Got account ", accounts[0]);
      setAccount(accounts[0]);
    }catch(error){
      console.log(error);
    }

  }

  const timer = ()=> {
    const t = setTimeout(()=>{
      setIsMined(false);
    },3000)
    return ()=>clearTimeout(t);
  }

  const wave = async()=>{
    try{
      const {ethereum} = window;
      if(ethereum)
      {
        console.log("hello");
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await contract.getTotalWaves();
        console.log('total waves : ',count.toNumber());

        // waving 
        setIsMining(true);
        
        const waveTxn = await contract.wave(message,{gasLimit : 300000});
        console.log('mining...',  waveTxn.hash);
        await waveTxn.wait();

        setIsMined(true);
        timer();
        setIsMining(false);

        console.log('mined..',waveTxn.hash);
        count = await contract.getTotalWaves();
        console.log('total waves : ',count.toNumber());
        getAllWaves();
      }
      else
      {
        console.log('Inside wave : don t have ethereum object');
      }
    }catch(error){
      setIsMining(false);
      console.log('Error inside wave function ',error);
    }
  }

  const getAllWaves = async()=> {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        let wavesArray = await contract.getAllWaves();
        
        let waves = [];
        wavesArray.forEach(temp => {
          waves.push({
            address : temp.waver,
            message : temp.mes,
            atTime : new Date(temp.atTime * 1000),
          })
        });
        setAllWaves(waves);
        
      }else{
        alert('You dont have ethereum object');
        return;
      }
    }catch(error){
      console.log('I am in getAllWaves function ', error);
    }
  }

  useEffect(()=>{
    isConnected();

    const onNewWave = (from, timestamp, message, won)=>{
      if(won) alert('You have been awarded')
      console.log("newwave",from,timestamp,message);
      setAllWaves(prevState => [...prevState, {
        address : from,
        message : message,
        atTime : new Date(timestamp * 1000)
      }])
    }
    let wavePortalContract;
    if(window.ethereum)
    {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on('NewWave',onNewWave);
    }

    return ()=> {
      if(wavePortalContract)
        wavePortalContract.off('NewWave',onNewWave);
    }
  },[])  

  const testing = ()=>{
    console.log(message);
  }
  
  return (
    <div className="mainContainer">
      <section className="waveImg">
        <img src={waveImg}/>
      </section>
      
      {
        !account && (<button className = "button" onClick={connectWallet}>Connect</button>)
      }
      
      {
        isMining ? 
        (
          <div className= "mining">
            <span className="circularProgress"><CircularProgress /></span>
            <span>Mining...</span>
          </div>
        ):
        
        (<div className="waveContainer">
        <input type="text" onChange={(e)=>setMessage(e.target.value)}  className="waveContainerInput" name = "message" placeholder="say something.."/>
        <button onClick= {wave} className = " waveButton"><img className = "hiImg" src={hiImg}/> </button>
        </div>)
      }
      {
      isMined && <span style={{"color":"white"}}>Mining Complete...</span>
      }

      <table className = "showTable">
        <thead>
          <tr>
            <th>Address</th>
            <th>Message</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {
            allWaves.map((wave,index)=>{
              return <tr key={index}>
                <td className="linkGo"><a href={"https://rinkeby.etherscan.io/address/"+wave.address} target="_blank">{wave.address.toString().substr(0,20)+'...'}</a></td>
                <td>{wave.message}</td>
                <td>{wave.atTime.toString().substr(4,20)}</td>

              </tr>
            })
          }
        </tbody>
      </table>
      
    </div>
  );
}

