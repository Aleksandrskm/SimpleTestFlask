import { Modal } from "./Modal.js";
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

function checkVoidTable(result,tableName, totalRowsCount) {

  if (totalRowsCount == 0) {
    const list_Tables = {
      KA: "Учетные данные о КА",
      ORBITA_KA: "Орбиты КА",
      ZONA_KA: "Зоны покрытия КА",
      CHANNEL_BEAM: "Частотно-поляризационный план КА",
      POLARIZATION: "Виды поляризации",
      GROUP_ABONENT: "Группы абонентов",
      VID_SV: "Виды связи",
      OPERATOR_SV: "Операторы связи",
      COUNTRY: "Страны",
      ABONENT: "Абонент",
      PRIVILEGES: "Статус абонента",
      SOST: "Состояние системы",
      SP_SOB: "Справочник событий",
      TEK_KA_SOST: "Срез положения группировки КА в момент события",
      TEK_KA_CHANNEL_SOST: "Срез занятости группировки КА в момент события",
      ZAPR: "Запрос связи",
      TEK_KA_ZAPR: "Срез положения группировки КА в момент запроса связи",
      TEK_KA_CHANNEL_ZAPR: "Срез занятости группировки КА в момент запроса связи",
      NAZN_KA: "Назначение КА на связь",
      SEANS_KA: "Сеансы связи КА",
      BEAM_KA: "Лучи КА"
    };
    const containerContent=document.querySelector('div .container_content');
    containerContent.innerHTML='';
    const name = document.createElement('div');
     name.classList = 'table-name';
    name.innerHTML = `${list_Tables[tableName]}`;
    containerContent.append(name);
    const tr = document.createElement('tr');
    result.columns.forEach(column=>{
      const th =document.createElement('th');
      th.innerHTML=`${column.column_description}`;
      tr.append(th);
    })
    containerContent.append(tr);
    createButtonsTable(tr,result,tr)
  }
}

function createTableContent(result,rows, tableName) {
  const list_Tables = {
    KA: "Учетные данные о КА",
    ORBITA_KA: "Орбиты КА",
    ZONA_KA: "Зоны покрытия КА",
    CHANNEL_BEAM: "Частотно-поляризационный план КА",
    POLARIZATION: "Виды поляризации",
    GROUP_ABONENT: "Группы абонентов",
    VID_SV: "Виды связи",
    OPERATOR_SV: "Операторы связи",
    COUNTRY: "Страны",
    ABONENT: "Абонент",
    PRIVILEGES: "Статус абонента",
    SOST: "Состояние системы",
    SP_SOB: "Справочник событий",
    TEK_KA_SOST: "Срез положения группировки КА в момент события",
    TEK_KA_CHANNEL_SOST: "Срез занятости группировки КА в момент события",
    ZAPR: "Запрос связи",
    TEK_KA_ZAPR: "Срез положения группировки КА в момент запроса связи",
    TEK_KA_CHANNEL_ZAPR: "Срез занятости группировки КА в момент запроса связи",
    NAZN_KA: "Назначение КА на связь",
    SEANS_KA: "Сеансы связи КА",
    BEAM_KA: "Лучи КА"
  };
  const containerContent=document.querySelector('.container_content');
  containerContent.innerHTML='';
  rows.forEach((element, rowIndex) => {
    if (rowIndex === 0) {
      const name = document.createElement('div');
      name.classList = 'table-name';
      name.innerHTML = `${list_Tables[tableName]}`;
      document.querySelector('.container_content').append(name);
      const table=document.createElement('table');
      document.querySelector('.container_content').append(table);
      const tableRow = document.createElement('tr');
      result.columns.forEach(column=>{
        const th =document.createElement('th');
        th.scope="col";
        th.innerHTML=`${column.column_description}`;
        tableRow.append(th);
      });
      table.append(tableRow);
    }
    const tableRow = document.createElement('tr');

    element.forEach((el, colIndex) => {
      const cell = document.createElement('td');
      cell.innerText = el;
      if (colIndex === 0) {
        cell.setAttribute('data-key', 'ID');
      }
      tableRow.appendChild(cell);
    });

    const table=document.querySelector('table');
    tableRow.addEventListener('click',(e)=>{
      let r = document.createRange();
      r.selectNode(e.target.parentElement);
      document.getSelection().addRange(r);
      console.log(e.target.parentElement);
      const trs=document.querySelectorAll('table tr');
      trs.forEach((tr)=>{
        if (tr==e.target.parentElement) {
          tr.style='background-color: #B5B8B1';
        }
        else{
          tr.style='';
        }
      })
       createButtonsTable(table,result,e.target.parentElement);
    });
    table.append(tableRow);
    createButtonsTable(table,result,tableRow);
  });

  const trs=document.querySelectorAll('table tr');
      trs.forEach((tr,index)=>{
        if (index==trs.length-1) {
        tr.style='background-color: #B5B8B1';
        }
      });
}

function generateTable(result) {
  if (result.total_rows_count==0) {
    checkVoidTable(result,result.name, result.total_rows_count);
  }
  else {
    createTableContent(result,result.rows, result.name);
  }
}

