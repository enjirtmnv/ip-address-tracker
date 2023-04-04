import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

import MarkerAddress from "./components/MarkerAddress";
import arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg.png";
import InfoItem from "./components/InfoItem.js";

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
      console.trace(e)
    }
  }, [])

  const getEnteredAddress = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&${checkInput(ipAddress)}`)
    
    if (!res.ok) {
      const message = `An error occured: ${res.status}`
      throw new Error(message)
    }
    
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
        <div className="absolute w-screen h-96">
          <img
            src={background}
            alt=""
            className="w-full h-96 object-cover"
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
              -mb-56 md:-mb-28 lg:-mb-20"
            style={{zIndex: 500}}
          >
            
          <InfoItem name='IP Address' info={address.ip}/>
          <InfoItem name='Location' info={`${address.location.city}, ${address.location.region}`}/>
          <InfoItem name='Timezone' info={address.location.timezone}/>
          <InfoItem name='Isp' info={address.isp}/>

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
