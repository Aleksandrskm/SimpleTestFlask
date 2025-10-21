import { table } from "./table.js";
import {completionAbonents} from "./abonents.js"
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

document.addEventListener('DOMContentLoaded', function() {
  const url = 'http://185.192.247.60:7130/Database/db_structure';
  const h2=document.querySelector('h2');
  function getDateTime() {
    let now     = new Date(); 
    let year    = now.getFullYear();
    let month   = now.getMonth()+1; 
    let day     = now.getDate();
    let hour    = now.getHours();
    let minute  = now.getMinutes();
    let second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }  
     
    let dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
  }
  setInterval(function(){
    let currentTime = getDateTime();
    document.getElementById("timer-start").innerHTML = currentTime;
  }, 0);
  if (document.getElementById("timer-settings"))
  {
      setInterval(function(){
          let currentTime = getDateTime();
          document.getElementById("timer-settings").innerHTML = currentTime;
      }, 0);
  }

  console.log(1);
  document.getElementById('settingsBtn').addEventListener('click',(e)=>{
    document.getElementById('myModal').style.display='flex';
})
if (document.querySelector('.close')){
    document.querySelector('.close').addEventListener('click',(e)=>{
        document.getElementById('myModal').style.display='none';
    })
}
   if (document.querySelector('.modal-resize-btn')){document.querySelector('.modal-resize-btn').addEventListener('click',(e)=>{
       document.getElementById('myModal').style.display='none';
   })}

  if (h2) {
    if (h2.innerText==='Редактор данных') {
      table(url);
    }
    if (h2.innerText==='Заполнение данных для Абонентов') {
        console.log(222);
      completionAbonents(url);
    }
    if (h2.innerText==='Cервис монотонного времени') {
     
      // example usage: realtime clock
      setInterval(function(){
        let currentTime = getDateTime();
        document.getElementById("timer").innerHTML = currentTime;
      }, 0);
      setInterval(function(){
        let currentTime = getDateTime();
        document.getElementById("timer-loc").innerHTML = currentTime;
      }, 0);
      
    }
  }
});




