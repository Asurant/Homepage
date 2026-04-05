const background = document.getElementById("background");
const time = document.getElementById("time");
const weather = document.getElementById("weather");
const reason = document.getElementById("reason");

window.onload = function(){
    getNo();
    getLocation();
    getBackground().then(function (imageUrl){
        if(!imageUrl) return;

        console.log(imageUrl);

        if(background){
            background.style["background-image"] = `url('${imageUrl}')`;
        }
    });
    
};

async function getBackground(){
    //Yes I know the API key is exposed. To the random stranger looking at this, this is a free API. Feel free to use it or just get your own here, https://api.nasa.gov/#gibs
    const url = "https://api.nasa.gov/planetary/apod?api_key=OsO8GcEZiHdooaJl4Dh1KavibMWy1FEi2mrfHCxU";

    try{
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        if (result.media_type !== "image"){
            console.log("APOD returned a non-image media type.");
            return null;
        }
        
        return result.url;
    } catch (error){
        console.log(error.message);
        return null;
    }
}

async function getWeather(latitude, longitude){
    const url = "https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m";
    try{
        const res = await fetch(url);
        const data = await res.json();
        const temperatureC = data.hourly.temperature_2m[0];
        const temperatureF = Math.round((temperatureC * 9/5)+32);
        const humidity = data.hourly.relative_humidity_2m[0];
        const wind = data.hourly.wind_speed_10m[0];
        weather.innerText = humidity + "% " + temperatureF + "F " + wind + "mph ";
    } catch (error){
        console.log(error.message);
        return null;
    }
}

function getLocation(){
    navigator.geolocation.getCurrentPosition((pos) =>{
        getWeather(pos.coords.latitude, pos.coords.longitude)
    });
}

async function getNo(){
    const url = "https://no.croomsbellschedule.com/api";
        try{
            const res = await fetch(url);
            const data = await res.json();
            const no = data.reason;
            reason.innerText = "Reason For No: " + no;
        } catch (error){
            console.log(error.message);
            return null;
        }
}

setInterval(() =>{
    let dateObject = new Date().toLocaleString();
    time.innerText = `${dateObject}`;
}, 1000);