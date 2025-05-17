import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, GeoJSON, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkedAlt } from "react-icons/fa";
import pakistanGeoJson from "../../data/gadm41_PAK_3.json";
import L from "leaflet";

const MapSection = styled.div`
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
`;

const MapHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
`;

const HeaderIcon = styled.div`
  font-size: var(--font-size-xl);
  color: ${(props) => props.color};
  margin-right: var(--space-3);
`;

const HeaderTitle = styled.h3`
  color: var(--neutral-800);
  margin: 0;
`;

const StyledMapContainer = styled(MapContainer)`
  height: 500px;
  width: 100%;
  border-radius: var(--border-radius-md);
  z-index: 1;
`;

const Legend = styled.div`
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--space-3);
  margin-top: var(--space-3);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  border-radius: 4px;
`;

const LegendLabel = styled.span`
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: var(--space-6);
  color: var(--primary-color);
  font-weight: bold;
`;

const PakistanMap = ({ disease }) => {
  const [regionData, setRegionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redZones, setRedZones] = useState([]);

  // Lookup table for major Pakistan city coordinates
  const cityCoordinates = {
    "Islamabad": [33.6844, 73.0479],
    "Karachi": [24.8607, 67.0011],
    "Lahore": [31.5204, 74.3587],
    "Faisalabad": [31.4504, 73.1350],
    "Rawalpindi": [33.5651, 73.0169],
    "Multan": [30.1798, 71.4214],
    "Peshawar": [34.0151, 71.5249],
    "Quetta": [30.1798, 66.9750],
    "Gujranwala": [32.1877, 74.1945],
    "Sialkot": [32.4945, 74.5229],
    "Bahawalpur": [29.3957, 71.6733],
    "Sargodha": [32.0836, 72.6711],
    "Sukkur": [27.7052, 68.8570],
    "Larkana": [27.5600, 68.2264],
    "Sheikhupura": [31.7167, 73.9850],
    "Hyderabad": [25.3960, 68.3578],
    "Mardan": [34.2012, 72.0369],
    "Abbottabad": [34.1558, 73.2194],
    "Gujrat": [32.5731, 74.0847],
    "Jhang": [31.2681, 72.3181],
    "Sahiwal": [30.6717, 73.1094],
    "Kasur": [31.1187, 74.4450],
    "Okara": [30.8138, 73.4534],
    "Chiniot": [31.7292, 72.9822],
    "Kamoke": [31.9764, 74.2233],
    "Sadiqabad": [28.3061, 70.1305],
    "Burewala": [30.1667, 72.6500],
    "Jacobabad": [28.2769, 68.4514],
    "Muzaffargarh": [30.0705, 71.1933],
    "Jhelum": [32.9425, 73.7257],
    "Khanpur": [28.6471, 70.6620],
    "Khanewal": [30.3017, 71.9321],
    "Hafizabad": [32.0709, 73.6884],
    "Kohat": [33.5889, 71.4429],
    "Rahim Yar Khan": [28.4202, 70.2952],
    "Mirpur Khas": [25.5263, 69.0123],
    "Dera Ghazi Khan": [30.0500, 70.6400],
    "Nawabshah": [26.2442, 68.4100],
    "Mingora": [34.7717, 72.3600],
    "Charsadda": [34.1453, 71.7308],
    "Kamalia": [30.7258, 72.6478],
    "Dadu": [26.7319, 67.7750],
    "Khuzdar": [27.8120, 66.6170],
    "Mansehra": [34.3333, 73.2000],
    "Layyah": [30.9613, 70.9394],
    "Swabi": [34.1202, 72.4698],
    "Khairpur": [27.5295, 68.7592],
    "Nowshera": [34.0153, 71.9747],
    "Kotri": [25.3657, 68.3081],
    "Attock": [33.7667, 72.3667],
    "Toba Tek Singh": [30.9709, 72.4827],
    "Murree": [33.9000, 73.3833],
    "Taxila": [33.7463, 72.8397],
    "Chakwal": [32.9300, 72.8500],
    "Swat": [35.2227, 72.4258],
    // Add more cities as needed
  };

  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        setLoading(true);
        // Fetch location data specific to the selected disease
        const response = await fetch(`http://localhost:5000/api/disease-location/${disease.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch region data");
        }
        const data = await response.json();
        setRegionData(data.regions);
        
        // Extract red zones and calculate their centers
        extractRedZones(data.regions);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching region data:", err);
        setError("Failed to load map data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, [disease.id]); // Refetch when disease changes

  // Get city coordinates from lookup or fallback to GeoJSON calculation
  const findRegionCenter = (regionName) => {
    // First check if we have pre-defined coordinates for this city
    if (cityCoordinates[regionName]) {
      return cityCoordinates[regionName];
    }
    
    // Fallback to calculating from GeoJSON if we don't have pre-defined coordinates
    const feature = pakistanGeoJson.features.find(feature => {
      const name = feature.properties.NAME_2 || feature.properties.NAME_3 || feature.properties.name;
      return name === regionName;
    });
    
    if (feature && feature.geometry) {
      try {
        if (feature.geometry.type === "MultiPolygon" && feature.geometry.coordinates.length > 0) {
          // Try to find a more central point by averaging multiple coordinates
          let latSum = 0;
          let lonSum = 0;
          let count = 0;
          
          // Sample multiple points from the first polygon
          const firstPoly = feature.geometry.coordinates[0][0];
          const step = Math.max(1, Math.floor(firstPoly.length / 10)); // Sample about 10 points
          
          for (let i = 0; i < firstPoly.length; i += step) {
            latSum += firstPoly[i][1]; // Latitude
            lonSum += firstPoly[i][0]; // Longitude
            count++;
          }
          
          if (count > 0) {
            return [latSum / count, lonSum / count];
          }
          
          // Fallback to first point if averaging fails
          return [firstPoly[0][1], firstPoly[0][0]];
        } else if (feature.geometry.type === "Polygon" && feature.geometry.coordinates.length > 0) {
          // Same approach for Polygon type
          const coords = feature.geometry.coordinates[0];
          let latSum = 0;
          let lonSum = 0;
          let count = 0;
          
          const step = Math.max(1, Math.floor(coords.length / 10));
          
          for (let i = 0; i < coords.length; i += step) {
            latSum += coords[i][1];
            lonSum += coords[i][0];
            count++;
          }
          
          if (count > 0) {
            return [latSum / count, lonSum / count];
          }
          
          return [coords[0][1], coords[0][0]];
        }
      } catch (err) {
        console.error("Error calculating region center:", err);
      }
    }
    
    // Default to center of Pakistan if we can't find the region
    return [30.3753, 69.3451];
  };
  
  // Extract red zones and calculate their centers
  const extractRedZones = (regions) => {
    if (!regions) return;
    
    const zones = [];
    
    for (const [regionName, regionData] of Object.entries(regions)) {
      if (regionData.zone_type === "red") {
        const center = findRegionCenter(regionName);
        zones.push({
          name: regionName,
          center: center,
          data: regionData
        });
      }
    }
    
    setRedZones(zones);
  };

  const style = (feature) => {
    if (!regionData) {
      return {
        fillColor: "#CCCCCC",
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    }

    // Try to find region data for this feature
    const regionName = feature.properties.NAME_2 || feature.properties.NAME_3 || feature.properties.name;
    const region = regionData[regionName];

    // If no data for this region, color it green (less than 4%)
    if (!region) {
      return {
        fillColor: "#52C41A", // Green for regions with zero entries
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.5,
      };
    }

    return {
      fillColor: region.color,
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const regionName = feature.properties.NAME_2 || feature.properties.NAME_3 || feature.properties.name;
    
    if (regionName) {
      const region = regionData ? regionData[regionName] : null;
      if (region) {
        layer.bindTooltip(
          `<div>
            <strong>${regionName}</strong><br />
            Zone: ${region.zone_type}<br />
            Percentage: ${region.percentage.toFixed(2)}%<br />
            Patient Cases: ${region.count || 0}
          </div>`,
          { sticky: true }
        );
      } else {
        layer.bindTooltip(
          `<div>
            <strong>${regionName}</strong><br />
            Zone: green (0%)<br />
            Percentage: 0%<br />
            Patient Cases: 0
          </div>`,
          { sticky: true }
        );
      }
    }
  };

  // Custom radar style for red zones
  const radarStyle = {
    stroke: false,
    fillOpacity: 0.5,
    fillColor: '#FF4D4F'
  };

  // Create pulsing effect with radial gradient
  const pulsingIcon = {
    radius: 20,
    className: 'radar-pulse'
  };

  if (loading) {
    return (
      <MapSection>
        <MapHeader>
          <HeaderIcon color={disease.color}>
            <FaMapMarkedAlt />
          </HeaderIcon>
          <HeaderTitle>{disease.name} Geographic Distribution</HeaderTitle>
        </MapHeader>
        <LoadingIndicator>Loading map data...</LoadingIndicator>
      </MapSection>
    );
  }

  if (error) {
    return (
      <MapSection>
        <MapHeader>
          <HeaderIcon color={disease.color}>
            <FaMapMarkedAlt />
          </HeaderIcon>
          <HeaderTitle>{disease.name} Geographic Distribution</HeaderTitle>
        </MapHeader>
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-6)",
            color: "var(--error-color)",
          }}
        >
          {error}
        </div>
      </MapSection>
    );
  }

  return (
    <MapSection>
      <MapHeader>
        <HeaderIcon color={disease.color}>
          <FaMapMarkedAlt />
        </HeaderIcon>
        <HeaderTitle>{disease.name} Geographic Distribution</HeaderTitle>
      </MapHeader>

      <style>
        {`
          .radar-pulse {
            animation: radar-pulse 2.5s ease-out infinite;
            background: radial-gradient(circle, rgba(255,77,79,0.6) 0%, rgba(255,77,79,0.25) 50%, rgba(255,77,79,0.05) 100%);
          }
          
          @keyframes radar-pulse {
            0% {
              transform: scale(0.7);
              opacity: 0.8;
            }
            100% {
              transform: scale(3);
              opacity: 0;
            }
          }
        `}
      </style>

      <StyledMapContainer
        center={[30.3753, 69.3451]}
        zoom={5}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={pakistanGeoJson}
          style={style}
          onEachFeature={onEachFeature}
        />
        
        {/* Add radar circles for red zones */}
        {redZones.map((zone, index) => (
          <React.Fragment key={index}>
            <Circle 
              center={zone.center}
              pathOptions={{
                stroke: false,
                fillOpacity: 0.35,  // Reduced opacity
                fillColor: '#FF4D4F'
              }}
              radius={70000} 
            >
              <Popup>
                <strong>{zone.name}</strong><br />
                Red Zone<br />
                {zone.data.percentage.toFixed(2)}% of cases<br />
                {zone.data.count} patients
              </Popup>
            </Circle>
            <Circle 
              center={zone.center}
              pathOptions={{ fillOpacity: 0, stroke: false }}
              radius={100000}
              className="radar-pulse"
            />
          </React.Fragment>
        ))}
      </StyledMapContainer>

      <Legend>
        <LegendItem>
          <LegendColor color="#FF4D4F" />
          <LegendLabel>Red Zone (≥ 10%)</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#1890FF" />
          <LegendLabel>Blue Zone (4-10%)</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#52C41A" />
          <LegendLabel>Green Zone (&lt; 4%)</LegendLabel>
        </LegendItem>
      </Legend>
    </MapSection>
  );
};

export default PakistanMap;