function createButtonsTable(table,result,tableRow) {
  const btns=document.querySelector('.table-buttons');
  if (btns) {
    btns.remove();
  }
  // console.log(tableRow);
  const buttons = document.createElement('div');
  buttons.classList = 'table-buttons';
  buttons.innerHTML=`<button class="insert">Добавить</button>`
  buttons.innerHTML += `<button class="edit">Редактировать</button>`;
  buttons.innerHTML += `<button class="copy">Добавить с копированием</button>`;
  buttons.innerHTML += `<button class="delete">Удалить</button>`;
  table.parentElement.append(buttons);
  // console.log(result.rows[0].length);
  const btnInsert=document.querySelector('.insert');
  const btnEdit=document.querySelector('.edit');
  const btnCopy=document.querySelector('.copy');
  const btnDelete=document.querySelector('.delete');
    if (!result.total_rows_count) {
      btnEdit.setAttribute('disabled', '');
      btnCopy.setAttribute('disabled', '');
      btnDelete.setAttribute('disabled', '');
    }
  const modalParent=document.querySelector('.container_content');
  const modalDelete= new Modal(modalParent,'delete',0,result.columns,tableRow,deleteRow,result);
  const modalInser= new Modal(modalParent,'insert',result.columns_count,result.columns,tableRow,insertRow,result);
  const modalCopy= new Modal(modalParent,'copy',result.columns_count,result.columns,tableRow,insertRow,result);
  const modalEdit= new Modal(modalParent,'edit',result.columns_count,result.columns,tableRow,editRow,result);
  btnDelete.addEventListener('click',()=>{
    modalDelete.createModal()});
  btnCopy.addEventListener('click',()=>{
    modalCopy.createModal(createTable)});
  btnEdit.addEventListener('click',()=>{
    modalEdit.createModal(createTable)});
  btnInsert.addEventListener('click',()=>{
    modalInser.createModal(createTable);
    
  });
   
    // functionalDelete(result.name,tableRow);
    // functionalBtnInsert(result);
    // functionalBtnCopyEnd(result,tableRow);
    // if (result.rows) {
    //   console.log(result);
    //   const rowsLenght=result.rows[0].length;
    //   functionalEdit(rowsLenght,tableRow,result);
    // }
    
}

async function editRow(data) {
  try {
    const response = await fetch('http://185.192.247.60:7130/Database/UpdateRow', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Row edit successfully:", result);
    return result;
  }
  catch (error) {
    console.error("Error edit row:", error);
  }
}
async function deleteRow(data) {
  try {
    const response = await fetch("http://185.192.247.60:7130/Database/DeleteRow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Row deleted successfully:", result);
    return result;
  }
  catch (error) {
    console.error("Error deleting row:", error);
  }
}
async function insertRow(data) {
  try {
    const response = await fetch("http://185.192.247.60:7130/Database/InsertRow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Row insert successfully:", result);
    return result;
  }
  catch (error) {
    console.error("Error insert row:", error);
  }
}

function createTable(element) {
  let data = { name: element };
  postJSON(data).then(result => {
    generateTable(result);
  });

  document.querySelector('.container_content').innerHTML = '';
}

async function postJSON(data) {
  try {
    const response = await fetch(`http://185.192.247.60:7130/Database/TableInfo/${data.name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

function getNameTables(url){
  const list_Tables = {
    KA: "Учетные данные о КА",
    ORBITA_KA: "Орбиты КА",
    ZONA_KA: "Зоны покрытия КА",
    CHANNEL_BEAM: "Частотно-поляризационный план КА",
    POLARIZATION: "Виды поляризации",
    GROUP_ABONENT: "Группы абонентов",
    VID_SV: "Виды связи",
    OPERATOR_SV: "Операторы связи",
    COUNTRY: "Страны",
    ABONENT: "Абонент",
    PRIVILEGES: "Статус абонента",
    SOST: "Состояние системы",
    SP_SOB: "Справочник событий",
    TEK_KA_SOST: "Срез положения группировки КА в момент события",
    TEK_KA_CHANNEL_SOST: "Срез занятости группировки КА в момент события",
    ZAPR: "Запрос связи",
    TEK_KA_ZAPR: "Срез положения группировки КА в момент запроса связи",
    TEK_KA_CHANNEL_ZAPR: "Срез занятости группировки КА в момент запроса связи",
    NAZN_KA: "Назначение КА на связь",
    SEANS_KA: "Сеансы связи КА",
    BEAM_KA: "Лучи КА"
  };
  let response = fetch(url)
  .then(response => response.json())
  .then(json => {
    
    json.forEach(element => {
      const elem = document.createElement('div');
      for (let key in list_Tables) {
        if (element == key) {
          elem.innerHTML = `<div class="container__nav__el"> ${list_Tables[key]}</div>`;
        }
      }
      elem.addEventListener('click', (e) => {
        const trs=document.querySelectorAll('.container__nav__el');
      trs.forEach((tr)=>{
        if (tr==e.target) {
          tr.style='background-color: #B5B8B1';
        }
        else{
          tr.style='';
        }
      })
        createTable(element) });
        if (elem) {
          document.querySelector('.container__nav').append(elem);
        }
     
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const url = 'http://185.192.247.60:7130/Database/DBTables';
  const h2=document.querySelector('h2');
  if (h2) {
    if (h2.innerText=='Редактор данных') {
      getNameTables(url);
    }
  }
});


