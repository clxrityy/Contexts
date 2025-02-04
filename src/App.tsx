import { useEffect, useState } from 'react'
import './App.css'
import { Contexts } from './components/Contexts';
import { Toaster } from "react-hot-toast";
import logo from "./assets/logo.png";

function App() {

  const [tab, setTab] = useState<chrome.tabs.Tab>();

  useEffect(() => {
    async function getCurrentTab() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        tabs.forEach((tb) => {
          setTab(tb)
        })
      })
    }

    getCurrentTab()
  }, [tab]);

  return (
    <div className='flex flex-col gap-5 items-center justify-center p-2 w-full'>
      <div className='flex flex-row gap-3 items-center justify-start p-2'>
        <h1 className='uppercase font-light text-[#d16d6a]'>Contexts</h1> <img src={logo} alt="logo" className='w-10 h-10' />
      </div>
      <div className='flex flex-col gap-2 items-center justify-start p-2'>
        <h2 className='text-xl font-medium max-w-[300px]'>{tab?.title}</h2>
      </div>
      <div className='flex flex-col gap-2 items-center justify-start p-2'>
        {
          tab && <Contexts props={{ tab }} />
        }
      </div>
      <Toaster />
    </div>
  )
}

export default App
