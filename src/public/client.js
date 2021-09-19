
// App state
let store = Immutable.fromJS({
    chosenRover: '',
    roversPhotos: new Map([['Curiosity', {}], ['Opportunity', {}], ['Spirit', {}], ['Perseverance', {}]]),
    rovers: [],
    roversNames: []
    
})


const root = document.getElementById('root')
// const render = async (root, state) => { root.innerHTML = App(state.toJS()) }

const updateStore = (state, newState) => {
    store = state.merge(newState);
    render(root, store);
}

const render = async (root, storeAsParam) => {
    root.innerHTML = App(storeAsParam.toJS());
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }



// listening for load event because page should load before any JS is called
window.addEventListener('load', async () => {

    const rovers = await getRoversList();
    const roverNames = rovers.map(rover => rover.name);

    console.log("roverNames");
    console.log(roverNames);

    updateStore(store, { 'rovers': rovers })
    updateStore(store, { 'roversNames': roverNames })

    console.log("store");
    console.log(store);

    render(root, store);

    // Event Handler for rover selection
    root.onclick = event => {
        if (event.target.innerHTML == 'Show me!') {

            console.log("event");
            console.log(event);

            console.log("event.target");
            console.log(event.target.id.split("-")[3]);

            console.log("event.target.previousElementSibling");
            console.log(event.target.previousElementSibling);

            console.log("event.target.previousElementSibling.previousElementSibling");
            console.log(event.target.previousElementSibling.previousElementSibling);


            console.log("event.target.previousElementSibling.previousElementSibling.innerHTML");
            console.log(event.target.previousElementSibling.previousElementSibling.innerHTML);

            // roverName = event.target.previousElementSibling.previousElementSibling.innerHTML;
            roverName = event.target.id.split("-")[3];
            console.log("roverName");
            console.log(roverName);


            if (JSON.stringify(store.toJS().roversPhotos.get(roverName)) === '{}') {
                getRoverPhotos(store, roverName);
            }

            else {
                updateStore(store, { 'chosenRover': roverName });
            }
        }
    }
})



//------------------------------------------------------ CREATE CONTEND
const App = (storeAsParam) => {

    const dummyRoversImages = ["https://mars.nasa.gov/system/content_pages/main_images/374_mars2020-PIA21635.jpg",
    "https://d2pn8kiwq2w21t.cloudfront.net/images/imagesmars202020180921PIA22109-16.width-1320.jpg",
    "https://m.dw.com/image/54182462_401.jpg"];

    return `
            <section>
            ${roversDetails(storeAsParam, createRoverDetailsCard)}
            ${showRoverPhotos(storeAsParam, createImagesGrid)}
            </section>
        `
}

// ------------------------------------------------------  COMPONENTS
// Higher-order function
const roversDetails = (storeAsParam, createRoverDetailsCard) => {
    let rovers = storeAsParam.rovers;
    let roversNames = storeAsParam.roversNames;

    if (rovers.length === 0) getRovers(roversNames);
    else {
        let content = ` <div class="row my-4">
                            <div class="col mx-auto text-center text-uppercase">
                                <h1 class="text-black">Select a Rover!</h1>
                            </div>
                        </div> `;

        rovers.forEach((rover, index) => {
            let newContent = content.concat(createRoverDetailsCard(rover, index))
            if (newContent != undefined){
                content = newContent;
            }
        })

        return `<div class="row py-5"> ${content} </div>`;
    }

}

// Show rover photos and details | Higher-order Function
const showRoverPhotos = (storeAsParam, createImagesGrid) => {

    if (storeAsParam.chosenRover != undefined && storeAsParam.chosenRover != '') {
        
        return `<div class="container">
                    <div class="row py-5 text-center">
                        <h2 class="text-black text-uppercase mb-5">${storeAsParam.chosenRover}'s Photos</h2>
                        ${createImagesGrid(storeAsParam)}
                    </div>
                </div> `
    } else {
        return ``

    }

}




const createRoverDetailsCard = (rover, index) => {

    const roversImages = ["https://mars.nasa.gov/system/content_pages/main_images/374_mars2020-PIA21635.jpg",
        "https://d2pn8kiwq2w21t.cloudfront.net/images/imagesmars202020180921PIA22109-16.width-1320.jpg",
        "https://m.dw.com/image/54182462_401.jpg", "https://mars.nasa.gov/system/content_pages/main_images/374_mars2020-PIA21635.jpg"];

    // console.log("rover")
    // console.log(rover)

    return `
    <div class="col-lg-3 col-md-6 mx-auto my-5">
        <div class="card text-center m-2">
            <img src="${roversImages[index]}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${rover.name}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Status: ${rover.status}</li>
                    <li class="list-group-item">Total photos: ${rover.total_photos}</li>
                    <li class="list-group-item">Launch date: ${rover.launch_date}</li>
                    <li class="list-group-item">Landing date: ${rover.landing_date}</li>
                
                </ul>
                <a href="#" id="rover-card-detail-${rover.name}"class="btn btn-primary mt-3">Show me!</a>
                
            </div>
        </div>
    </div> `
    //<a href="#" class="btn btn-primary mt-3">Show me!</a>
    //<li class="list-group-item">Most recent photo: ${rover.photos.map(photoObj => photoObj.earth_date).reduce((date, currentDate) => currentDate > date ? currentDate : date)}</li>
}

const createImagesGrid = (storeAsParam) => {
    let content = ``;

    storeAsParam.roversPhotos.get(storeAsParam.chosenRover).forEach(photo => {
        content = content.concat(`<div class="col-lg-3 col-md-5 col-sm-10 mx-auto rounded m-4">
                                        <img src="${photo}" class="img-fluid">
                                    </div>`);
    })

    return content;
}

// ------------------------------------------------------  API CALLS

// const getImageOfTheDay = () => {
//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         .then(apod => updateStore(store, Immutable.Map({ apod })))
// }

const getRovers = (roversNames) => {
    const urls = Array.from(roversNames).map(roverName => `http://localhost:3000/rover?name=${roverName}`);

    Promise.all(urls.map(url =>
        fetch(url).then(res => res.json())
    )).then(data => {
        const rovers = data.map(rover => rover.rover.photo_manifest)
        updateStore(store, { rovers: rovers })
    })

}

const getRoversList = async () => {
    try {
        const result = await fetch('/rovers');
        const rovers = await result.json();
        return rovers;
    } catch (error) {
        console.error(error);
    }
}


const getRoverPhotos = (storeAsParam, roverName) => {
    const roversPhotos = storeAsParam.toJS().roversPhotos;

    fetch(`http://localhost:3000/rover-photos?name=${roverName}`)
        .then(res => res.json())
        .then(data => {
            console.log("data")
            console.log(data)
            console.log("data.latest_photos.map(imgObj => imgObj.img_src)")
            console.log(data.latest_photos.map(imgObj => imgObj.img_src))
            roversPhotos.set(roverName, data.latest_photos.map(imgObj => imgObj.img_src));
            updateStore(storeAsParam, Immutable.Map({ roversPhotos: roversPhotos, chosenRover: roverName }));
        })
}