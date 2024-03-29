import React, { useState, useEffect } from 'react'
import Loading from './Loading';
import Ussd from './Ussd';
import Card from './Card';
import LinkZone from '@/types/LinkZone';

const linkZone = new LinkZone();

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(!loading)
    }, 1500);
  }, []);

  useEffect(()=>{
    linkZone.setLinkZoneUrl(import.meta.env.DEV? "localhost:8080" : window.location.host)
  }, [])
  
  return (
    <React.Fragment>
      <Loading loading={loading} />
      {!loading ? 
      <main className="w-full flex flex-wrap justify-center mt-10">
        <Card linkZoneController={linkZone} />
        <Ussd linkZoneController={linkZone} />
      </main>
      : <></>}
    </React.Fragment>
  )
}

export default App