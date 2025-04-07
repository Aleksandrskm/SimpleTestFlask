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
           const kaElems=document.querySelectorAll('.ka-element');
           kaElems.forEach((zn) => {
            zn.addEventListener('click',(e)=>{
                const trs=document.querySelectorAll('.KA-Table tbody tr');
              
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
    function clearCanvas() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle(500,500,312.5,'blue');
    }
    function createBeamTable(idKa){
        getRowsTable('KA_BEAM',0,99999).then(beams=>{
          console.log(beams.length)
          if (beams.length!=0) {
            const data = { name: 'KA_BEAM'};
            const rusName={};
        //     postJSON(data).then(tableInfo=>{
        //         const tr = document.createElement('tr');
        //         for( let i=0;i<tableInfo.columns.length;i++){
        //             // console.log(tableInfo.columns[i].column_description)
                   
        //             const th=document.createElement('th');
        //             if (document.getElementById('beam_per').checked) {
        //                 if (tableInfo.columns[i].column_description=='Идентификатор' || tableInfo.columns[i].column_description=='Азимут луча, градус' 
        //                     ||  tableInfo.columns[i].column_description=='Азимут луча, градус' ) {
        //                     console.log()
        //                     rusName[tableInfo.columns[i].column_name]=tableInfo.columns[i].column_description;
        //                     th.innerHTML+=tableInfo.columns[i].column_description;
                            
        //                     tr.append(th);
        //                 }
        //             }
                   
                 
                   
                   
                   
                   
        //         }
        //         tr.append(`<th>Радиус,м</th>`)
        //         document.querySelector('.beams-Table thead').append(tr); 
        //       console.log(tableInfo)
        //   });
        }
          else{
            console.log(beams)
            const tr = document.createElement('tr');
           
            const ths=['Лучи','Азимут от подсп.точки','Расстояние от подсп.точки','Радиус,м']
            for(let i=0;i<4;i++){
                const th=document.createElement('th')
                th.innerHTML=ths[i]
                tr.append(th)
            }
           
           
            document.querySelector('.beams-Table thead').append(tr); 
            let az=0;
            let distance=800000;
            const dis=900000;
            for (let i = 0; i < 16; i++) {
                
                const trBody=document.createElement('tr')
                let count=i+1;
                trBody.classList.add('beams-element');
               
                trBody.innerHTML+=`<td>${count}</td>`;
                trBody.innerHTML+=`<td>${az}</td>`;
                trBody.innerHTML+=`<td>${distance}</td>`;
                trBody.innerHTML+=`<td>${900000}</td>`;
                document.querySelector('.beams-Table tbody').append(trBody); 
                az+=30;
                distance-=100000
                if (count%4==0) {
                    az=0;
                    distance=dis-distance;
                }
            }
          }
        document.querySelectorAll('.beams-element').forEach(beam=>{
            beam.addEventListener('click',(e)=>{
                const trs=document.querySelectorAll('.beams-Table tbody tr');
              
                trs.forEach((tr)=>{
                    if (tr==e.target.parentElement) {
                    clearCanvas();
                    console.log(tr.children[1].innerHTML)
                    //   tr.style='background-color: #B5B8B1';
                    tr.classList.add('selected');
                    let centerX=0,centerY=0,radius=(tr.children[3].innerHTML/1000)*0.125;
                    console.log(tr.children[1].innerHTML)
                    centerX=tr.children[2].innerHTML/1000+radius*Math.sin(tr.children[1].innerHTML* (Math.PI/180));
                    centerY=tr.children[2].innerHTML/1000+radius*Math.cos(tr.children[1].innerHTML* (Math.PI/180));
                    console.log(centerX,centerY,radius)
                    drawCircle(centerX,centerY,radius,'black')
                    

                
                    }
                    else{
                        tr.classList.remove('selected');
                    }
                  })
                
            })
           
        })
        document.getElementById('view-beams').addEventListener('click',()=>{
            clearCanvas();
            const trs=document.querySelectorAll('.beams-Table tbody tr');
              
            trs.forEach((tr)=>{
                
                console.log(tr.children[1].innerHTML)

                
                let centerX=0,centerY=0,radius=(tr.children[3].innerHTML/1000)*0.125;
                console.log(tr.children[1].innerHTML)
                centerX=tr.children[2].innerHTML/1000+radius*Math.sin(tr.children[1].innerHTML* (Math.PI/180));
                centerY=tr.children[2].innerHTML/1000+radius*Math.cos(tr.children[1].innerHTML* (Math.PI/180));
                console.log(centerX,centerY,radius)
                drawCircle(centerX,centerY,radius,'black')
                

            
                
               
                   
               
              })
        })
          
         
          
           
          
            // leftContent.innerHTML+=`${KA[0].SHIROTA_LN}`
            // console.log(leftContent,KA[0])
        });
    }
    function drawCircle(centerX,centerY,radius,color) {
        const canvas = document.getElementById("canvas");
       
    const ctx = canvas.getContext('2d');


    ctx.beginPath();

    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    

    ctx.strokeStyle = color; 
    ctx.stroke();
      }
   
    createKATable();
    createBeamTable();
    drawCircle(500,500,312.5,'blue');
})
