'use strict';
function azimuth_and_elevation_angle() {
    const lat1 = document.getElementById('lat1').value;
    const lon1 = document.getElementById('lon1').value;
    const alt1 = document.getElementById('alt1').value;
    const lat2 = document.getElementById('lat2').value;
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

function closeModal(modal) {
  modal.classList.add('hide');
  modal.classList.remove('show');
  document.body.style.overflow='';
}
function openModal(modal) {
  modal.classList.add('show');
  modal.classList.remove('hide');
  document.body.style.overflow='hidden';
  // clearInterval(modalTimerId);
}
function checkVoidTable(tableName,totalRowsCount){
  if (totalRowsCount==0) {
    const name=document.createElement('div');
    name.classList='table-name';
      name.innerHTML=`<div>${list_Tables[tableName]}</div>`;
      document.querySelector('.container_content').append(name);

  }
}
function createTableContent(rows,tableName){
  rows.forEach(element => {
    if (rows[0]===element) {
      const name=document.createElement('div');
      name.classList='table-name';
      name.innerHTML=`<div>${list_Tables[tableName]}</div>`;
      document.querySelector('.container_content').append(name);
    }
    const table=document.createElement('tr');

    table.innerHTML+=`<tr></tr>`;
    document.querySelector('.container_content').append(table);
    element.forEach(el=>{
      // if (typeof(el)=='string') {

      //   // table.innerHTML+=`<td>${el.replace(/\s/g, "")}</td>`;

      // }
      // else{
        table.innerHTML+=`<td>${el}</td>`;
      // }

    });


    createButtonsTable(table);
    document.querySelector('.container_content').append(table);
  });
}
function generateTable(result){
  checkVoidTable(result.name,result.total_rows_count);
  createTableContent(result.rows,result.name);
  functionalEdit(result.total_rows_count);
  functionalDelete();
}
function createButtonsTable(table){
  const buttons=document.createElement('div');
    buttons.classList='table-buttons';
    buttons.innerHTML+=`<button class=edit>редактировать</button>`;
    buttons.innerHTML+=`<button class=delete>удалить</button>`;
    table.append(buttons);
}
function functionalEdit(totalRowsCount){
  const buttonsEdit=document.querySelectorAll('.edit');
  // console.log(buttonsEdit);
  buttonsEdit.forEach(buttonEdit=>{
    buttonEdit.addEventListener('click',(e)=>{
      // e.target.parentElement.parentElement.innerHTML=``;
      const modal=document.querySelector('.modal');
      const modalContent=document.querySelector('.modal__content');
      let rowTable=e.target.parentElement.parentElement.children;
      console.log(rowTable);
      for (let i = 0; i < totalRowsCount; i++) {
        if (rowTable[i].innerHTML=='Не в сети') {
          console.log(rowTable[i].innerHTML);
          modalContent.innerHTML+=`<input required placeholder="Не в сети" type="text" class="modal__input">`;
        }
        else if (rowTable[i].innerHTML=='В сети') {
          console.log(rowTable[i].innerHTML);
          modalContent.innerHTML+=`<input required placeholder="В сети" type="text" class="modal__input">`;
        }
        else if (rowTable[i].innerHTML=='Не подключен') {

          modalContent.innerHTML+=`<input required placeholder="Не подключен" type="text" class="modal__input">`;
        }
        else{
          modalContent.innerHTML+=`<input required placeholder=${rowTable[i].innerHTML} type="text" class="modal__input">`;
          // console.log(rowTable[i]);
        }

      }
      openModal(modal);
     const btnSave=document.querySelector('.btn');
     btnSave.addEventListener('click',()=>{
      modalContent.innerHTML=`<form action="#">
      <div data-close class="modal__close">&times;</div>
      <div class="modal__title">Редактирование таблицы</div>
      <!-- <input required placeholder="Ваше имя" name="name" type="text" class="modal__input">
      <input required placeholder="Ваш номер телефона" name="phone" type="phone" class="modal__input"> -->
      <button class="btn btn_dark btn_min">Сохранить</button>
  </form>`;
  closeModal(modal);

     })


      console.log(totalRowsCount);




    })
  });
}
function functionalDelete(){
  const buttonsDelete=document.querySelectorAll('.delete');
      buttonsDelete.forEach(buttonDelete=>{
        buttonDelete.addEventListener('click',(e)=>{

           e.target.parentElement.parentElement.remove();

        })
      });
}
function createTable(element){
//  displayLoading();

  //  let content = e.target.innerHTML;
  //  console.log(content);
      let data = {name:element};
      postJSON(data).then(result=>{
        generateTable(result);
         // console.log(result.rows);
       });

  document.querySelector('.container_content').innerHTML='';

  setTimeout(hideLoading,3000);
}
async function postJSON(data) {
    try {
      // let timerID=setInterval(async function(){});
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
  const loaderContainer = document.querySelector('.loader-container');
////const displayLoading = () => {
//  loaderContainer.style.display = 'block';
//
//};
const list_Tables={
  KA:"Учетные данные о КА",
ORBITA_KA:"Орбиты КА",
ZONA_KA:"Зоны покрытия КА",
CHANNEL_BEAM:"Частотно-поляризационный план КА",
POLARIZATION:"Виды поляризации",
GROUP_ABONENT:"Группы абонентов",
VID_SV:"Виды связи",
OPERATOR_SV:"Операторы связи",
COUNTRY:"Страны",
ABONENT:"Абонент",
PRIVILEGES:"Статус абонента",
SOST:"Состояние системы",
SP_SOB:"Справочник событий",
TEK_KA_SOST:"Срез положения группировки КА в момент события",
TEK_KA_CHANNEL_SOST:"Срез занятости группировки КА в момент события",
ZAPR:"Запрос связи",
TEK_KA_ZAPR:"Срез положения группировки КА в момент запроса связи",
TEK_KA_CHANNEL_ZAPR:"Срез занятости группировки КА в момент запроса связи",
NAZN_KA:"Назначение КА на связь",
SEANS_KA:"Сеансы связи КА",
BEAM_KA:"Лучи КА"
};
const hideLoading = () => {
  loaderContainer.style.display = 'none';

};
let url = 'http://185.192.247.60:7128/Database/DBTables';
let response =  fetch(url)
.then(response =>response.json())
.then(json=>{
  json.forEach(element => {
    const elem =document.createElement('div');
    for (let key in list_Tables){
      if (element==key) {
        elem.innerHTML=`<div class="container__nav__el"> ${list_Tables[key]}</div>`;
      }
    }
    elem.addEventListener('click',()=>{createTable(element)});
    document.querySelector('.container__nav').append(elem);
  });
});
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
