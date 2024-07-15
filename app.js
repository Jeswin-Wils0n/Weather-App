const express = require("express");
const os = require("os");
const path = require("path");
const services = require("./utils");

const server = express();
// server.use(express.json());

server.set('view engine','ejs');
server.set('views',path.join(__dirname,'views'))

server.use(express.static(path.join(__dirname, "frontend")));

server.post("/weather",express.json(), async (req, res) => {
  try {
    const city = req.body.city.trim().replace(" ", "%20");
    const country = req.body.country;

    const geocoding = await services.getCordinates(city, country);
    if (!geocoding.error) {
      const weatherData = await services.getWeather(geocoding);
      if (!weatherData.error) {
        console.log(weatherData);
        res.send(weatherData);
      } else {
        res.send(weatherData);
      }
    } else {
      res.send(geocoding);
    }
  } catch (err) {
    console.log(err);
    res.send({error: [4,`Internal server error: ${err.message}`]});
  }
});

server.get('/*',(req,res)=>{
  res.render('error404');
})


// server.use('/test',express.static(path.join(__dirname, "frontend","test.html")))

server.listen(4000, () => console.log("Server running on port 4000"));

// async function authenticate(req,res){
//     server.use(express.static(path.join(__dirname,"frontend","formValidation")));


// }


// function getServerIP() {
//   const interfaces = os.networkInterfaces();
//   for (const interfaceName in interfaces) {
//     const interface = interfaces[interfaceName];
//     for (const iface of interface) {
//       if (iface.family === 'IPv4' && !iface.internal) {
//         return iface.address;
//       }
//     }
//   }
//   return 'localhost'; // Fallback
// }
