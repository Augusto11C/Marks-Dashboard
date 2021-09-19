// ============ SETUP ============
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

app.listen(port, () => console.log(`listening on port ${port}!`))

// ============ API calls ============

// Get picture of the day
// app.get('/apod', async (req, res) => {
//     try {
//         const image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
//             .then(res => res.json())
//         res.send({ image })
//     } catch (err) {
//         console.log('error:', err);
//     }
// })

// Get rover by name
app.get('/rover', async (req, res) => {
    try {
        const rover = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${req.query.name.toLowerCase()}?api_key=${process.env.API_KEY}`)
                            .then(res => res.json())
        res.send({ rover }) //send to caller (FE)

    } catch(err) {
        console.log('error:', err);
    }
})

// Get rover's photos by rover's name
app.get('/rover-photos', async (req, res) => {
    try {
        // c'è un modo per evitare la data?
        let photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.query.name.toLowerCase()}/latest_photos?api_key=${process.env.API_KEY}`)
                .then(res => res.json())
        res.send(photos); 
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/rovers', async (req, res) => {
    try {
        const data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`);
        // .then(res => res.json());

        let rovers = await data.json();

        rovers = rovers.rovers.map(rover => {
            return {
                name: rover.name,
                status: rover.status,
                launch_date: rover.launch_date,
                landing_date: rover.landing_date,
                max_sol: rover.max_sol,
                max_date: rover.max_date,
                total_photos: rover.total_photos                
            }
        });

        console.log("Logging rovers info \n" + rovers);
        console.log(rovers);

        res.send(rovers);
    } catch (error) {
        console.error(error);
    }
})