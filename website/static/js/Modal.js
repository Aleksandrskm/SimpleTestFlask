class Modal{
    constructor(modalParent,typeInput,colInputs,columName,dataColumns,createTable,funcRow,result){
        this.modalParent=modalParent;
        this.typeInput=typeInput;
        this.colInputs=colInputs;
        this.columName=columName;
        this.dataColumns=dataColumns;
        this.createTable=createTable;
        this.funcRow=funcRow;
        this.result=result;
    }
    createModal(){
        const modal=document.createElement(div);
        const modalDialog=document.createElement(div);
        const modalContent=document.createElement(div);
        modal.classList.add('modal');
        modalDialog.classList.add('modal__dialog');
        modalContent.classList.add('modal__content');
        modalContent.innerHTML=` <div class="modal__title">${this.typeInput} таблицы</div>`;  
        for (let i = 0; i < this.colInputs; i++) {
           
            const value=String(this.dataColumns[i].innerHTML);
            const dataColumn=document.createElement('div');
            const nameColumn=document.createElement('div');
            nameColumn.classList.add('name-column');
            nameColumn.innerText=this.columName;
            dataColumn.classList.add('data-column');
            dataColumn.append(nameColumn);
            console.log(placeholder);
            const modalInput=document.createElement('input');
            modalInput.placeholder=this.columName;
            modalInput.value=value;
            modalInput.type='text';
            modalInput.classList.add('modal__input');
            
            dataColumn.append(modalInput);
            modalContent.append(dataColumn);
         }
         modalContent.innerHTML+=` 
         <button class="btn modal__confirm btn_dark btn_min">${this.typeInput}</button>
         <button class="btn modal__close btn_dark btn_min">Отмена</button>`; 
         this.modalParent.append(modalContent);
         const btnConfirm=document.querySelector('.modal__confirm');
         btnConfirm.addEventListener('click', () => {
            const inputs=document.querySelectorAll('.modal__input');
            inputs.forEach((input,index)=>{
              if (input.value) {
                  const fieldName=this.columName;
                  // console.log(fieldName);
                  const primaryKeys = {};
                  this.dataColumns.querySelectorAll('td[data-key]').forEach((td) => {
                    const key = td.getAttribute('data-key');
                    const value = td.innerText;
                    primaryKeys[key] = value;
                  });
                  const updateValues={};
                  updateValues[fieldName]=String(input.value);
                  //  console.log(primaryKeys);
                if (condition) {
                    const data={
                        "table_name": `${table.name}`,
                        "columns":columns,
                        "values":arrData,
                      };
                      this.funcRow(data);
                }
                else if(t){
                    const data={
                        "table_name": `${this.result.name}`,
                        "updated_values":updateValues,
                        primary_keys: primaryKeys
                      };
                      this.funcRow(data);
                }
                else if(!t){
                    const data={
                        "table_name": `${this.result.name}`,
                        "updated_values":updateValues,
                        primary_keys: primaryKeys
                      };
                      this.funcRow(data);
                }
                else if(!tt){
                    const data = {
                        table_name: tableName,
                        primary_keys: primaryKeys
                      };
                      this.funcRow(data);
                }
                  
               
              }
            })
            modalContent.remove();
            // closeModal(modal);
            this.createTable(this.result.name);
            
          });
          const btnClose=document.querySelector('.modal__close');
          btnClose.addEventListener('click',()=>{
            modalContent.remove();
          })
    }
}