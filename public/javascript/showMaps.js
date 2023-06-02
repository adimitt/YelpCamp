// const maptilersdk=require('@maptiler/sdk');



// import * as maptilersdk from '@maptiler/sdk';
maptilersdk.config.apiKey=mapToken;
const map=new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: "streets-v2",
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});


const marker=new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )

    )
    .addTo(map)

// const popup=new maptilersdk.Popup({ closeOnClick: false })
//     .setLngLat(campground.geometry.coordinates)
//     .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
//     .addTo(map);