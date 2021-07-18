document.addEventListener("DOMContentLoaded", () => {
  console.log('In script.js')
  const url = "https://geo.ipify.org/api/v1?apiKey=at_pvEt2Yj1gJih1oQLec2eP0zLHGmVq&ipAddress=8.8.8.8";

  const mapOptions = {
    map: {
      elementId: "mapid",
    },
    setView: {
      coordinates: [51.505, -0.09],
      zoom: 15,
    },
    tileLayer: {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      accessToken: 'pk.eyJ1IjoiYWJyYWhhbS1oYW5rcyIsImEiOiJja3BnOGtxMzEwcGg5MndyaTUza2Z5bWxpIn0.pjm-V63ywewEjfSe4BDkKA',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
    },
    icon: {
      iconUrl: './images/icon-location.svg',
      iconSize: [40, 48],
    }
  }

  let map = initializeMap(mapOptions);
  fetchData(map);

  const inputForm = document.querySelector(".header #input-form");
  const inputButton = document.querySelector(".header #input-button");
  const mobileButton = document.querySelector(".mobile-header .sm-ip-form #input-button");
  const mobileForm = document.querySelector(".mobile-header .sm-ip-form");

  inputForm.addEventListener("submit", function (e) {
    e.preventDefault()
    inputButton.click();
    
    return
  })

  mobileForm.addEventListener("submit", function (e) {
    e.preventDefault()
    mobileButton.click();
    
    return
  })

  inputButton.addEventListener("click", function (e) {
    console.log("clicked")
    let inputText = document.querySelector(".header #input-txt");
    fetchData(map, inputText)
  })

  mobileButton.addEventListener("click", function (e) {
    let inputText = document.querySelector(".mobile-header #input-txt");
    fetchData(map, inputText)
  })
})

function initializeMap(mapOptions) {
  let mymap = L.map('mapid',  {
    center: mapOptions.setView.coordinates,
    zoom: 15,
    zoomControl: false,
  })//.setView(mapOptions.setView.coordinates);

  L.tileLayer(mapOptions.tileLayer.url, {
    ...mapOptions.tileLayer
  }).addTo(mymap);

  let myIcon = L.icon({
    ...mapOptions.icon
  });

  let marker = L.marker(mapOptions.setView.coordinates, {icon: myIcon}).addTo(mymap);

  return {
    mymap,
    marker
  }
}

function setMap(mymap, marker, coordinates) {
  mymap.setView(coordinates, 15);
  marker.setLatLng(coordinates)  

  return {
    mymap,
    marker
  }
}

function displaySearchResult(data) {
  // mobile display
  let mobileIpAddressElement = document.querySelector(".mobile-search #ip-address-txt");
  let mobileLocationElement = document.querySelector(".mobile-search #location-txt");
  let mobileTimezoneElement = document.querySelector(".mobile-search #time-zone-txt");
  let mobileIspElement = document.querySelector(".mobile-search #isp-txt");

  //desktop
  let ipAddressElement = document.querySelector(".lg-search #ip-address-txt");
  let locationElement = document.querySelector(".lg-search #location-txt");
  let timezoneElement = document.querySelector(".lg-search #time-zone-txt");
  let ispElement = document.querySelector(".lg-search #isp-txt");

  ipAddressElement.innerText = data ? data.ip : '192.212.174.101'
  locationElement.innerText = data ? `${data.location.city}, ${data.location.region}` : 'Brooklyn, NY 10001';
  timezoneElement.innerText = data ? `UTC ${data.location.timezone}` : 'UTC -05:00';
  ispElement.innerText = data ? data.isp : 'SpaceX Starlink';

  mobileIpAddressElement.innerText = data ? data.ip : '192.212.174.101'
  mobileLocationElement.innerText = data ? `${data.location.city}, ${data.location.region}` : 'Brooklyn, NY 10001';
  mobileTimezoneElement.innerText = data ? `UTC ${data.location.timezone}` : 'UTC -05:00';
  mobileIspElement.innerText = data ? data.isp : 'SpaceX Starlink';
  
  return data
}

async function fetchData(map, input) {
  let search = '';
  if (input) {
    search = input.value ? `&ipAddress=${input.value}` : '';
  }
  let url = `https://geo.ipify.org/api/v1?apiKey=at_pvEt2Yj1gJih1oQLec2eP0zLHGmVq${search}`;

  try {
    let response = await fetch(url);
    let data;
    if (response.status === 200) {
      data = await response.json();
      displaySearchResult(data)
      setMap(map.mymap, map.marker, [data.location.lat, data.location.lng])

      return data
    }
    else{
      // console.log(response);
      // alert("Error Occured");
      // alert("Displaying Dummy Data");
      displaySearchResult();
    }
    
  } catch (error) {
    // console.log(error);
    // alert("Network Error")
    // alert("Displaying Dummy Data");
    displaySearchResult();
  }
}
