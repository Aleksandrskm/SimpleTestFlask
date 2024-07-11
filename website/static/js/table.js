import {editRow,deleteRow,insertRow,postJSON} from './db.js';
import { Modal } from "./Modal.js";
export function table(url){
      // функция  в которую  передается название выбранной таблицы и на его основе создается таблица
      function createTable(element) {
        let data = { name: element };
        postJSON(data).then(result => {
          generateTable(result);
        });
      
        document.querySelector('.container_content').innerHTML = '';
      }
      // функция которая получает названия таблиц из API и генерирует их на странице
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
      /* функция  которая проверяет  пустая таблица или нет и если она пустая строит её структуру  */
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
      /* функция  в которую  передается вся информация о таблице 
      строки  в таблице  название выбранной таблицы  на  основе этих параметров строится структура таблицы таблица*/
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
      /* функция  которая   создает таблицу на сайте  */
      function generateTable(result) {
        if (result.total_rows_count==0) {
          checkVoidTable(result,result.name, result.total_rows_count);
        }
        else {
          createTableContent(result,result.rows, result.name);
        }
      }
      /* функция  которая  создает  кнопки для работы с  таблицей на сайте  */
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
          modalDelete.createModal(createTable)});
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
      
      getNameTables(url);
}
