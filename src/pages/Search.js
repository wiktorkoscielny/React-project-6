import React, { useRef, useState } from 'react'

// Mui components
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Styles
import '../App.css'

// GoogleMaps
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
 
  
const center = { lat: 40.71967, lng: -74.043117 }

export default function Search() {

  const [ libraries ] = useState(['places']);
  const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    }) 
  const [map, setMap] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [cost, setCost] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const costPerKilometer = useRef(Number)
  const originRef = useRef()
  const destiantionRef = useRef()
  
  // Set loading if map api is loading
  if (!isLoaded) {
    return <p>Loading...</p>
  }
  // Set markers on the map, calculate distance and travel time
  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text) 
  }

  // Clear states and inputs
  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setCost('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
    costPerKilometer.current.value = ''
  }

  // Calculate travel cost and duration:
  // Travel cost calculation is based on the sum mechanism
  //  • number of km * cost per kilometer 
  //  • constant multiplier of 110% of the sum
  //  • assuming that you can travel 800 km a day and the price per day is 1000
  function calculateCost() { 
    // Get number from variable  
    const getNumber = distance.slice(0, -3) 
    const number = Number(getNumber.replace(/\s/g, '').replace(',', '.'))
    // Calculate dependencies
    const costInput = costPerKilometer.current.value
    const travelCost = number * costInput
    const remainder = number % 800;
    const fee = 1000;
    const day = 1;
    const integer = Math.floor(number/800)
    const firstCondition = integer * fee + travelCost + fee;
    const secondCondition = integer * fee + travelCost;
       
    if (costPerKilometer.current.value === '' || originRef.current.value === '' || destiantionRef.current.value === '') 
      {
        alert("Fill inputs")
      } else if (distance === '' || duration === '') { 
        alert("Calculate route first")
      } else if (costPerKilometer.current.value < 1) {
        alert("Too low expense")
      } else if (travelCost === 0 || isNaN(travelCost) === true) {
        alert("Too short distance")
      } else if ( number > 800 && remainder > integer) {
        setCost((firstCondition * 1.1).toFixed() + ' ' + '$')
        setDuration(integer * day + day + ' ' + 'Days')
      } else if (number > 800) {
        setCost((secondCondition * 1.1).toFixed() + ' ' + '$')
        setDuration(integer * day + day + ' ' + 'Days')
      } else {
        setCost((travelCost * 1.1).toFixed() + ' ' + '$')
        setDuration(day + ' ' + 'Day')
      }
  }

  return (
    <div className="wrapper">
      <div className="front-ui">
        <div className="fui-box">
            <Autocomplete>
              <TextField 
                style={{margin: '10px'}}
                id="outlined-basic" 
                label="Origin" 
                variant="outlined"
                inputRef={originRef} 
              />
            </Autocomplete>
            <Autocomplete>
              <TextField 
                style={{margin: '10px'}}
                id="outlined-basic" 
                label="Destination" 
                variant="outlined"
                inputRef={destiantionRef} 
              />
            </Autocomplete>
              <TextField 
                style={{margin: '10px'}}
                id="outlined-basic" 
                label="Cost per kilometer" 
                variant="outlined"
                inputRef={costPerKilometer} 
              />
        
            <br />
            <Button 
              style={{
                maxWidth: "70%",
                minWidth: "70%",
                margin: '5px 10px'
              }}
              variant="contained"
              onClick={calculateRoute}
            >
                Calculate Route
            </Button>  
            <br />       
            <Button 
              style={{
                maxWidth: "70%",
                minWidth: "70%",
                margin: '5px 10px'
              }}
              variant="contained"
              onClick={calculateCost}
            >
              Calculate Cost
            </Button>
            <br />
            <Button 
            style={{
              maxWidth: "70%",
              minWidth: "70%",
              margin: '5px 10px'
            }}
            variant="contained"
              onClick={clearRoute}
            >
              x
            </Button>
            <br />
            <Button 
              style={{
                maxWidth: "70%",
                minWidth: "70%",
                margin: '5px 10px'
              }}
              variant="contained"
              onClick={() => {
                map.panTo(center)
                map.setZoom(15)
              }}
            >
              START POSITION
            </Button>
            <br />
          <div className="results-box">
            <div className="letters">
            DISTANCE 
            DURATION 
            COST 
            </div>
            <div className="results">
            {distance}
            <br />
            {duration}
            <br />
            {cost}
            </div>
          </div>
        </div>
      </div>    
        
      <div className="google-box">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '12px' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </div>
  )
}