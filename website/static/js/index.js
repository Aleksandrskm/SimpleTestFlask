import { table } from "./table.js";
'use strict';
class dataTle
{
  constructor(ID,Naim,Active,TLE_Classification,TLE_Name,TLE_International_class1,TLE_International_class2,TLE_Epoch_year,TLE_Epoch_Time,TLE_Element_Version
    ,TLE_Nomer_vitka,TLE_line1,TLE_Control_sum_line1,Data_beg,Data_end,TLE_Perv_Proizv,TLE_Vtor_Proizv,TLE_Koef_torm,TLE_Naklon,TLE_Dolgota_uzla,TLE_Ecscentr,
    TLE_Pericentr,TLE_Mean_Anomaly,TLE_Mean_Motion,TLE_line2,TLE_Control_sum_line2
  ){
      this.ID=ID;
      this.Naim=Naim;
      this.Active=Active;
      this.TLE_Classification=TLE_Classification;
      this.TLE_Name=TLE_Name;
      this.TLE_International_class1=TLE_International_class1;
      this.TLE_International_class2=TLE_International_class2;
      this.TLE_Epoch_year=TLE_Epoch_year;
      this.TLE_Epoch_Time=TLE_Epoch_Time;
      this.TLE_Element_Version=TLE_Element_Version;
      this.TLE_Nomer_vitka=TLE_Nomer_vitka;
      this.TLE_line1=TLE_line1;
      this.TLE_Control_sum_line1=TLE_Control_sum_line1;
      this.Data_beg=Data_beg;
      this.Data_end=Data_end;
      this.TLE_Perv_Proizv=TLE_Perv_Proizv;
      this.TLE_Vtor_Proizv=TLE_Vtor_Proizv;
      this.TLE_Koef_torm=TLE_Koef_torm;
      this.TLE_Naklon=TLE_Naklon;
      this.TLE_Dolgota_uzla=TLE_Dolgota_uzla;
      this.TLE_Ecscentr=TLE_Ecscentr;
      this.TLE_Pericentr=TLE_Pericentr;
      this.TLE_Mean_Anomaly=TLE_Mean_Anomaly;
      this.TLE_Mean_Motion=TLE_Mean_Motion;
      this.TLE_line2=TLE_line2;
      this.TLE_Control_sum_line2=TLE_Control_sum_line2;
  }
}
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
function readLinesValue(fileReader) {
  let tle= new dataTle();
  let jsonTLE={};
  const arrTLE=[];
  const arrClassTlEs=[];
  // console.log(fileReader);
  const lines = (fileReader).split("\r\n");
  // console.log(lines)
  let count_line=0;
  for (const line of lines) {
    if (count_line==3) {
      count_line=0
      arrTLE.push(jsonTLE);
      jsonTLE={};
      arrClassTlEs.push(tle);
      tle=new dataTle();
    }
    processLine(line,count_line,jsonTLE,tle);
    
    count_line++;
  }
  arrTLE.push(jsonTLE);
  arrClassTlEs.push(tle);
  console.log(arrClassTlEs);
  console.log(arrTLE);
  
}
function processLine(line,count_line,jsonTLE,tle) {
  let dataTLE;
  
  const arrTLENames=['Номер строки_1','Kod_NORAD',
    'TLE_Classification','TLE_International_class1',
    'TLE_International_class2',
    'TLE_Epoch_year','TLE_Epoch_Time',
    'TLE_Perv_Proizv','TLE_Vtor_Proizv'
  ,'TLE_Koef_torm',
  'ephemeris_type',
  'TLE_Element_Version',
  'TLE_Control_sum_line1'];
  const arrTLENames_two=['Номер строки_2','Номер спутника в базе данных NORAD_2',
    'TLE_Naklon','TLE_Dolgota_uzla'
    ,'TLE_Ecscentr',
    'TLE_Pericentr',
    'TLE_Mean_Anomaly',
    'TLE_Mean_Motion'
  ,'TLE_Nomer_vitka',
  'TLE_Control_sum_line2'];
  
  dataTLE=line;
  let element='';
  let counter=0;
  if (count_line==0) {
    jsonTLE['TLE_Name']=dataTLE;
    tle.TLE_Name=dataTLE;
  }
  else if (count_line==1) {
    jsonTLE['TLE_line1']=dataTLE;
    tle.TLE_line1=dataTLE;
    for (let i = 0; i < dataTLE.length; i++) {
      if (i==0) {
        element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=+element;
        element='';
        counter+=1;
      }
      else if (i>1 && i<7) {
        if (i==6) {

          element+=dataTLE[i];
          const nameField=arrTLENames[counter];
          jsonTLE[nameField]=+element;
          element='';
          counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if(i==7){
        element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=element;
        tle.TLE_Classification=element;
        element='';
        counter+=1;
      } 
      else if (i>7 && i<11) {
        if (i==10) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=Number(element);
        tle.TLE_International_class1=Number(element);
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      // else if (i>10 && i<14) {
      //   if (i==13) {
      //     element+=dataTLE[i];
      //   const nameField=arrTLENames[counter];
      //   jsonTLE[nameField]=element;
      //   element='';
      //   counter+=1;
      //   }
      //   else{
      //     element+=dataTLE[i];
      //   }
      // }
      else if (i>10 && i<15) {
        if (i==14) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=element;
        tle.TLE_International_class2=element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>17 && i<20) {
        if (i==19) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=Number(element);
        tle.TLE_Epoch_year=Number(element);
        // console.log(element)  
        element='';
        counter+=1;
        // console.log(arrTLENames[counter]);
        // console.log(counter);
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>19 && i<32) {
        
        if (i==31) {
          element+=dataTLE[i];
          const nameField=arrTLENames[counter];
          jsonTLE[nameField]=+(element);
          tle.TLE_Epoch_Time=+(element);
          element='';
         
          counter+=1;
        }
        else{
  
          element+=dataTLE[i];
          
        }
      }
      else if (i>32 && i<43) {
        if (i==42) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        let correctElem
        if (element[0]==' ') {
          correctElem=element.replace(/\s/,'0');
        }
        jsonTLE[nameField]=+correctElem;
        tle.TLE_Perv_Proizv=+correctElem;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>43 && i<53) {
        if (i==52) {
          let correctElem='';
          let num='',degree='';

          if (element[0]==' ') {
            correctElem=element.replace(/\s/,'0');
            let indexDegree=element.search(/[-+]/);
            
            for (let i = 0; i < indexDegree; i++) {
              num+=correctElem[i];
            }
            
            for (let index = indexDegree; index < correctElem.length; index++) {
               degree += correctElem[index];
              
            }
          }
          element+=dataTLE[i];
          const nameField=arrTLENames[counter];
          jsonTLE[nameField]=Math.pow(+num,+degree);
          tle.TLE_Vtor_Proizv=Math.pow(+num,+degree);
          element='';
          counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>52 && i<62) {
        if (i==61) {
          let correctElem='';
          let num='',degree='';

          if (element[0]==' ') {
            correctElem=element.replace(/\s/,'0.');
            // console.log(element)
            let indexDegree=correctElem.search(/[-+]/);
            
            for (let i = 0; i < indexDegree; i++) {
              num+=correctElem[i];
            }
            
            for (let index = indexDegree; index < correctElem.length; index++) {
               degree += correctElem[index];
              
            }
          }
          element+=dataTLE[i];
          const nameField=arrTLENames[counter];
          jsonTLE[nameField]=Math.pow(+num,+degree);
          tle.TLE_Koef_torm=Math.pow(+num,+degree);
          element='';
          counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i==62) {
        
        element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=+element;
        
        element='';
        counter+=1;
        
      }
      else if (i>63 && i<68) {
        if (i==67) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=+element;
        tle.TLE_Element_Version=+element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i==68) {
        
        element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=+element;
        tle.TLE_Control_sum_line1=+element;
        element='';
        counter+=1;
        
      }
      
    }
  }
  else if (count_line==2) {
    jsonTLE['TLE_line2']=dataTLE;
    tle.TLE_line2=dataTLE;
    for (let i = 0; i < dataTLE.length; i++) {
      if (i==0) {
        element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=+element;
        element='';
        counter+=1;
      }
      else if (i>1 && i<7) {
        if (i==6) {
          element+=dataTLE[i];
          const nameField=arrTLENames_two[counter];
          jsonTLE[nameField]=+element;
          element='';
          counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }

      else if (i>8 && i<16) {
        if (i==15) {
          element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=+element;
        tle.TLE_Naklon=+element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>16 && i<25) {
        if (i==24) {
          element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=parseFloat(element);
        tle.TLE_Dolgota_uzla=+element;
        // console.log(element)  
        element='';
        counter+=1;
        // console.log(arrTLENames_two[counter]);
        // console.log(counter);
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>25 && i<33) {
        
        if (i==32) {
          element+=dataTLE[i];
          const nameField=arrTLENames_two[counter];
          jsonTLE[nameField]=Number('0.'+element);
          tle.TLE_Ecscentr=Number('0.'+element);
          element='';
         
          counter+=1;
        }
        else{
  
          element+=dataTLE[i];
          
        }
      }
      else if (i>33 && i<42) {
        if (i==41) {
          element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=+element;
        tle.TLE_Pericentr=+element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>43 && i<51) {
        if (i==50) {
          element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=+element;
        tle.TLE_Mean_Anomaly=+element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>51 && i<61) {
        if (i==60) {
          element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=+element;
        tle.TLE_Mean_Motion=+element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>62 && i<68) {
        if (i==67) {
          element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=+element;
        tle.TLE_Nomer_vitka=+element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i==68) {
        
        element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=+element;
        tle.TLE_Control_sum_line2=+element;
        element='';
        counter+=1;
        
      }
      
    }
  
  }
  
 
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
  const url = 'http://185.192.247.60:7130/Database/DBTables';
  const h2=document.querySelector('h2');
  if (h2) {
    if (h2.innerText=='Редактор данных') {
      table(url);
    }
    if (h2.innerText=='Cервис монотонного времени') {
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
      // example usage: realtime clock
      setInterval(function(){
        let currentTime = getDateTime();
        document.getElementById("timer").innerHTML = currentTime;
      }, 0);
    }
  }
});




