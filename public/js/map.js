mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:"mapbox://styles/mapbox/streets-v12",// dark-v11
        center: Listing.geometry.coordinates,
        zoom: 7// starting zoom
    });



const marker = new mapboxgl.Marker({color: 'red'})
        .setLngLat(Listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
         .setHTML(`<h5>${Listing.location}</h5><p>Exact location will be provided after booking </p>`))
        .addTo(map);
        

const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML("<h1>Hello World!</h1>");

