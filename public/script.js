const button  = document.getElementById('submit-btn');
const reset_btn = document.getElementById('reset-btn');
let cityName='';
let countryName='';

button.addEventListener("click", async () => {
  try {
    loader(true);
    cityName = document.getElementById("city").value;
    countryName = document.getElementById("country").value;
    const result = await fetch("/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: cityName,
        country: countryName,
      }),
    });
    const data = await result.json();
    loader(false);
    if (!data.error) {
      toggle(data);
    } else {
      showWarning(data);
    }
  } catch (error) {
    console.log(error);
    showWarning({ error: [5, "Internal Server error!!"] });
  }
});

function toggle(data){
    let region =data.placeName.split(",");
    let country = region.splice(-1,1);
    let city = region.join("");
    document.body.style.backgroundImage=`radial-gradient(#454545, transparent), url(${data.imgUrl})`
    document.querySelector('.centered-box').style.display='none';
    document.getElementById('weather-info').style.display='block';
    document.getElementById('city-display').textContent=`${city}`;
    document.getElementById('country-display').textContent=`${country[0].trim()}`;
    document.getElementById('temp-val').textContent=`${data.weather.temperature}℃`;
    document.getElementById('temp-text').textContent=`${data.weather.weather_descriptions[0]}`;

    document.getElementById('feels').textContent=`${data.weather.feelslike}℃`;
    document.getElementById('precep').textContent=`${data.weather.precip}mm`;
    document.getElementById('humid').textContent=`${data.weather.humidity}g/m3`;
    document.getElementById('visibl').textContent=`${data.weather.visibility}km`;
    document.getElementById('pressure').textContent=`${data.weather.pressure}mb`;

}

reset_btn.addEventListener('click',()=>{
    document.body.style.backgroundImage=` url(./assets/clyde-rs-4XbZCfU2Uoo-unsplash.jpg)`
    document.querySelector('.centered-box').style.display='block';
    document.getElementById('weather-info').style.display='none';

})

function showWarning(data){
    if(data.error[0]===1){
        document.getElementById('modal-text').textContent="Unable to establish connection with the Mapbox API. Please Try after sometime"
        console.log(data.error);
    }
    else if(data.error[0]===2){
        document.getElementById('modal-text').textContent="Unable to establish connection with the weatherstack API. Please Try after sometime"
        console.log(data.error);
    }
    else if(data.error[0]===3){
        document.getElementById('modal-text').textContent=data.error[1]
        console.log(data.error);
    }
    else if(data.error[0]===4){
        document.getElementById('modal-text').textContent="A server error has occured. Please try later"
        console.log(data.error);
    }
    else if(data.error[0]===5){
        loader(false);
        document.getElementById('modal-text').textContent=data.error[1];
        console.log(data.error);
    }
const triggerModal = document.getElementById('modalToggle')
triggerModal.click()
}

function loader(isLoading) {
  const loadingDiv = document.getElementById("loader-screen");
  if (isLoading) {
    loadingDiv.style.display = "flex";
  } else {
    loadingDiv.style.display = "none";
  }
}