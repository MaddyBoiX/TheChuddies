import './App.css'
import { useState } from 'react'
import Geocoder from './components/Geocoder.jsx'
import MapRegion from './components/MapRegion.jsx'

function App() {
  const [coordinates, setCoordinates] = useState({ lat: 48.8566, lon: 2.3522 })

  return (
    <>
    <div className="container text-center my-5">
      <h1 className="display-4 fw-bold text-primary">We are chuddies</h1>
    </div>
    <div className="container text-center my-5">
      <Geocoder
        lat={coordinates.lat}
        lon={coordinates.lon}
        onCoordinatesChange={setCoordinates}
      />
      <MapRegion
        lat={coordinates.lat}
        lon={coordinates.lon}
        onCoordinatesChange={setCoordinates}
      />
    </div>
    </>
  )
}

export default App
