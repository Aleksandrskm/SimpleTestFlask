import {editRow,deleteRow,insertRow,postJSON,getRowsTable} from './db.js';
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
          "RSS":'РСС',
          "RSS_ANT":'РСС Антены',
          "ISPR":'Исправность',
          "RSS_ARH":'РСС Архив',
          "RSS_ANT_ARH":'РСС Антены Архив',
          "RSS_KA":'РСС КА',
          "RSS_KA_VOZM":'РСС КА Возможные',
          "RSS_KA_KOLLIZ":'РСС КА Коллизии',
          "ERR":'Ошибки',
          "RSS_KA_ARH":'РСС КА Архив',
          "RSS_KA_VOZM_ARH":'РСС КА Возможные Архив',
          "RSS_KA_KOLLIZ_ARH":'РСС КА Коллизии Архив',
          "KA":'Данные по КА',
          "KA_ZONA_BEAM_ARH":'Зоны покрытия лучей КА архивные ',
          "KA_ZONA_BEAM":"Зоны покрытия лучей КА ",
          "KA_ZONA_ARH":'Зоны покрытия КА архивные ',
          "KA_ZONA":'Зоны покрытия КА ',
          "KA_SP_SOST":'Справочник состояний КА и лучей КА',
          "KA_SOST_ARH":"Состояние КА архивные ",
          "KA_SOST":'Справочник стран ',
          "KA_BEAM_ARH":'Лучи КА архивные ',
          "KA_BEAM":'Лучи КА ',
          "KA_ARH":'Учетные данные о КА архивные '
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
            "RSS":'РСС',
            "RSS_ANT":'РСС Антены',
            "ISPR":'Исправность',
            "RSS_ARH":'РСС Архив',
            "RSS_ANT_ARH":'РСС Антены Архив',
            "RSS_KA":'РСС КА',
            "RSS_KA_VOZM":'РСС КА Возможные',
            "RSS_KA_KOLLIZ":'РСС КА Коллизии',
            "ERR":'Ошибки',
            "RSS_KA_ARH":'РСС КА Архив',
            "RSS_KA_VOZM_ARH":'РСС КА Возможные Архив',
            "RSS_KA_KOLLIZ_ARH":'РСС КА Коллизии Архив',
            "KA":'Данные по КА',
            "KA_ZONA_BEAM_ARH":'Зоны покрытия лучей КА архивные ',
            "KA_ZONA_BEAM":"Зоны покрытия лучей КА ",
            "KA_ZONA_ARH":'Зоны покрытия КА архивные ',
            "KA_ZONA":'Зоны покрытия КА ',
            "KA_SP_SOST":'Справочник состояний КА и лучей КА',
            "KA_SOST_ARH":"Состояние КА архивные ",
            "KA_SOST":'Справочник стран ',
            "KA_BEAM_ARH":'Лучи КА архивные ',
            "KA_BEAM":'Лучи КА ',
            "KA_ARH":'Учетные данные о КА архивные '
        };
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
          name.innerHTML = `${list_Tables[tableName]}`;
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
      function createTableContent(result,rows,tableName) {
        const list_Tables = {
            "RSS":'РСС',
            "RSS_ANT":'РСС Антены',
            "ISPR":'Исправность',
            "RSS_ARH":'РСС Архив',
            "RSS_ANT_ARH":'РСС Антены Архив',
            "RSS_KA":'РСС КА',
            "RSS_KA_VOZM":'РСС КА Возможные',
            "RSS_KA_KOLLIZ":'РСС КА Коллизии',
            "ERR":'Ошибки',
            "RSS_KA_ARH":'РСС КА Архив',
            "RSS_KA_VOZM_ARH":'РСС КА Возможные Архив',
            "RSS_KA_KOLLIZ_ARH":'РСС КА Коллизии Архив',
            "KA":'Данные по КА',
            "KA_ZONA_BEAM_ARH":'Зоны покрытия лучей КА архивные ',
            "KA_ZONA_BEAM":"Зоны покрытия лучей КА ",
            "KA_ZONA_ARH":'Зоны покрытия КА архивные ',
            "KA_ZONA":'Зоны покрытия КА ',
            "KA_SP_SOST":'Справочник состояний КА и лучей КА',
            "KA_SOST_ARH":"Состояние КА архивные ",
            "KA_SOST":'Справочник стран ',
            "KA_BEAM_ARH":'Лучи КА архивные ',
            "KA_BEAM":'Лучи КА ',
            "KA_ARH":'Учетные данные о КА архивные '
        };
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
            name.innerHTML = `${list_Tables[tableName]}`;
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
          console.log(element);
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
             createButtonsTable(tableScroll,result,e.target.parentElement);
          });
          tableBody.append(tableRow);
          table.append(tableBody);
          
          if (result.columns_count<=21)
            {
              createButtonsTable(tableScroll,result,tableRow);
              
              
              
              
            } 
          console.log(result.columns_count);
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
          getRowsTable(tableName,20,result.columns_count-20).then(response=>{
          response.forEach(row=>{
            console.log(row)
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
              createButtonsTable(tableScroll,result,e.target.parentElement); 
            });
            
            tableBody.append(tableRow);
            const tableScroll = document.querySelector('.table-scroll');
            createButtonsTable(tableScroll,result,tableRow);
            
            // createButtonsTable(tableScroll,result,e.target.parentElement);
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
