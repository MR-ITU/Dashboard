import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactGlobe from "react-globe";

import "./dashborad.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

import defaultMarkers from "./markers";

function markerTooltipRenderer(marker) {
  return `CITY: ${marker.city} (Value: ${marker.value})`;
}

const options = {
  markerTooltipRenderer,
  markerRadiusScaleRange: [0.01, 0.01],
  markerAltitudeScaleRange: [0.01, 0.01],
  markerColor: () => "#2563eb"
};

function App() {
  const globeEl = useRef();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const randomMarkers = defaultMarkers.map((marker) => ({
    ...marker,
    value: Math.floor(Math.random() * 100)
  }));

  const [markers] = useState(randomMarkers);
  const [event, setEvent] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onClickMarker(marker, markerObject, event) {
    setEvent({
      type: "CLICK",
      marker,
      markerObjectID: markerObject.uuid,
      pointerEventPosition: { x: event.clientX, y: event.clientY }
    });
    setDetails(markerTooltipRenderer(marker));
  }

  function onDefocus(previousFocus) {
    setEvent({
      type: "DEFOCUS",
      previousFocus
    });
    setDetails(null);
  }

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.enableZoom = false;
        controls.minDistance = isMobile ? 250 : 350;
        controls.maxDistance = isMobile ? 250 : 350;
      }
    }
  }, [isMobile]);

  return (
    <div className="dashboard-container">
      {/* Top Cards */}
      <div className="cards-container">
        <div className="card validations-card">
          <h2>Domain Validations</h2>
          <p className="big-number">50,760</p>
          <p className="subtext">per day</p>
        </div>

        <div className="card decentralization-card">
          <h2>Decentralization</h2>
          <p className="big-number">6</p>
          <p className="subtext">MoUs in 5 countries</p>
          <div className="flags-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flag-placeholder"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        {[
          { label: "Requests in Queue", value: "60,760" },
          { label: "Avg. Validation Latency", value: "2.4s" },
          { label: "Failure Rate", value: "0.2%" },
          { label: "Attacks Mitigated", value: "128" }
        ].map((stat, i) => (
          <div className="stat-card" key={i}>
            <p className="label">{stat.label}</p>
            <p className="value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Globe Visualization */}
      <ReactGlobe
        ref={globeEl}
        height="100vh"
        width="100vw"
        markers={markers}
        options={options}
        onClickMarker={onClickMarker}
        onDefocus={onDefocus}
      />

      {/* Status Bar */}
      <div className="status-bar">
        <span className="status-text">Network Status: Operational</span>
        <button className="status-button">View Details</button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);