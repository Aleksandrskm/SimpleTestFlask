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


'use strict';

function closeModal(modal) {
  modal.classList.add('hide');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function openModal(modal) {
  modal.classList.add('show');
  modal.classList.remove('hide');
  document.body.style.overflow = 'hidden';
}

function checkVoidTable(tableName, totalRowsCount) {
  if (totalRowsCount == 0) {
    const name = document.createElement('div');
    name.classList = 'table-name';
    name.innerHTML = `<div>${list_Tables[tableName]}</div>`;
    document.querySelector('.container_content').append(name);
  }
}

function createTableContent(result,rows, tableName) {
  const containerContent=document.querySelector('.container_content');
  containerContent.innerHTML='';
  rows.forEach((element, rowIndex) => {
    if (rowIndex === 0) {
      const name = document.createElement('div');
      name.classList = 'table-name';
      name.innerHTML = `<div>${list_Tables[tableName]}</div>`;
      document.querySelector('.container_content').append(name);
      const table=document.createElement('table');
      document.querySelector('.container_content').append(table);
    }
    const tableRow = document.createElement('tr');

    element.forEach((el, colIndex) => {
      const cell = document.createElement('td');
      cell.innerText = el;
      if (colIndex === 0) { // Assume first column is primary key for simplicity
        cell.setAttribute('data-key', 'ID');
      }
      tableRow.appendChild(cell);
    });


    const table=document.querySelector('table')
    table.append(tableRow);

    tableRow.addEventListener('click',(e)=>{
    //  console.log(e.target.parentElement);
    let r = document.createRange();
    r.selectNode(e.target.parentElement);
    document.getSelection().addRange(r);
     createButtonsTable(table,result,e.target.parentElement);


    })
  });
}

function generateTable(result) {
  checkVoidTable(result.name, result.total_rows_count);
  createTableContent(result,result.rows, result.name);
  // functionalEdit(result.total_rows_count);
  // functionalDelete(result.name); // Pass the table name to the delete function
}

function createButtonsTable(table,result,tableRow) {
  const btns=document.querySelector('.table-buttons');
  if (btns) {
    btns.remove();
  }
  // console.log(tableRow);
  const buttons = document.createElement('div');
  buttons.classList = 'table-buttons';
  buttons.innerHTML=`<button class="insert">добавить</button>`
  buttons.innerHTML += `<button class="edit">редактировать</button>`;
  buttons.innerHTML += `<button class="delete">удалить</button>`;

  table.append(buttons);
  // console.log(result.rows[0].length);
  functionalEdit(result.rows[0].length,tableRow,result);
  functionalDelete(result.name,tableRow);
  functionalBtnInsert(result);
  // console.log(tableRow.parentElement.children[1])
}
function functionalBtnInsert(table){
  const buttonInsert=document.querySelector('.insert');
  const rows=document.querySelectorAll('tr');
  buttonInsert.addEventListener('click',()=>{
    const primaryKeys = {};
    console.log(rows);
    rows.forEach(row=>{
      row.querySelectorAll('td[data-key]').forEach((td) => {
        const key = td.getAttribute('data-key');
        const value = td.innerText;
        primaryKeys[key] = value;
        primaryKeys[key]++;
      });

    });
    console.log(primaryKeys);
    const modal = document.querySelector('.confirmation-modal-add');
    const modalContent = document.querySelector('.confirmation-modal__content-add');
    for (let i = 1; i < table.columns_count; i++) {
      console.log(modal);
      modalContent.innerHTML+=`<input required placeholder=${table.columns[i]} type="text" class="modal__input">`;
    }
    openModal(modal);
    const btnAdd=document.querySelector('.btn_confirm-add');
    btnAdd.addEventListener('click',()=>{
      const inputs=document.querySelectorAll('.modal__input');
      const arrData=[];
      arrData.push(String(primaryKeys.ID));
        inputs.forEach((input,index)=>{
          if(input.value){
            arrData.push(input.value);
          }

        });
        const data={
          "table_name": `${table.name}`,
          "columns":table.columns,
          "values":arrData,
          primary_keys: primaryKeys

        };
        console.log(data);
        console.log(arrData);
        insertRow(data);
        acceptChanges();
        modalContent.innerHTML=`<div class="confirmation-modal__title-add">Добавление строки</div>
        <div class="confirmation-modal__buttons-add">
          <button class="btn btn_confirm-add">Соханить</button>
          <button class="btn btn_cancel">Отмена</button>
        </div>`;
        closeModal(modal);
        const timeoutCreate =createTable(table.name);
        setTimeout(timeoutCreate,3000);
    });
    const cancelButton = modal.querySelector('.btn_cancel');
    cancelButton.onclick = () => {
      rollbackChanges().then(() => {
        closeModal(modal);
      }).catch(error => {
        console.error("Error rolling back changes:", error);
        closeModal(modal);
      });
    };
  });
}
function functionalEdit(totalRowsCount,rowTable,result) {
  const buttonsEdit = document.querySelectorAll('.edit');
  buttonsEdit.forEach(buttonEdit => {
    buttonEdit.addEventListener('click', (e) => {
      const modal = document.querySelector('.modal');
      const modalContent = document.querySelector('.modal__content');
      // let rowTablee = e.target.parentElement.parentElement.children;
      // console.log(rowTable.children);
      //  console.log(rowTable);
      for (let i = 0; i < totalRowsCount; i++) {
        if (rowTable.children[i].innerHTML=='Не в сети') {
          // console.log(rowTablee[i].innerHTML);
          modalContent.innerHTML+=`<input required placeholder="Не в сети" type="text" class="modal__input">`;
        }
        else if (rowTable.children[i].innerHTML=='В сети') {
          // console.log(rowTablee[i].innerHTML);
          modalContent.innerHTML+=`<input required placeholder="В сети" type="text" class="modal__input">`;
        }
        else if (rowTable.children[i].innerHTML=='Не подключен') {

          modalContent.innerHTML+=`<input required placeholder="Не подключен" type="text" class="modal__input">`;
        }
        else{
          modalContent.innerHTML+=`<input required placeholder=${rowTable.children[i].innerHTML} type="text" class="modal__input">`;
          // console.log(rowTablee[i]);
        }

      }
      openModal(modal);
      const btnSave = document.querySelector('.btn');
      btnSave.addEventListener('click', () => {
        const inputs=document.querySelectorAll('.modal__input');
        inputs.forEach((input,index)=>{
          if (input.value) {
              const fieldName=result.columns[index];
              // console.log(fieldName);
              const primaryKeys = {};
              rowTable.querySelectorAll('td[data-key]').forEach((td) => {
                const key = td.getAttribute('data-key');
                const value = td.innerText;
                primaryKeys[key] = value;
              });
              //  console.log(primaryKeys);
            const data={
              "table_name": `${result.name}`,
              "field_name": `${fieldName}`,
              "new_value": String(input.value),
              primary_keys: primaryKeys

            };
            editRow(data);
            // console.log(input.value);
            // console.log(rowTable);


          }

          // else{
          //   // console.log('пусто');
          // }
        })
        acceptChanges();


        modalContent.innerHTML = `<form action="#">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">Редактирование таблицы</div>
        <button class="btn btn_dark btn_min">Сохранить</button>
      </form>`;

        closeModal(modal);
        const timeoutCreate =createTable(result.name);
        setTimeout(timeoutCreate,2000);
        // createTable(result.name);
        //  showConfirmationModal(data, row);
      });
    });
  });
}

function functionalDelete(tableName,row) {
  const buttonsDelete = document.querySelectorAll('.delete');
  // console.log(buttonsDelete);
  buttonsDelete.forEach(buttonDelete => {
    buttonDelete.addEventListener('click', (e) => {
      // const row = e.target.parentElement.parentElement;
      const primaryKeys = {};
      console.log(row);
      row.querySelectorAll('td[data-key]').forEach((td) => {
        const key = td.getAttribute('data-key');
        const value = td.innerText;
        primaryKeys[key] = value;
      });
       console.log(primaryKeys);
      const data = {
        table_name: tableName,
        primary_keys: primaryKeys
      };
      // row.remove();
      console.log(data);
      showConfirmationModal(data, row);
    });
  });
}

function showConfirmationModal(data, row) {
  const modal = document.querySelector('.confirmation-modal');
  openModal(modal);

  const confirmButton = modal.querySelector('.btn_confirm');
  const cancelButton = modal.querySelector('.btn_cancel');

  confirmButton.onclick = () => {
    deleteRow(data).then(() => {
      acceptChanges().then(() => {
        row.remove();
        closeModal(modal);
      }).catch(error => {
        console.error("Error accepting changes:", error);
        closeModal(modal);
      });
    }).catch(error => {
      console.error("Error deleting row:", error);
      closeModal(modal);
    });
  };

  cancelButton.onclick = () => {
    rollbackChanges().then(() => {
      closeModal(modal);
    }).catch(error => {
      console.error("Error rolling back changes:", error);
      closeModal(modal);
    });
  };
}
async function editRow(data) {
  try {
    const response = await fetch('http://185.192.247.60:7130/Database/UpdateRow', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Row edit successfully:", result);
    return result;
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.error("Error insert row:", error);
  }
}
async function acceptChanges() {
  try {
    const response = await fetch("http://185.192.247.60:7130/Database/AcceptChanges", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const result = await response.json();
    console.log("Changes accepted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error accepting changes:", error);
  }
}

async function rollbackChanges() {
  try {
    const response = await fetch("http://185.192.247.60:7130/Database/RollbackChanges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const result = await response.json();
    console.log("Changes rolled back successfully:", result);
    return result;
  } catch (error) {
    console.error("Error rolling back changes:", error);
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
    const response = await fetch("http://185.192.247.60:7130/Database/TableInfo", {
      method: "POST",
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
const displayLoading = () => {
  loaderContainer.style.display = 'block';
};

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

const hideLoading = () => {
  loaderContainer.style.display = 'none';
};

let url = 'http://185.192.247.60:7130/Database/DBTables';
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
      elem.addEventListener('click', () => { createTable(element) });
      document.querySelector('.container__nav').append(elem);
    });
  });