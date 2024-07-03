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
  document.body.style.overflow = '';
}

function openModal(modal) {
  modal.classList.add('show');
  modal.classList.remove('hide');
  document.body.style.overflow = 'hidden';
}

function checkVoidTable(result,tableName, totalRowsCount) {

  if (totalRowsCount == 0) {
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
  const containerContent=document.querySelector('.container_content');
  containerContent.innerHTML='';
  rows.forEach((element, rowIndex) => {
    if (rowIndex === 0) {
      const name = document.createElement('div');
      name.classList = 'table-name';
      name.innerHTML = `${list_Tables[tableName]}`;
      console.log(`${name}`);
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
      trs.forEach((tr,index)=>{

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
        console.log(trs.length);
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
  buttons.innerHTML=`<button class="insert">добавить</button>`
  buttons.innerHTML += `<button class="edit">редактировать</button>`;
  buttons.innerHTML += `<button class="copy">копировать строчку в конец</button>`;
  buttons.innerHTML += `<button class="delete">удалить</button>`;
  console.log(table.parentElement);
  table.parentElement.append(buttons);
  // console.log(result.rows[0].length);

    const btnEdit=document.querySelector('.edit');
    const btnCopy=document.querySelector('.copy');
    const btnDelete=document.querySelector('.delete');
    if (!result.total_rows_count) {
      btnEdit.setAttribute('disabled', '');
      btnCopy.setAttribute('disabled', '');
      btnDelete.setAttribute('disabled', '');
    }

    functionalDelete(result.name,tableRow);
    functionalBtnInsert(result);
    functionalBtnCopyEnd(result,tableRow);
    if (result.rows) {
      console.log(result);
      const rowsLenght=result.rows[0].length;
      functionalEdit(rowsLenght,tableRow,result);
    }
}


function functionalBtnInsert(table){
  const buttonInsert=document.querySelector('.insert');
  const rows=document.querySelectorAll('tr');
  buttonInsert.addEventListener('click',()=>{
    const primaryKeys = {};
    // console.log(rows);
    rows.forEach(row=>{
      row.querySelectorAll('td[data-key]').forEach((td) => {
        const key = td.getAttribute('data-key');
        const value = td.innerText;
        primaryKeys[key] = value;
        primaryKeys[key]++;
      });

    });
    // console.log(primaryKeys);
    const modal = document.querySelector('.confirmation-modal-add');
    const modalContent = document.querySelector('.confirmation-modal__content-add');
    for (let i = 1; i < table.columns_count; i++) {

       const placeholder=String(table.columns[i].column_description);
       const dataColumn=document.createElement('div');
       const namecolumn=document.createElement('div');
       namecolumn.classList.add('name-column');
       namecolumn.innerText=placeholder;
       dataColumn.classList.add('data-column');
       dataColumn.append(namecolumn);
       console.log(placeholder);
       const modalInput=document.createElement('input');
       modalInput.placeholder=placeholder;
       modalInput.type='text';
       modalInput.classList.add('modal__input');
       dataColumn.append(modalInput);
       modalContent.append(dataColumn);
      // modalContent.innerHTML+=`<input required placeholder=${placeholder} type="text" class="modal__input">`;
    }
    openModal(modal);
    const btnAdd=document.querySelector('.btn_confirm-add');
    btnAdd.addEventListener('click',()=>{
      const inputs=document.querySelectorAll('.modal__input');
      const arrData=[];
      const columns=[];
      // arrData.push(String(primaryKeys.ID));
        inputs.forEach((input,index)=>{
          if(input.value){
            arrData.push(input.value);
          }
        });

        for (let index = 1; index < table.columns_count; index++) {
          const dataColumns={};
          // dataColumns.column_name=table.columns[index].column_name;
          dataColumns.column_description=table.columns[index].column_description;
          //  dataColumns.is_primary_key=(table.columns[index].is_primary_key);
          //  dataColumns.is_editable=(table.columns[index].is_editable);
          console.log((table.columns[index].name));
          columns.push(String(table.columns[index].column_name));
        }

        const data={
          "table_name": `${table.name}`,
          "columns":columns,
          "values":arrData
        };
        console.log(columns);
        insertRow(data);
        acceptChanges({
            message: "Изменения применены"
        });
        modalContent.innerHTML=`<div class="confirmation-modal__title-add">Добавление строки</div>
        <div class="confirmation-modal__buttons-add">
          <button class="btn btn_confirm-add">Соханить</button>
          <button class="btn btn_cancel">Отмена</button>
        </div>`;
        closeModal(modal);
        const timeoutCreate =createTable(table.name);
        setTimeout(timeoutCreate,4000);
    });
    const cancelButton = modal.querySelector('.btn_cancel');
    cancelButton.onclick = () => {
      rollbackChanges({
        message: "Изменения отменены"
      }).then(() => {
        closeModal(modal);
        modalContent.innerHTML=`<div class="confirmation-modal__title-add">Добавление строки</div>
        <div class="confirmation-modal__buttons-add">
          <button class="btn btn_confirm-add">Соханить</button>
          <button class="btn btn_cancel">Отмена</button>
        </div>`;
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
      for (let i = 0; i < totalRowsCount; i++) {
        const placeholder=String(rowTable.children[i].innerHTML);
        const nameColumns=String(result.columns[i].column_description);
        console.log(placeholder);
        console.log(nameColumns);
        const dataColumn=document.createElement('div');
        const namecolumn=document.createElement('div');
        namecolumn.classList.add('name-column');
        namecolumn.innerText=nameColumns;
        dataColumn.classList.add('data-column');
        dataColumn.append(namecolumn);
        const modalInput=document.createElement('input');
        modalInput.placeholder=placeholder;
        modalInput.type='text';
        modalInput.classList.add('modal__input');
        dataColumn.append(modalInput);
        modalContent.append(dataColumn);
      }
      openModal(modal);
      const btnClose=document.querySelector('.modal__close');
      btnClose.addEventListener('click',()=>{
        closeModal(modal);
        modalContent.innerHTML = `<form action="#">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">Редактирование таблицы</div>
        <button class="btn btn_dark btn_min">Сохранить</button>
      </form>`;
      })
      const btnSave = document.querySelector('.btn');
      btnSave.addEventListener('click', () => {
        const inputs=document.querySelectorAll('.modal__input');
        inputs.forEach((input,index)=>{
          if (input.value) {
              const fieldName=result.columns[index].column_name;
              // console.log(fieldName);
              const primaryKeys = {};
              rowTable.querySelectorAll('td[data-key]').forEach((td) => {
                const key = td.getAttribute('data-key');
                const value = td.innerText;
                primaryKeys[key] = value;
              });
              const updateValues={};
              updateValues[fieldName]=String(input.value);
              //  console.log(primaryKeys);
            const data={
              "table_name": `${result.name}`,
              "updated_values":updateValues,
              primary_keys: primaryKeys

            };
            editRow(data);
          }
        })
        acceptChanges({
          message: "Изменения применены"
        });

        modalContent.innerHTML = `<form action="#">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">Редактирование таблицы</div>
        <button class="btn btn_dark btn_min">Сохранить</button>
        </form>`;

        closeModal(modal);
        const timeoutCreate =createTable(result.name);
        setTimeout(timeoutCreate,4000);
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
      // console.log(row);
      row.querySelectorAll('td[data-key]').forEach((td) => {
        const key = td.getAttribute('data-key');
        const value = td.innerText;
        primaryKeys[key] = value;
      });
      //  console.log(row);
      const data = {
        table_name: tableName,
        primary_keys: primaryKeys
      };
      // row.remove();
      // console.log(data);
      showConfirmationModal(data, row);
    });
  });
}

function functionalBtnCopyEnd(table,row){
  const modal=document.querySelector('.confirmation-modal-copy');
  const modalContent = document.querySelector('.confirmation-modal__content-copy');
  const buttonCopy=document.querySelector('.copy');
  const rows=document.querySelectorAll('tr');
  const primaryKeys = {};

  buttonCopy.addEventListener('click',()=>{
    for (let i = 1; i < table.rows[0].length; i++) {
      if (i==1) {
        modalContent.innerHTML+=`<div class="ID-Copy-Row">Копируется строка ${row.children[0].innerHTML}</div>`
      }

      const placeholder=String(table.columns[i].column_description);
      const dataColumn=document.createElement('div');
      const namecolumn=document.createElement('div');
      namecolumn.classList.add('name-column');
      namecolumn.innerText=placeholder;
      dataColumn.classList.add('data-column');
      dataColumn.append(namecolumn);

      console.log(modalContent);
      const input=document.createElement('input');
      input.value=row.children[i].innerHTML;
      input.classList.add('modal__input');
      dataColumn.append(input);
      modalContent.append(dataColumn);
    }
    openModal(modal);
    const btnClose=document.querySelector('.btn_cancel-copy');
       btnClose.addEventListener('click',()=>{
          closeModal(modal);
          modalContent.innerHTML = `<div class="confirmation-modal__title-copy">Копирование строки</div>
             <div class="confirmation-modal__buttons-copy">
                <button class="btn btn_confirm-copy">Добавить</button>
                <button class="btn btn_cancel-copy">Отмена</button>
             </div>`;
       })
       const btnAddEnd=document.querySelector('.btn_confirm-copy');
       btnAddEnd.addEventListener('click',()=>{
          rows.forEach(row=>{
            row.querySelectorAll('td[data-key]').forEach((td) => {
              const key = td.getAttribute('data-key');
              const value = td.innerText;
              primaryKeys[key] = value;
              primaryKeys[key]++;
            });
          });
            const arrData=[];
            // arrData.push(String(primaryKeys.ID));
            const columns=[];
            for (let i = 1; i < row.cells.length; i++) {
              arrData.push(String(row.cells[i].innerHTML));
              columns.push(String(table.columns[i].column_name));
            }
            // console.log(table.columns);
            // console.log(arrData);

              const data={
                "table_name": `${table.name}`,
                "columns":columns,
                "values":arrData,
              };
              // console.log(data);
              insertRow(data);
              modalContent.innerHTML = `<div class="confirmation-modal__title-copy">Копирование строки в конец</div>
              <div class="confirmation-modal__buttons-copy">
                  <button class="btn btn_confirm-copy">Добавить</button>
                  <button class="btn btn_cancel-copy">Отмена</button>
              </div>`;
              closeModal(modal);
              // acceptChanges({
              //   message: "Изменения применены"
              // });
              const timeoutCreate =createTable(table.name);
              setTimeout(timeoutCreate,4000);
       })
  });
}

function showConfirmationModal(data, row) {
  const modal = document.querySelector('.confirmation-modal');
  openModal(modal);

  const confirmButton = modal.querySelector('.btn_confirm');
  const cancelButton = modal.querySelector('.btn_cancel');

  confirmButton.onclick = () => {
    deleteRow(data).then(() => {
      acceptChanges({
        message: "Изменения применены"
      }).then(() => {
        row.remove();
        closeModal(modal);
        createTable(data.table_name);
      }).catch(error => {
        // console.error("Error accepting changes:", error);
        closeModal(modal);
      });
    }).catch(error => {
      // console.error("Error deleting row:", error);
      closeModal(modal);
    });
  };

  cancelButton.onclick = () => {
    rollbackChanges({
      message: "Изменения отменены"
    }).then(() => {
      closeModal(modal);
    }).catch(error => {
      // console.error("Error rolling back changes:", error);
      closeModal(modal);
    });
  };
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
async function acceptChanges(data) {
  try {
    const response = await fetch("http://185.192.247.60:7130/Database/AcceptChanges", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

      },

      body: JSON.stringify(data)
    });
    const result = await response.json();
    // console.log("Changes accepted successfully:", result);
    // return result;
  }
  catch (error) {
    // console.error("Error accepting changes:", error);
  }
}

async function rollbackChanges(data) {
  try {
    const response = await fetch("http://185.192.247.60:7130/Database/RollbackChanges", {
      method: "GEt",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    // console.log("Changes rolled back successfully:", result);
    return result;
  } catch (error) {
    // console.error("Error rolling back changes:", error);
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
let isColorChanged = false;

document.addEventListener('DOMContentLoaded', function() {
  const navEl = document.querySelector('.container__nav__el');
});

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
      document.querySelector('.container__nav').append(elem);
    });
  });
