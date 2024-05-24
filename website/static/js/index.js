'use strict';
function azimuth_and_elevation_angle() {
    const lat1 = document.getElementById('lat1').value;
    const lon1 = document.getElementById('lon1').value;
    const alt1 = document.getElementById('alt1').value;
    const lat2 = document.getElementById('lat2').value;
    const lon2 = document.getElementById('lon2').value;
    const alt2 = document.getElementById('alt2').value;

    fetch('/api/ade?lat1=' + lat1 + '&lon1=' + lon1 + '&alt1=' + alt1 + '&lat2=' + lat2 + '&lon2=' + lon2 + '&alt2=' + alt2)
      .then(response => response.json())
      .then(data => {
        document.getElementById('azimuth').innerText = data.azimuth;
        document.getElementById('elevation').innerText = data.elevation;
        document.getElementById('distance').innerText = data.distance;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

function finding_coordinates() {
    const lat1 = document.getElementById('first_TLE_line').value;
    const lon1 = document.getElementById('second_TLE_line').value;
    console.log(first_TLE_line)
    console.log(second_TLE_line)

    fetch('/api/finding_coordinates?first_TLE_line=' + first_TLE_line + '&second_TLE_line=' + second_TLE_line)
      .then(response => response.json())
      .then(data => {
        document.getElementById('lat.degrees').innerText = data.lat;
        document.getElementById('lon.degrees').innerText = data.lon;
        document.getElementById('height.km').innerText = data.height;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


function get_coordinates() {
    const first_TLE_line = document.getElementById('first_TLE_line').value;
    const second_TLE_line = document.getElementById('second_TLE_line').value;
    const name = document.getElementById('name').value;
    console.log(name)
    console.log(first_TLE_line)
    console.log(second_TLE_line)

    fetch('/api/get_coordinates?first_TLE_line=' + first_TLE_line + '&second_TLE_line=' + second_TLE_line + '&name' + name)
      .then(response => response.json())
      .then(data => {
       console.log(data.response)
       document.getElementById('response').innerText = data.response;

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

function communication_availability() {
    const acceptable_session_time_in_sec = document.getElementById('acceptable_session_time_in_sec').value;
    const dates_delta_in_sec = document.getElementById('dates_delta_in_sec').value;
    const interval_in_sec = document.getElementById('interval_in_sec').value;
    const min_session_time_in_sec = document.getElementById('min_session_time_in_sec').value;
    const start_datetime = document.getElementById('start_datetime').value;
    console.log(start_datetime)
    const lat = document.getElementById('lat').value;
    const lon = document.getElementById('lon').value;
    const name = document.getElementById('name').value;


    fetch('/api/communication_availability?acceptable_session_time_in_sec=' + acceptable_session_time_in_sec +
     '&dates_delta_in_sec=' + dates_delta_in_sec + '&interval_in_sec=' + interval_in_sec + '&min_session_time_in_sec='
      + min_session_time_in_sec + '&start_datetime=' + start_datetime + '&lat=' + lat + '&lon=' + lon + '&name=' + name)

      .then(response => response.json())
      .then(data => {
       console.log(data.response)
       document.getElementById('response').innerText = data.response;

      })
      .catch(error => {
        console.error('Error:', error);
      });
   }

async function postJSON(data) {
    try {
      const response = await fetch("http://185.192.247.60:7128/Database/TableInfo", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Success:", result);
      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  }
let url = 'http://185.192.247.60:7128/Database/DBTables';
let response =  fetch(url)
.then(response =>response.json())
.then(json=>{
  json.forEach(element => {
    const elem =document.createElement('div');
    elem.innerHTML=`<div class="container__nav__el"> ${element}</div>`;
    elem.addEventListener('click',(e)=>{
      let content = e.target.innerHTML;
      // console.log(content);
      const data = {name:content};
      document.querySelector('.container_content').innerHTML='';
      postJSON(data).then(result=>{
        if (result.total_rows_count==0) {
          const name=document.createElement('div');
            name.innerHTML=`<div>${result.name}</div>`;
            document.querySelector('.container_content').append(name);
        }
        result.rows.forEach(element => {
          if (result.rows[0]===element) {
            const name=document.createElement('div');
            name.innerHTML=`<div>${result.name}</div>`;
            document.querySelector('.container_content').append(name);
          }
          const table=document.createElement('tr');

          table.innerHTML+=`<tr></tr>`;
          document.querySelector('.container_content').append(table);
          element.forEach(el=>{
            table.innerHTML+=`<td>${el}</td>
            `;
          });
          // console.log(element);
          document.querySelector('.container_content').append(table);
        });
        // console.log(result.rows);
      });
    });
    document.querySelector('.container__nav').append(elem);
  });
  // console.log(json);
});
