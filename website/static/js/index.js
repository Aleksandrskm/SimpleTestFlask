import { table } from "./table.js";
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
function readLinesValue(fileReader) {
  let jsonTLE={};
  const arrTLE=[];
  console.log(fileReader);
  const lines = (fileReader).split("\r\n");
  console.log(lines)
  let count_line=0;
  for (const line of lines) {
    if (count_line==3) {
      count_line=0
      arrTLE.push(jsonTLE);
      jsonTLE={};
    }
    processLine(line,count_line,jsonTLE);
    count_line++;
  }
  console.log(arrTLE);
}
function processLine(line,count_line,jsonTLE) {
  let dataTLE;
  const arrTLENames=['Номер строки_1','Номер спутника в базе данных NORAD_1',
    'TLE_Classification','TLE_International_class1',
    'TLE_International_class2',
    'TLE_Epoch_year','TLE_Epoch_Time',
    'TLE_Perv_Proizv','TLE_Vtor_Proizv'
  ,'TLE_Koef_torm',
  'Изначально — типы эфемерид',
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
  }
  else if (count_line==1) {
    for (let i = 0; i < dataTLE.length; i++) {
      if (i==0) {
        element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=element;
        element='';
        counter+=1;
      }
      else if (i>1 && i<7) {
        if (i==6) {
          element+=dataTLE[i];
          const nameField=arrTLENames[counter];
          jsonTLE[nameField]=element;
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
        element='';
        counter+=1;
      } 
      else if (i>7 && i<11) {
        if (i==10) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=element;
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
      else if (i>10 && i<17) {
        if (i==16) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=element;
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
        jsonTLE[nameField]=element;
        console.log(element)  
        element='';
        counter+=1;
        console.log(arrTLENames[counter]);
        console.log(counter);
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>19 && i<32) {
        
        if (i==31) {
          element+=dataTLE[i];
          const nameField=arrTLENames[counter];
          jsonTLE[nameField]=element;
         
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
        jsonTLE[nameField]=element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>43 && i<52) {
        if (i==51) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>52 && i<61) {
        if (i==60) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=element;
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
        jsonTLE[nameField]=element;
        element='';
        counter+=1;
        
      }
      else if (i>63 && i<68) {
        if (i==67) {
          element+=dataTLE[i];
        const nameField=arrTLENames[counter];
        jsonTLE[nameField]=element;
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
        jsonTLE[nameField]=element;
        element='';
        counter+=1;
        
      }
      
    }
  }
  else if (count_line==2) {
    for (let i = 0; i < dataTLE.length; i++) {
      if (i==0) {
        element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=element;
        element='';
        counter+=1;
      }
      else if (i>1 && i<7) {
        if (i==6) {
          element+=dataTLE[i];
          const nameField=arrTLENames_two[counter];
          jsonTLE[nameField]=element;
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
        jsonTLE[nameField]=element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>16 && i<26) {
        if (i==25) {
          element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=element;
        console.log(element)  
        element='';
        counter+=1;
        console.log(arrTLENames_two[counter]);
        console.log(counter);
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>25 && i<33) {
        
        if (i==32) {
          element+=dataTLE[i];
          const nameField=arrTLENames_two[counter];
          jsonTLE[nameField]=element;
         
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
        jsonTLE[nameField]=element;
        element='';
        counter+=1;
        }
        else{
          element+=dataTLE[i];
        }
      }
      else if (i>42 && i<51) {
        if (i==50) {
          element+=dataTLE[i];
        const nameField=arrTLENames_two[counter];
        jsonTLE[nameField]=element;
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
        jsonTLE[nameField]=element;
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
        jsonTLE[nameField]=element;
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
        jsonTLE[nameField]=element;
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
  }
  
  
  
    if (!document.querySelector('.task-btn-TLE')) {
      function printFiles(e) {  
        const files = e.target.files;   // получаем все выбранные файлы
        for (let file of files) {        // Перебираем все выбранные файлы 
          // создаем объект FileReader для считывания файла
          const reader = new FileReader();
          // console.log(arrTLENames[7]);
          console.log(reader);
          // при успешном чтении файла выводим его содержимое на веб-страницу
          reader.onload = () => {  
                // выводим содержимое
                // dataTLE=reader.result;
                
                // console.log(reader.result);
                
                // let element='';
                // let counter=0;
                // for (let i = 0; i < dataTLE.length; i++) {
                //   if (i==0) {
                //     element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                //   }
                //   else if (i>1 && i<7) {
                //     if (i==6) {
                //       element+=dataTLE[i];
                //       const nameField=arrTLENames[counter];
                //       jsonTLE[nameField]=element;
                //       element='';
                //       counter+=1;
                //     }
                //     else{
                //       element+=dataTLE[i];
                //     }
                //   }
                //   else if(i==7){
                //     element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                //   } 
                //   else if (i>7 && i<11) {
                //     if (i==10) {
                //       element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                //     }
                //     else{
                //       element+=dataTLE[i];
                //     }
                //   }
                //   else if (i>10 && i<14) {
                //     if (i==13) {
                //       element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                //     }
                //     else{
                //       element+=dataTLE[i];
                //     }
                //   }
                //   else if (i>13 && i<17) {
                //     if (i==16) {
                //       element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                //     }
                //     else{
                //       element+=dataTLE[i];
                //     }
                //   }
                //   else if (i>17 && i<20) {
                //     if (i==19) {
                //       element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     console.log(element)  
                //     element='';
                //     counter+=1;
                //     console.log(arrTLENames[counter]);
                //     console.log(counter);
                //     }
                //     else{
                //       element+=dataTLE[i];
                //     }
                //   }
                //   else if (i>19 && i<32) {
                    
                //     if (i==31) {
                //       element+=dataTLE[i];
                //       const nameField=arrTLENames[counter];
                //       jsonTLE[nameField]=element;
                     
                //       element='';
                     
                //       counter+=1;
                //     }
                //     else{

                //       element+=dataTLE[i];
                      
                //     }
                //   }
                //   else if (i>32 && i<43) {
                //     if (i==42) {
                //       element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                //     }
                //     else{
                //       element+=dataTLE[i];
                //     }
                //   }
                //   else if (i>43 && i<52) {
                //     if (i==51) {
                //       element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                //     }
                //     else{
                //       element+=dataTLE[i];
                //     }
                //   }
                //   else if (i>52 && i<61) {
                //     if (i==60) {
                //       element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                //     }
                //     else{
                //       element+=dataTLE[i];
                //     }
                //   }
                //   else if (i==62) {
                    
                //     element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                    
                //   }
                //   else if (i>63 && i<68) {
                //     if (i==67) {
                //       element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                //     }
                //     else{
                //       element+=dataTLE[i];
                //     }
                //   }
                //   else if (i==68) {
                    
                //     element+=dataTLE[i];
                //     const nameField=arrTLENames[counter];
                //     jsonTLE[nameField]=element;
                //     element='';
                //     counter+=1;
                    
                //   }
                  
                // }
                readLinesValue(reader.result);
                // для разделения, если выбрано несколько файлов
                console.log("==============================");
                // console.log(jsonTLE);
                // console.log(JSON.stringify(jsonTLE));
          };
          reader.readAsText(file);       
          // считываем файл   
        }
    }
    document.getElementById("get_TLE").addEventListener("change", printFiles);
    }
  
});




