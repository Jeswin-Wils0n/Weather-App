const axios = require('axios');

module.exports = {

    async getCordinates(city,country){
        try{
          const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=pk.eyJ1IjoiamVzd2luMDA3IiwiYSI6ImNseTg2aDBiZzBmZGsyanM3Ymo0bjQ2d2gifQ.kqIOXOkvu8c2D1UiLAyqsw`)
          
          const features = result.data.features;
          const x = features.filter((val)=>{
            return val.place_name.split(",").reverse()[0].trim().toUpperCase()===country.toUpperCase();
          })
          if(x.length!==0){
            const lat = x[0].center[1];
            const long = x[0].center[0];
            return {lattitude: lat, longitude: long, placeName: x[0].place_name}
          }
          else{
            return {error: [3,`No match found for the given city and country!`]}
          }
          
    
        }catch(error){
          console.log(error);
          return {error: [1,`Something went wrong while fetching location from the Mapbox API: ${error.message}`]}
        }
    
      },
    
    async getWeather(cordinates){
        try{
            const location = `${cordinates.lattitude},${cordinates.longitude}`
            const result = await axios.get(`http://api.weatherstack.com/current?access_key=c04c71865737047127af59cce544409e&query=${location}&units=m`);
            if(!result.data.error){
              const weather = result.data.current;
              const imgUrl = await this.getBgImage(weather.weather_descriptions[0]);
              cordinates.weather = weather;
              cordinates.imgUrl = imgUrl;
              return cordinates;
            }
            else{
              return {error: [2,`Something went wrong while fetching weather details from the weatherstack API: ${result.data.error.info.toString()}`]}
            }
           
        }catch(error){
            console.error(error);
            return {error: [2,`Something went wrong while fetching weather details from the weatherstack API: ${error.message}`]}
        }
        
    },
    
    async getBgImage(desc){
      try{
        desc=desc.trim().replace(" ","%20");
        const result = await axios.get(`https://api.unsplash.com/photos/random?query=${desc}%20weather&client_id=NopfqK-qFd6gl52wWub5qP-zRi33hdIH1BWv1L7Svs4&orientation=landscape&color=blue`);
        return result.data.urls.regular;
      }catch(error){
        console.log(error);
      }
    }
}