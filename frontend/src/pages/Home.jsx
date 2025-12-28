import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    socket.on('ride-confirmed', ride => {


        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


        setFare(response.data)


    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


    }

        



  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-100">

      {/* Logo */}
      <img
        className="w-14 absolute left-4 top-4 z-20"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber"
      />

      {/* MAP */}
      <div className="absolute inset-0">
        <LiveTracking />
      </div>

      {/* SEARCH PANEL */}
      <div className="absolute bottom-0 w-full flex justify-center z-20">
        <div className="w-full max-w-md bg-white rounded-t-2xl shadow-lg">

          <div className="p-5 relative">
            <button
              ref={panelCloseRef}
              onClick={() => setPanelOpen(false)}
              className="absolute right-5 top-5 text-2xl opacity-0 focus:outline-none"
              aria-label="Close panel"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </button>

            <h4 className="text-xl font-semibold mb-3">
              Find a trip
            </h4>

            <form className="relative space-y-3">
              <div className="absolute left-5 top-5 h-14 w-1 bg-gray-700 rounded-full"></div>

              <input
                onClick={() => {
                  setPanelOpen(true)
                  setActiveField('pickup')
                }}
                value={pickup}
                onChange={handlePickupChange}
                className="bg-gray-100 px-12 py-3 rounded-lg w-full focus:ring-2 focus:ring-black"
                placeholder="Add a pickup location"
              />

              <input
                onClick={() => {
                  setPanelOpen(true)
                  setActiveField('destination')
                }}
                value={destination}
                onChange={handleDestinationChange}
                className="bg-gray-100 px-12 py-3 rounded-lg w-full focus:ring-2 focus:ring-black"
                placeholder="Enter destination"
              />
            </form>

            <button
              onClick={findTrip}
              className="w-full mt-4 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
            >
              Find Trip
            </button>
          </div>

          {/* LOCATION SEARCH */}
          <div ref={panelRef} className="h-0 overflow-hidden">
            <LocationSearchPanel
              suggestions={activeField === 'pickup'
                ? pickupSuggestions
                : destinationSuggestions}
              setPanelOpen={setPanelOpen}
              setVehiclePanel={setVehiclePanel}
              setPickup={setPickup}
              setDestination={setDestination}
              activeField={activeField}
            />
          </div>

        </div>
      </div>

      {/* VEHICLE PANEL */}
      <div
        ref={vehiclePanelRef}
        className="fixed bottom-0 w-full flex justify-center z-30 translate-y-full"
      >
        <div className="w-full max-w-md bg-white rounded-t-2xl px-4 py-6">
          <VehiclePanel
            selectVehicle={setVehicleType}
            fare={fare}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>

      {/* CONFIRM RIDE */}
      <div
        ref={confirmRidePanelRef}
        className="fixed bottom-0 w-full flex justify-center z-30 translate-y-full"
      >
        <div className="w-full max-w-md bg-white rounded-t-2xl px-4 py-6">
          <ConfirmRide
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
          />
        </div>
      </div>

      {/* LOOKING FOR DRIVER */}
      <div
        ref={vehicleFoundRef}
        className="fixed bottom-0 w-full flex justify-center z-30 translate-y-full"
      >
        <div className="w-full max-w-md bg-white rounded-t-2xl px-4 py-6">
          <LookingForDriver
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
          />
        </div>
      </div>

      {/* WAITING FOR DRIVER */}
      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 w-full flex justify-center z-30"
      >
        <div className="w-full max-w-md bg-white rounded-t-2xl px-4 py-6">
          <WaitingForDriver
            ride={ride}
            waitingForDriver={waitingForDriver}
            setWaitingForDriver={setWaitingForDriver}
            setVehicleFound={setVehicleFound}
          />
        </div>
      </div>

    </div>
  )
}




export default Home