var lastBusUpdate = new Date().toLocaleTimeString("en-SG");
var lastForecastUpdate = new Date().toLocaleTimeString("en-SG");

function updateBusRows(content) {
    let old_tbody = document.getElementById("buses");
    let new_tbody = document.createElement('tbody');
    
    for (let i=0; i < content['data'].length; i++) {
        let data = content['data'][i];
        let row = document.createElement("tr");
        row.insertCell().appendChild(document.createTextNode(data['number']));
        row.insertCell().appendChild(document.createTextNode(data['first_time']));
        row.insertCell().appendChild(document.createTextNode(data['second_time']));
        row.insertCell().appendChild(document.createTextNode(data['third_time']));
        new_tbody.appendChild(row);
    }

    old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
    new_tbody.id = "buses";
}

function getForecastData() {
    lastForecastUpdate = new Date().toLocaleTimeString("en-SG");
    document.getElementById("last-forecast-update").innerHTML = lastForecastUpdate;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let resp = JSON.parse(xhttp.responseText);
            document.getElementById("location").innerHTML = resp['name'];
            document.getElementById("forecast").innerHTML = resp['forecast'];
        }
    };
    xhttp.open("GET", "https://home-dashboard-0411.herokuapp.com/update_forecast", true);
    xhttp.send();

    let xtemp = new XMLHttpRequest();
    xtemp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let resp = JSON.parse(xtemp.responseText);
            let celsius = resp[0]['Temperature']['Metric']['Value'];
            document.getElementById("temperature").innerHTML = celsius;
        }

        else {
            document.getElementById("temperature").innerHTML = "-";
        }

    };
    xtemp.open("GET", "http://dataservice.accuweather.com/currentconditions/v1/300554?apikey=zwz3GB4LiSkCWz8BbaDgeU2gxhgdKcsF", true);
    xtemp.send();
}

function updateBusData() {
    console.log("UPDATEBUSDATA");
    lastBusUpdate = new Date().toLocaleTimeString("en-SG");
    document.getElementById("last-bus-update").innerHTML = lastBusUpdate;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let resp = JSON.parse(xhttp.responseText);
            updateBusRows(resp);
        }
    };
    xhttp.open("GET", "https://home-dashboard-0411.herokuapp.com/update_bus_arrival", true);
    xhttp.send();
}

function updateDate() {
    document.getElementById("navigation").innerHTML = new Date().toLocaleString("en-SG");
}

function startUpdates() {
    updateDate();
    updateBusData();
    getForecastData();

    setInterval(function() {
        updateDate();
    }, 500);

    setInterval(function() {
        updateBusData();
    }, 10000);

    setInterval(function() {
        getForecastData();
    }, 3600000);
}

startUpdates();