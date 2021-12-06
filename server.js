const express = require("express");
const ejs = require('ejs');
const axios = require('axios');
var firebase = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://nearera-1b25b-default-rtdb.firebaseio.com/"
});

var db = firebase.database();
var ref = db.ref("Users/data")
ref.once("value", function(snapshot) {
    //console.log(snapshot.val())
})

var userRef = ref.child("users");
userRef.set({
    user1:{
        name: "WTP",
        latitude: "26.854038",
        longitude: "75.805001"
    },
    user2:{
        name: "lazy mozo",
        latitude: "26.8497176",
        longitude: "75.800606"
    },
    user3:{
        name: "saras",
        latitude: "26.9124",
        longitude: "75.7873"
    },
    user4:{
        name: "airport",
        latitude: "26.826651",
        longitude: "75.805954"
    },
    user5:{
        name: "prabha bhawan",
        latitude: "26.8617",
        longitude: "75.8101"
    }
});

const app = express();
app.set('view engine', 'ejs'); 
app.use(express.json());

// app.get("/", (req, res) => {
    
//     res.render('home', {});
// });
//--------------//
//function calculating radial distance
function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

    async function nearMe (obj, userLat, userLong){
        if(calcCrow(obj.latitude, obj.longitude, userLat, userLong) < 200){
            return obj;
        }
    }
//----------------------//


app.get("/", async (req, res) => {
    var userInfo=[]
    var userLat = 28.878685, userLong=77.137452, people=[]
    userRef.once('value', function(snap) {
        userInfo = Object.entries(snap.val()).map((e) => ( {dataUser: e[1]} ));
        //console.log(userInfo)
    })
    userInfo.forEach(async (user) => {
        people.push(await nearMe(user.dataUser, userLat, userLong))
    })

    if(people.length!=0){
        console.log(people)
        res.render('home', {title: "Announcement page", results: people});
    }
});

app.get("/token",async (req, res) => {
        const url = "https://outpost.mapmyindia.com/api/security/oauth/token"
        const address = req.body.params;
        try {
            const response = await axios.post(url, {}, {
                params:{
                    grant_type: "client_credentials",
                    client_id: "33OkryzDZsKP4TUJLGG6OveBEG21Zo55_xXweXY9ThqJDJcxclNFCH-dqiSQ13Z4NT5kDK5SLxMnUEs4OpG6mA==",
                    client_secret: "lrFxI-iSEg9e6bwisC7BT1uwSD8ZmWrsgn6IovnXDNfqrKUc9LA-r0YcMHBk-Cs_pcYsO_YOOmUEvFYSfyP_DYM05uTrJ_Fh"
                }
            })
            console.log(response.data);
            // try {
            //     const mark = await axios.get('http://apis.mapmyindia.com/advancedmaps/v1/9d7eb743d7c26f34ae0e02d9d5548463/geo_code', {}, {})
            //     console.log(mark);
            // } catch (error) {
            //     console.log(error);
            // }
        } catch (error) {
            console.log(error);
        }

try {
    const resdata = await axios.get("https://atlas.mapmyindia.com/api/places/geocode?region=ind&address=237%20Okhla%20industrial%20estate%20phase%203%20new%20delhi%2C%20delhi%20110020&itemCount=1&bound=TAVI5S",{ headers: {"Authorization" : 'Bearer 01b45268-cb95-4cf3-86d6-31bf910f1193'} });
    var jsondata = JSON.parse(JSON.stringify(resdata.data));
    copResults = jsondata.copResults;
    if (!Array.isArray(copResults)) {
        copResults = Array.from(Object.keys(jsondata), k => jsondata[k])
    }
    if (copResults.length > 0) {
        console.log(copResults[0].latitude); /*display results on success*/
    }
    //console.log(resp.data.copResults.longitude);
} catch (error) {
    console.log(error);
}

})


app.listen("3000", function(req, res){
    console.log("Server started")
})