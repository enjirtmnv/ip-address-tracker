import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

import MarkerAddress from "./MarkerAddress";
import arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg.png";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [domain, setDomain] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/
  const checkInput = (ip) => {
    if (checkIpAddress.test(ip)) {
      return `ipAddress=${ip}`
    }
    if (checkDomain.test(ip)) {
      return `domain=${ip}`
    }
    return ''
  }  

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}`)
        const data = await res.json()
        setAddress(data)
        setDomain(data.as.domain)
      }

      getInitialData();

    } catch(e)  {
      console.trace(error)
    }
  }, [])

  const getEnteredAddress = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&${checkInput(ipAddress)}`)
      const data = await res.json()
    setAddress(data)
    setDomain(data.as.domain)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    getEnteredAddress()
    setIpAddress("")
  }

  return (
    <>
      <section className="w-screen h-screen bg-[#5364c8]">
        <div className="absolute w-screen h-80">
          <img
            src={background}
            alt=""
            className="w-full h-80 object-cover"
          />
        </div>
        <article className="relative pt-20 px-8 pb-8">
          <h1 className="text-2xl lg:text-3xl text-center text-white font-bold mb-8">IP Address Tracker</h1>
          <form 
            className="flex justify-center max-w-xl mx-auto"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <input
              type="text"
              name="ipaddress"
              id="ipaddress" 
              placeholder="Search for any IP address or domain"
              className="py-2 px-4 rounded-l-lg w-full"
              required
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-black py-4 px-4 hover:opacity-60 rounded-r-lg"
            >
              <img src={arrow} alt=""/>
            </button>
          </form>
        </article>

        {
          address && 
          <>
          <article 
            className="relative bg-white rounded-lg 
              shadow p-8 mx-8 grid grid-cols-1 gap-8 md:grid-cols-2 
              lg:grid-cols-4 lg:max-w-4xl xl:max-w-6xl lg:mx-auto text-center md:text-left
              lg:-mb-20"
            style={{zIndex: 500}}
          >

          <div className="lg:border-r lg:border-slate-400 pr-8">
            <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">IP Address</h2>
            <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">{address.ip}</p>
          </div>  

          <div className="lg:border-r lg:border-slate-400 pr-8">
            <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">Location</h2>
            <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">{address.location.city}, {address.location.region}</p>
          </div>  

          <div className="lg:border-r lg:border-slate-400 rx-8">
            <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">Timezone</h2>
            <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">UTC {address.location.timezone}</p>
          </div>  

          <div className="pr-8">
            <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">Isp</h2>
            <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">{address.isp}</p>
          </div>  

        </article>  
        <MapContainer 
          center={[address.location.lat, address.location.lng]} 
          zoom={13} 
          scrollWheelZoom={true}
          style={{ height: "600px", width: "100vw"}}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <MarkerAddress address={address} domain={domain}/>
        </MapContainer>
          </>
        }

      </section>
    </>
  );
}

export default App;
