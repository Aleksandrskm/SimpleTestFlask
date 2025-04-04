'use strict';
import {editRow,deleteRow,insertRow,postJSON,getRowsTable} from './db.js';
document.addEventListener('DOMContentLoaded',function(){
    function createKATable(){
        getRowsTable('KA',0,99999).then(KA=>{
          console.log(KA)
          const data = { name: 'KA' };
          const rusName={};
          postJSON(data).then(tableInfo=>{
            const tr = document.createElement('tr');
            for( let i=0;i<tableInfo.columns.length;i++){
                // console.log(tableInfo.columns[i].column_description)
               
                const th=document.createElement('th');
                if (tableInfo.columns[i].column_description=='Идентификатор' || tableInfo.columns[i].column_description=='Наименование КА' 
                    ||  tableInfo.columns[i].column_description=='Наименование КА рус.' || tableInfo.columns[i].column_description=='Номер орбиты') {
                    console.log()
                    rusName[tableInfo.columns[i].column_name]=tableInfo.columns[i].column_description;
                    th.innerHTML+=tableInfo.columns[i].column_description;
                    
                    tr.append(th);
                }
             
               
               
               
               
            }
            document.querySelector('.KA-Table thead').append(tr);
            console.log(Object.keys(rusName));
            for (let i = 0; i < KA.length; i++) {
                const elKA=document.createElement('tr');
               
                elKA.id=KA[i].ID;
                elKA.classList.add('ka-element');
                // elKA.innerHTML+=`<br>`;
            const keysRusName=(Object.keys(rusName));
                for(const key in KA[i])
                {
                    // console.log(rusName)
                    for(const name in rusName)
                    { 
                        //  console.log(name,key)
                        if (key==name) {
                           
                        elKA.innerHTML+=`<td>${(KA[i][key])}</td>`
                    }
        
                    }
                   
               
                }
            // elKA.innerHTML+=`<br>`
            document.querySelector('.KA-Table tbody').append(elKA)
            
           }
           const allDistricts=document.querySelectorAll('.ka-element');
           allDistricts.forEach((zn) => {
            zn.addEventListener('click',(e)=>{
                const trs=document.querySelectorAll('table tr');
                trs.forEach((tr)=>{
                    if (tr==e.target.parentElement) {
                    //   tr.style='background-color: #B5B8B1';
                    tr.classList.add('selected');
                   
                    document.getElementById('id-ka').innerHTML=`КА: ${tr.children[0].innerHTML}`;
                    document.getElementById('ka-name').innerHTML=`${tr.children[1].innerHTML}`;

                
                    }
                    else{
                        tr.classList.remove('selected');
                    }
                  })
                
            })
           
          });
         
         
    
        });
       
          
           
          
            // leftContent.innerHTML+=`${KA[0].SHIROTA_LN}`
            // console.log(leftContent,KA[0])
        });
    }
    createKATable();
})
