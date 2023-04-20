import { useState, useEffect, useRef } from "react";
import { MapContainer, GeoJSON } from 'react-leaflet';
import countries from '../../data/countries.geo.json';
import FavoriteButton from '../ProfilePage/Buttons/FavoriteButton';

function Map() {
  const [showArt, setShowArt] = useState([]) // Boolean // Replace later with modal
  const [artworks, setArtworks] = useState([])
  // const [dateAfter, setDateAfter] = useState(1500); //created_after param here
  const dateAfter = useRef(1500)
  const [test, setTest] = useState('hello')
  const dateBefore = dateAfter.current + 99
  const [params, setParams] = useState({
    skip: 0,
    limit: 300,
    has_image: 1,
    // created_after: dateAfter.current,
    // created_before: dateBefore
  })

  function doFetch(countryName) {
    console.log(dateAfter.current)

    const url = "https://openaccess-api.clevelandart.org/api/artworks";

    const tempParams = {
      q: countryName.toLowerCase(), ...params,
    }

    function formatParams(params) {

      let searchString = ''

      for (const [key, value] of Object.entries(params)) {
        searchString += `${key}=${value}&`
      }
      searchString += `created_after=${dateAfter.current}&`;
      // debugger;
      searchString += `created_before=${dateAfter.current + 99}`;

      console.log(searchString);
      return searchString;
    }


    const paramsString = formatParams(tempParams)

    fetch(`${url}?${paramsString}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(`Params used for search ${params}`)
        const filtered = [];
        data.data.forEach((artwork) => {
          if (artwork.culture[0]?.toLowerCase().includes(countryName.toLowerCase())) {
            filtered.push(artwork);
          }
        });
        setArtworks(filtered);
        setShowArt(true);
      })
      .catch((error) => {
        console.error("ERROR getting artwork data", error);
      });
  }

  // function doCountryClicked(countryName) {
  //   debugger 
  //   return (dateAfter) => {
  //     alert ('countryName')
  //     console.log(dateAfter)
  //   }
  // }

  function handleCountryClick (countryName) {

    doFetch(countryName);

    // console.log(`this date: ${this.dateAfter}`)
    console.log(countryName);
    console.log(`Handle Country Click ${dateAfter.current}`)
    // const url = "https://openaccess-api.clevelandart.org/api/artworks";

    // const tempParams = {
    //   q: countryName.toLowerCase(), ...params,
    // }

    // function formatParams(params) {

    //   let searchString = ''

    //   for (const [key, value] of Object.entries(params)) {
    //     searchString += `${key}=${value}&`
    //   }
    //   console.log(searchString.slice(0, searchString.length - 1))
    //   return searchString.slice(0, searchString.length - 1)
    // }


    // const paramsString = formatParams(tempParams)

    // fetch(`${url}?${paramsString}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(`Params used for search ${params}`)
    //     const filtered = [];
    //     data.data.forEach((artwork) => {
    //       if (artwork.culture[0]?.toLowerCase().includes(countryName.toLowerCase())) {
    //         filtered.push(artwork);
    //       }
    //     });
    //     setArtworks(filtered);
    //     setShowArt(true);
    //   })
    //   .catch((error) => {
    //     console.error("ERROR getting artwork data", error);
    //   });
  }

  function onEachCountry(country, layer) {

    console.log(dateAfter.current)
    console.log(layer)
    console.log(this)

    const countryName = country.properties.ADMIN
    // console.log(countryName)
    layer.bindPopup(countryName);

    layer.setStyle({ fillColor: randomColor() })
    layer.on({
      click: () => {
        // doCountryClicked(countryName)
        // console.log(event)
        // country.properties['customdate'] = 1300
        handleCountryClick(country.properties.ADMIN)
      },
      mouseover: (e) => {
        e.target.setStyle({
          fillOpacity: 1
        })
      },
      mouseout: (e) => {
        e.target.setStyle({
          fillOpacity: 0.8
        })
      }
    })
    // debugger
    // layer.on('click', handleCountryClick.bind(this))
  }

  function handleRandomArt() {
    const randomIndex = Math.floor(Math.random() * artworks.length);
    const randomArtwork = artworks[randomIndex];
    return randomArtwork && <DisplayArtwork artwork={randomArtwork} setShowArt={setShowArt} />
  }

  // function setNewParams(event, value) {
  //   setDateAfter(value);
  //   setParams({
  //     ...params,
  //     created_after: value,
  //     created_before: value + 99,
  //   });
  // }

  function handleSliderChange(event, value) {
    event.preventDefault();
    // const newDateAfter = value
    dateAfter.current = value
    console.log(test)
    setParams({
      ...params,
      // created_after: dateAfter.current,
      // created_before: dateAfter.current + 99,
    });

    // console.log(dateAfter)
    // setNewParams(dateAfter)
  }

  return (
    <>
      <h1>{dateAfter.current}</h1>
      <MapContainer
        className="our-map"
        zoom={3}
        center={[0, 0]}
        minZoom={3}
        maxBounds={maxBounds}
        maxBoundsViscosity={1}
      >

        <GeoJSON
          data={countries.features}
          style={geoJsonStyle}
          onEachFeature={onEachCountry}
        />

      </MapContainer>
      {showArt && handleRandomArt()}
      <Slider
        value={dateAfter.current}
        onChange={handleSliderChange}
        min={500}
        max={1900}
        step={100}
        marks={sliderMarks}
        classes={sliderStyles()}
        valueLabelDisplay="auto"
      />
    </>
  )
}

export default Map;

// if (createdAfter) {
                    //     if (
                    //         artwork.culture[0]?.toLowerCase().includes(countryName.toLowerCase()) &&
                    //         createdAfter
                    //     ) {
                    //         filtered.push(artwork);
                    //     }
                    // } else {
                    //     if (
                    //         artwork.culture[0]?.toLowerCase().includes(countryName.toLowerCase())
                    //     ) {
                    //         filtered.push(artwork)
                    //     }
                    // }


  //   const [clicked, setClicked] = useState(false);
  //   const [artworks, setArtworks] = useState([]);
  //   const [country, setCountry] = useState("");
  //   const [createdAfter, setCreatedAfter] = useState("");
  //   const [createdBefore, setCreatedBefore] = useState("");

  //   function formattedYear(year) {
  //     let newYear;

  //     if (year.length === 4) {
  //       newYear = parseInt(year + 99).toString().slice(0, 2) + "99"
  //     } else {
  //       newYear = parseInt(year + 99).toString().slice(0, 1) + "99"
  //     }

  //     return newYear
  //   }

  //   function handleCountryClick(countryName) {

  //     const url = "https://openaccess-api.clevelandart.org/api/artworks";
  //     let params = {
  //       q: countryName,
  //       skip: 0,
  //       limit: 500,
  //       has_image: 1,
  //     };

  //     if (createdAfter) {
  //       debugger
  //       params = {
  //         ...params,
  //         created_after: createdAfter,
  //         created_before: formattedYear(createdAfter)
  //       };
  //     }

  //     fetch(`${url}?${new URLSearchParams(params)}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const filtered = [];
  //         data.data.forEach((artwork) => {
  //           if (createdAfter) {
  //             if (
  //               artwork.culture[0]?.toLowerCase().includes(countryName.toLowerCase()) &&
  //               createdAfter
  //             ) {
  //               filtered.push(artwork);
  //             }
  //           } else {
  //             if (
  //               artwork.culture[0]?.toLowerCase().includes(countryName.toLowerCase())
  //             ) {
  //               filtered.push(artwork)
  //             }
  //           }
  //         });
  //         setArtworks(filtered);
  //         setClicked(true);
  //       })
  //       .catch((error) => {
  //         console.error("ERROR getting artwork data", error);
  //       });
  //   }

  //   function handleRandomImage() {
  //     const randomIndex = Math.floor(Math.random() * artworks.length);
  //     const randomArtwork = artworks[randomIndex];

  //     return randomArtwork && (
  //       <div className="art-display-container">
  //         <FavoriteButton artwork={randomArtwork} />
  //         <h2>{randomArtwork?.culture}</h2>
  //         <button onClick={() => setClicked(false)}>&times;</button>
  //         <img src={randomArtwork?.images.web.url} alt={randomArtwork?.title} id='fetched-image'/>
  //         {console.log(randomArtwork)}
  //       </div>
  //     );
  //   }

  //   useEffect(() => {
  //     setArtworks([]);
  //   }, [country, createdAfter]);

  //   /* -------------------MAP--------------------- */

  //   const maxBounds = [
  //     [-120, -210],
  //     [110, 210]
  //   ];

  //   function style() {
  //     return {
  //       fillOpacity: 0.8,
  //       color: "black",
  //       weight: 2
  //     }
  //   }

  //   function onEachCountry(country, layer) {
  //     const countryName = country.properties.ADMIN
  //     // console.log(countryName)
  //     layer.bindPopup(countryName);

  //     const colors = ["green", "yellow", "red", "orange", "purple", "brown"]
  //     const randomColorIndex = Math.floor(Math.random() * colors.length)

  //     layer.setStyle({ fillColor: colors[randomColorIndex] })

  //     layer.on({
  //       click: () => {
  //         handleCountryClick(country.properties.ADMIN)
  //       },
  //       mouseover: (e) => {
  //         e.target.setStyle({
  //           fillOpacity: 1
  //         })
  //       },
  //       mouseout: (e) => {
  //         e.target.setStyle({
  //           fillOpacity: 0.5
  //         })
  //       }
  //     })
  //   }

  //   return (
  //     <>
  //       <div className="test-wrapper">
  //         <input type="text" onChange={(e) => setCountry(e.target.value)} />

  //         <select onChange={(e) => {
  //           setCreatedAfter(e.target.value);
  //           setCreatedBefore(parseInt(e.target.value + 99))
  //         }
  //         }>
  //           <option value="">All Time</option>
  //           <option value="500">500s</option>
  //           <option value="600">600s</option>
  //           <option value="700">700s</option>
  //           <option value="800">800s</option>
  //           <option value="900">900s</option>
  //           <option value="1000">1000s</option>
  //           <option value="1100">1100s</option>
  //           <option value="1200">1200s</option>
  //           <option value="1300">1300s</option>
  //           <option value="1400">1400s</option>
  //           <option value="1500">1500s</option>
  //           <option value="1600">1600s</option>
  //           <option value="1700">1700s</option>
  //           <option value="1800">1800s</option>
  //           <option value="1900">1900s</option>
  //         </select>

  //       </div>
  //       <div className="our-map-container">
  //       <MapContainer
  //           className="our-map"
  //           zoom={3}
  //           center={[0,0]}
  //           minZoom={3}
  //           maxBounds={maxBounds}
  //           maxBoundsViscosity={1}
  //         >

  //           <GeoJSON
  //             data={countries.features}
  //             style={style}
  //             onEachFeature={onEachCountry}
  //           />
  //         </MapContainer>
  //       </div>
  //       {clicked && handleRandomImage()}
  //     </>
  //   );
  // }





/* <button onClick={() => handleClick(country)}>search</button> */
// onEachCountry={doCountryClicked(countryName)}



// function doCountryClicked(countryName) {
//   return (countryName, dateAfter) => {
//     fetch
//   }
// }

// if (countryClicked) {

// }