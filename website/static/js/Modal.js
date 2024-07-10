export class Modal{
    constructor(modalParent,typeInput,colInputs,columName,dataColumns,funcRow,result){
        this.modalParent=modalParent;
        this.typeInput=typeInput;
        this.colInputs=colInputs;
        this.columName=columName;
        this.dataColumns=dataColumns;
        this.funcRow=funcRow;
        this.result=result;
    } 
    createModal(callback){
        const modal=document.createElement('div');
        const modalDialog=document.createElement('div');
        const modalContent=document.createElement('div');
        modal.classList.add('modal');
        modalDialog.classList.add('modal__dialog');
        modalContent.classList.add('modal__content');
        console.log(this);
        modalContent.innerHTML=` <div class="modal__title">${this.typeInput} таблицы</div>`;  
        for (let i = 1; i < this.colInputs; i++) {
          const modalInput=document.createElement('input');
            const value=String(this.dataColumns.children[i].innerHTML);
            console.log(value);
            const dataColumn=document.createElement('div');
            const nameColumn=document.createElement('div');
            nameColumn.classList.add('name-column');
            nameColumn.innerText=this.columName[i].column_description;
            dataColumn.classList.add('data-column');
            dataColumn.append(nameColumn);
            modalInput.type='text';
            modalInput.classList.add('modal__input');
            if (this.typeInput=='copy') {
              modalInput.setAttribute('value',value);
            } 
            modalInput.placeholder=this.columName[i].column_description;
            dataColumn.append(modalInput);
            modalContent.append(dataColumn); 
         }
         
         modalContent.innerHTML+=` 
         <button class="btn modal__confirm btn_dark btn_min">${this.typeInput}</button>
         <button class="btn modal__close btn_dark btn_min">Отмена</button>`; 
         const modalParent=document.querySelector('.column2_vi');
         modal.append(modalContent);
         modalParent.append(modal);
         const btnConfirm=document.querySelector('.modal__confirm');
         btnConfirm.addEventListener('click', () => {
            if (this.typeInput=='insert') {
            const primaryKeys = {};
            const rows=document.querySelectorAll('tr');
            // console.log(rows);
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
            // arrData.push(String(primaryKeys.ID));
              inputs.forEach((input,index)=>{
                if(input.value){
                  arrData.push(input.value);
                  console.log(arrData);
                }
              });
              
              for (let index = 1; index < this.result.columns_count; index++) {
                const dataColumns={};
                // dataColumns.column_name=table.columns[index].column_name;
                dataColumns.column_description=this.result.columns[index].column_description;
                //  dataColumns.is_primary_key=(table.columns[index].is_primary_key);
                //  dataColumns.is_editable=(table.columns[index].is_editable);
                console.log((this.result.columns[index].column_name));
                columns.push(String(this.result.columns[index].column_name));
              }
      
              const data={
                "table_name": `${this.result.name}`,
                "columns":columns,
                "values":arrData
              };
              console.log(columns);
              console.log(data);
              this.funcRow(data);
              modal.remove();
              callback(this.result.name);
             
            }
            else if (this.typeInput=='copy') {
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
            const arrData=[];
            const columns=[];
            for (let i = 1; i < this.dataColumns.cells.length; i++) {
                arrData.push(String(this.dataColumns.cells[i].innerHTML));
                columns.push(String(this.result.columns[i].column_name));
            }
            const data={
              "table_name": `${this.result.name}`,
              "columns":columns,
              "values":arrData,
            };   
            this.funcRow(data);
            modal.remove();
            callback(this.result.name); 
            }
             else if (this.typeInput=='edit') {
            const inputs=document.querySelectorAll('.modal__input');
            inputs.forEach((input,index)=>{
              if (input.value) {
                  const fieldName=this.result.columns[++index].column_name;
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
                const data={
                  "table_name": `${this.result.name}`,
                  "updated_values":updateValues,
                  primary_keys: primaryKeys
    
                };
                this.funcRow(data);
              
              }
             
            });
            
            modal.remove(); 
            callback(this.result.name); 
            }
            else if (this.typeInput=='delete') {
              const primaryKeys = {};
              this.dataColumns.querySelectorAll('td[data-key]').forEach((td) => {
                const key = td.getAttribute('data-key');
                const value = td.innerText;
                primaryKeys[key] = value;
              });
              const data = {
                table_name: `${this.result.name}`,
                primary_keys: primaryKeys
              };
            this.funcRow(data).then(this.dataColumns.remove());
            modal.remove();
            
            } 
          });
          const btnClose=document.querySelector('.modal__close');
          btnClose.addEventListener('click',()=>{  
            modal.remove(); 
            
          })
    }
}