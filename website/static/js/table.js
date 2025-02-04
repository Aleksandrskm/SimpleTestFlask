import {editRow,deleteRow,insertRow,postJSON,getRowsTable} from './db.js';
import { Modal } from "./Modal.js";
export function table(url){
      // функция  в которую  передается название выбранной таблицы и на его основе создается таблица
      function createTable(engName,rusName) {
        let data = { name: engName };
        postJSON(data).then(result => {
          if (result===undefined) {
            document.querySelector('.container_content').innerHTML+=`<h3>В данный момент таблица недоступна</h3>`
          }
          else{  
            generateTable(result,rusName);
          }
        });
      
        document.querySelector('.container_content').innerHTML = '';
      }
      // функция которая получает названия таблиц из API и генерирует их на странице
      function getNameTables(url){
        let response = fetch(url)
        .then(response => response.json())
        .then(jsonRsponse => {
          for (const key in jsonRsponse) {
            const elemSection = document.createElement('div');
            const dateTablesName=jsonRsponse[key];
            const nameSection=document.createElement('span');
            nameSection.classList.add('menu-section');
            nameSection.innerText=key;
            elemSection.append(nameSection);
            for(const field in dateTablesName)
            {
              // console.log(dateTablesName[field])
              const nameTable=document.createElement('div');
              nameTable.classList.add('container__nav__el');
              nameTable.append(dateTablesName[field]) ;
              nameTable.setAttribute("id", field);
              elemSection.append(nameTable);
            }
            document.querySelector('.container__nav').append(elemSection);
            // console.log(elemSection)
                elemSection.addEventListener('click', (e) => {
                  const trsNavMenu=document.querySelectorAll('.container__nav__el');
                  trsNavMenu.forEach((trMenu)=>{
                    if (trMenu==e.target) {
                      trMenu.style='background-color: #B5B8B1';
                      console.log(e.target.id,e.target.innerHTML);
                      createTable(e.target.id,e.target.innerHTML);
                    }
                    else{
                      if (e.target.id) {
                        trMenu.style='';
                      }
                    }
                  }) 
                });
          }
        });
      }
      /* функция  которая проверяет  пустая таблица или нет и если она пустая строит её структуру  */
      function checkVoidTable(result,tableName, totalRowsCount,rusName) {
        if (totalRowsCount == 0) {
          const containerContent=document.querySelector('div .container_content');
          containerContent.innerHTML='';
          const name = document.createElement('div');
          const tableWrapper = document.createElement('div');
          const tableScroll = document.createElement('div');
          const tableHead = document.createElement('thead');
          const tableBody = document.createElement('tbody');
          tableWrapper.classList.add('table-wrapper');
          tableScroll.classList.add('table-scroll');
          name.classList = 'table-name';
          name.innerHTML = `${rusName}`;
          containerContent.append(name);
          const tr = document.createElement('table');
          tr.classList.add('mainTable');
          result.columns.forEach(column=>{
            const th =document.createElement('th');
            th.innerHTML=`${column.column_description}`;
            tableHead.append(th);
          })
          tr.append(tableHead);
          tableScroll.append(tr);
          tableWrapper.append(tableScroll);
          containerContent.append(tableWrapper);
          createButtonsTable(tableScroll,result,tableHead);
        }
      }
      /* функция  в которую  передается вся информация о таблице 
      строки  в таблице  название выбранной таблицы  на  основе этих параметров строится структура таблицы*/
      function createTableContent(result,rows,tableName,rusName) {
        const containerContent=document.querySelector('.container_content');
        containerContent.innerHTML='';
        const tableBody = document.createElement('tbody');
        rows.forEach((element, rowIndex) => {
          if (rowIndex === 0) {
            const name = document.createElement('div');
            const tableWrapper = document.createElement('div');
            const tableScroll = document.createElement('div');
            const tableHead = document.createElement('thead');
            tableWrapper.classList.add('table-wrapper');
            tableScroll.classList.add('table-scroll');
            name.classList = 'table-name';
            name.innerHTML = `${rusName}`;
            document.querySelector('.container_content').append(name);
            const table=document.createElement('table');
            table.classList.add('mainTable');
            document.querySelector('.container_content').append(table);
            const tableRow = document.createElement('tr');
            result.columns.forEach(column=>{
              const th =document.createElement('th');
              th.scope="col";
              th.innerHTML=`${column.column_description}`;
              tableRow.append(th);
            });
            tableHead.append(tableRow);
            table.append(tableHead);
            tableScroll.append(table)
            tableWrapper.append(tableScroll);
            containerContent.append(tableWrapper);
          }
          const tableRow = document.createElement('tr');
          // console.log(element);
          let rowsIndex=0;
          for(let field in element) {
            // console.log(element[field])
            const cell = document.createElement('td');
            cell.innerText = element[field];
            if (rowsIndex === 0) {
              cell.setAttribute('data-key', 'ID');
              ++rowsIndex;
            }
            tableRow.appendChild(cell);
          };
          const table=document.querySelector('table');
          const tableScroll = document.querySelector('.table-scroll');
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
             createButtonsTable(tableScroll,result,e.target.parentElement,rusName);
          });
          tableBody.append(tableRow);
          table.append(tableBody);
          if (result.columns_count<=21)
            {
              createButtonsTable(tableScroll,result,tableRow,rusName);
            } 
          // console.log(result.columns_count);
        });
        if (result.columns_count<21){
          const trs=document.querySelectorAll('table tr');
        trs.forEach((tr,index)=>{
        if (index==trs.length-1) { 
        tr.style='background-color: #B5B8B1';
        }
      });
        }
        if (result.columns_count>20) {
          getRowsTable(tableName,20,result.total_rows_count).then(response=>{
          response.forEach(row=>{
            // console.log(row)
            const tableRow = document.createElement('tr');
            let rowsIndex=0;
            for(let field in row) {
              // console.log(element[field])
              const cell = document.createElement('td');
              
              cell.innerText = row[field];
              if (rowsIndex === 0) {
                cell.setAttribute('data-key', 'ID');
                ++rowsIndex;
              }
              tableRow.appendChild(cell);
            };
            const tableBody=document.querySelector('tbody');
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
              createButtonsTable(tableScroll,result,e.target.parentElement,rusName); 
            });
            
            tableBody.append(tableRow);
            const tableScroll = document.querySelector('.table-scroll');
            createButtonsTable(tableScroll,result,tableRow,rusName);
          })  
          const trs=document.querySelectorAll('table tr');
            trs.forEach((tr,index)=>{
              if (index==trs.length-1) {
              tr.style='background-color: #B5B8B1';
              }
            });
          });
        }
      }
      /* функция  которая   создает таблицу на сайте  */
      function generateTable(result,rusName) {
        if (result.total_rows_count==0) {
          checkVoidTable(result,result.name, result.total_rows_count,rusName);
        }
        else {
          createTableContent(result,result.rows, result.name,rusName);
        }
      }
      /* функция  которая  создает  кнопки для работы с  таблицей на сайте  */
      function createButtonsTable(table,result,tableRow,rusName) {
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
        buttons.innerHTML += `<button class="maps">Показать карту</button>`;
        table.parentElement.append(buttons);
        // console.log(result.rows[0].length);
        const btnInsert=document.querySelector('.insert');
        const btnEdit=document.querySelector('.edit');
        const btnCopy=document.querySelector('.copy');
        const btnDelete=document.querySelector('.delete');
        const btmMap=document.querySelector('.maps');
        btmMap.setAttribute('disabled', '');
          if (!result.total_rows_count) {
            btnEdit.setAttribute('disabled', '');
            btnCopy.setAttribute('disabled', '');
            btnDelete.setAttribute('disabled', '');
            btmMap.setAttribute('disabled', '');
          }
        const modalParent=document.querySelector('.container_content');
        const modalDelete= new Modal(modalParent,'delete',0,result.columns,tableRow,deleteRow,result,rusName);
        const modalInser= new Modal(modalParent,'insert',result.columns_count,result.columns,tableRow,insertRow,result,rusName);
        const modalCopy= new Modal(modalParent,'copy',result.columns_count,result.columns,tableRow,insertRow,result,rusName);
        const modalEdit= new Modal(modalParent,'edit',result.columns_count,result.columns,tableRow,editRow,result,rusName);
        btnDelete.addEventListener('click',()=>{
          modalDelete.createModal(createTable)});
        btnCopy.addEventListener('click',()=>{
          modalCopy.createModal(createTable)});
        btnEdit.addEventListener('click',()=>{
          modalEdit.createModal(createTable)});
        btnInsert.addEventListener('click',()=>{
          modalInser.createModal(createTable);
        });
      }
      getNameTables(url);
}
