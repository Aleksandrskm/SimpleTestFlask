//класс для создания модальных окон 
export class Modal{
  /*получение параметров необходимых для создания модального окна 
  modalParent  это html элемент в котторый  будет помещаться модальное окно
  typeModal это тип модального окна который будет создаваться 
  colInputs это количество инпутов которое должно быть в модальном окне
  columns это колонки с данными полученные с API  
  tableRow строка с которой будет вестись работа 
  funcRow функция которая будет использоваться для работы с таблицей
  table вся информация о таблице
  */ 
    constructor(modalParent,typeModal,colInputs,columns,tableRow,funcRow,table,rusName,tableName){
        this.modalParent=modalParent;
        this.typeModal=typeModal;
        this.colInputs=colInputs;
        this.columns=columns;
        this.tableRow=tableRow;
        this.funcRow=funcRow;
        this.table=table;
        this.rusName=rusName;
        this.tableName=tableName
    }
    // метод создания модельного окна где callback это функция для обновления страницы
    createModal(callback){
      console.log(this.tableRow)
      console.log(this.table)
        console.log(this.colInputs)
        console.log(this.columns)
      // создание модального окна по полученным параметрам
        const modal=document.createElement('div');
        const modalDialog=document.createElement('div');
        const modalContent=document.createElement('div');
        modal.classList.add('modal');
        modalDialog.classList.add('modal__dialog');
        modalContent.classList.add('modal__content');
        if (this.typeModal==='insert') {
          modalContent.innerHTML=` <div class="modal__title">Добавление новой строки в таблицу</div>`;  
        }
        else if (this.typeModal==='edit') {
          modalContent.innerHTML=` <div class="modal__title">Редактирование таблицы</div>`;  
        }
        else if (this.typeModal==='copy') {
          modalContent.innerHTML=` <div class="modal__title">Копирование строки в таблицу</div>`;  
        }
        else if (this.typeModal==='delete') {
          modalContent.innerHTML=` <div class="modal__title"> Удаление строки из таблицы</div>`;  
        }
        const Columns=document.createElement('div');
        Columns.classList.add('modalColumns');
        for (let i = 1; i < this.colInputs; i++) {
          const modalInput=document.createElement('input');
            const value=String(this.tableRow.children[i].innerHTML);
            const dataColumn=document.createElement('div');
            const nameColumn=document.createElement('div');
            nameColumn.classList.add('name-column');
            nameColumn.innerText=this.columns[i].description;
            dataColumn.classList.add('data-column');
            dataColumn.append(nameColumn);
            modalInput.type='text';
            modalInput.classList.add('modal__input');
            if (this.typeModal=='copy') {
              if (i==1) {
                modalContent.innerHTML+=` <div class="copy__row">Копируется строка ${this.tableRow.children[0].innerHTML}</div>`; 
              }
              modalInput.setAttribute('value',value);
            } 
            if (this.typeModal=='edit') {
              modalInput.placeholder=value;
            } 
            else{
              modalInput.placeholder=this.columns[i].description;
            }
           
            dataColumn.append(modalInput);
            Columns.append(dataColumn);
            if (i+1==this.colInputs) {
              modalContent.append(Columns);
            }
            
         }
        if (this.typeModal=='insert') {
          modalContent.innerHTML+=` 
          <div class='btnsModal'>
          <button class="btn modal__confirm btn_dark btn_min">Добавить</button>
          <button class="btn modal__close btn_dark btn_min">Отмена</button></div>`;   
        }
        else if (this.typeModal=='edit') {
          modalContent.innerHTML+=` 
          <div class='btnsModal'>
          <button class="btn modal__confirm btn_dark btn_min">Сохранить</button>
          <button class="btn modal__close btn_dark btn_min">Отмена</button></div>`;   
        }
        else if (this.typeModal=='copy') {
          modalContent.innerHTML+=` 
          <div class='btnsModal'>
          <button class="btn modal__confirm btn_dark btn_min">Копировать</button>
          <button class="btn modal__close btn_dark btn_min">Отмена</button></div>`;   
        }
        else if (this.typeModal=='delete') { 
          modalContent.innerHTML+=` <div class="copy__row">Удаляется строка ${this.tableRow.children[0].innerHTML}</div>`; 
          modalContent.innerHTML+=` 
          <div class='btnsModal'>
          <button class="btn modal__confirm btn_dark btn_min">Удалить</button>
          <button class="btn modal__close btn_dark btn_min">Отмена</button></div>`;   
        }
         const modalParent=document.querySelector('.column2_vi');
        
         modalDialog.append(modalContent);
         modal.append(modalDialog);
         modalParent.append(modal);
         // добавление прослушивателя событий кнопки потверждения
         const btnConfirm=document.querySelector('.modal__confirm');
         btnConfirm.addEventListener('click', () => {
          // проверка на тип модального окна и реализация функций 
            if (this.typeModal==='insert') {
            const primaryKeys = {};
            const rows=document.querySelectorAll('tr');
            rows.forEach(row=>{
              row.querySelectorAll('td[data-key]').forEach((td) => {
                const key = td.getAttribute('data-key');
                const value = td.innerText;
                primaryKeys[key] = value;
                primaryKeys[key]++;
              });
            });
           
            const inputs=document.querySelectorAll('.modal__input');
            const arrData=[];
            const columns=[];
            const indexRows=[];
              inputs.forEach((input,index)=>{
                if(input.value){
                  arrData.push(input.value);
                  console.log(arrData);
                  indexRows.push(index+1)
                }
              });
              for (let index = 1; index < this.table.columns_info.length; index++) {
                const tableRow={};
                tableRow.description=this.table.columns_info[index].description;
                console.log((this.table.columns_info[index]));
                indexRows.forEach(inedexRow=>{
                  if (inedexRow==index) {
                    columns.push(String(this.table.columns_info[index].name));}}
                  )
              }
              const bodyReq={};
              const data={}
              for (let i=0;i<columns.length;i++){
                  data[columns[i]] = arrData[i];
              }
              // const data={
              //   "table_name": `${this.table.name}`,
              //   "columns":columns,
              //   "values":arrData
              // };
                console.log(data)
                bodyReq['row']=data

              this.funcRow(bodyReq,this.tableName).then( ()=>{modal.remove();
                
                callback(this.tableName,this.rusName);}
              );
             
            }
            else if (this.typeModal==='copy') {
            const rows=document.querySelectorAll('tr');
            const primaryKeys = {};
            rows.forEach(row=>{
              row.querySelectorAll('td[data-key]').forEach((td) => {
                const key = td.getAttribute('data-key');
                const value = td.innerText;
                primaryKeys[key] = value;
                primaryKeys[key]++;
              });
            });
          const inputs=document.querySelectorAll('.modal__input');
           const arrData=[];
            const columns=[];
            const indexRows=[];
              inputs.forEach((input,index)=>{
                if(input.value){
                  arrData.push(String(input.value));
                  console.log(arrData);
                  indexRows.push(index+1)
                }
              });
            
            for (let i = 1; i < this.tableRow.cells.length; i++) {
                // arrData.push(String(this.tableRow.cells[i].innerHTML));
                // columns.push(String(this.table.columns[i].column_name));
                 indexRows.forEach(inedexRow=>{
                  if (inedexRow===i) {
                    columns.push(String(this.table.columns_info[i].name));}}
                  )
            }
            // const data={
            //   "table_name": `${this.table.name}`,
            //   "columns":columns,
            //   "values":arrData,
            // };
                const bodyReq={};
                const data={}
                for (let i=0;i<columns.length;i++){
                    data[columns[i]] = arrData[i];
                }
                // const data={
                //   "table_name": `${this.table.name}`,
                //   "columns":columns,
                //   "values":arrData
                // };
                console.log(data)
                bodyReq['row']=data
            this.funcRow(bodyReq,this.tableName).then( ()=>{modal.remove();
              callback(this.tableName,this.rusName);}
            );
            }
            else if (this.typeModal==='edit') {
            const inputs=document.querySelectorAll('.modal__input');
            inputs.forEach((input,index)=>{
              if (input.value) {
                  const fieldName=this.table.columns_info[++index].name;
                  const primaryKeys = {};
                  this.tableRow.querySelectorAll('td[data-key]').forEach((td) => {
                    const key = td.getAttribute('data-key');
                    const value = td.innerText;
                    primaryKeys[key] = value;
                  });
                  const updateValues={};
                  updateValues[fieldName]=String(input.value);
                const data={

                  "updates":updateValues,
                  where: {column:Object.keys(primaryKeys)[0],operator:"=",value:primaryKeys[Object.keys(primaryKeys)[0]]},
    
                };
                console.log(data)
                this.funcRow(data,this.tableName).then(()=>{
                  callback(this.tableName,this.rusName);
                });
              }
            });
            modal.remove(); 
             
            }
            else if (this.typeModal==='delete') {
              const primaryKeys = {};
              this.tableRow.querySelectorAll('td[data-key]').forEach((td) => {
                const key = td.getAttribute('data-key');
                const value = td.innerText;
                primaryKeys[key] = value;
              });
              // const data = {
              //   table_name: `${this.table.name}`,
              //   primary_keys: primaryKeys
              // };
                const data={
                    where: {column:Object.keys(primaryKeys)[0],operator:"=",value:primaryKeys[Object.keys(primaryKeys)[0]]},
                };
              this.funcRow(data,this.tableName).then( ()=>{
                callback(this.tableName,this.rusName);
                modal.remove();}
              );
            } 
          });
           // добавление прослушивателя событий кнопки отмены
          const btnClose=document.querySelector('.modal__close');
          btnClose.addEventListener('click',()=>{  
            modal.remove(); 
          });
    }
}