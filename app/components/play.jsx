import { useEffect, useRef } from 'react'
import GSAP from 'gsap'

export default function Play() {
  let circle = useRef(null)
  let play = useRef(null)


  useEffect(() => {


  }, []);

  return (
    <button>
      {/* <img src={play.src} alt="" /> */}

      <svg id="Calque_2" data-name="Calque 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430.19 360.69">

        <g id="Calque_1-2" ref={circle} data-name="Calque 1">
          <path className="cls-2" d="m39.91,111.39c-11.14,14.52-22.02,28.94-28.82,46.08C3.28,177.19-.44,198.88.04,220.06c.91,40.53,18.22,79.44,49.03,106.03,14.93,12.89,32.38,22.57,51.3,28.22,20.03,5.97,41.3,7.47,62.07,5.68,41.49-3.57,81.4-18.91,117.33-39.47,32.55-18.62,62.49-42.32,87.26-70.53,24.2-27.56,43.55-59.49,54.84-94.49,6.59-20.45,11.48-42.92,5.89-64.18-4.55-17.3-15.64-32.16-29.09-43.65-14.4-12.29-31.22-21.32-48.77-28.24-19.9-7.85-40.95-13.12-62.1-16.24C244.42-3.18,199.31-.31,157.88,14.54c-35.95,12.89-69.35,34.31-94.22,63.49-5.95,6.99-11.43,14.39-16.32,22.16-3.35,5.32,5.08,10.22,8.42,4.92,19.4-30.83,48.27-54.8,80.72-70.94,36.41-18.11,77.32-25.67,117.83-24.3,21.36.72,42.58,3.91,63.25,9.36,18.34,4.83,36.3,11.25,52.83,20.62,14.8,8.39,28.99,19.31,38.43,33.38,4.62,6.88,7.87,13.83,9.82,21.82,2.5,10.2,2.23,20.96.52,31.27-2.98,18.01-9.13,35.87-16.71,52.28s-16.63,31.41-27.14,45.71c-21.07,28.65-47.74,53.3-77.14,73.26-32.04,21.75-67.83,39.03-105.66,47.82-38.33,8.9-80.23,8.33-115.28-11.31-32.07-17.97-55.38-49.11-63.79-84.86-8.75-37.19-2.38-79.25,18.79-111.01,5.02-7.53,10.59-14.69,16.1-21.87,1.6-2.09.32-5.46-1.75-6.67-2.51-1.47-5.06-.35-6.67,1.75h0Z" />
          <polygon ref={play} className="cls-1" points="169.47 116.6 164.27 256.93 307.45 171.83 169.47 116.6" />
        </g>
      </svg>
    </button>
  )
}
