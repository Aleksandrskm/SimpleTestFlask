'use strict';
import {editRow,deleteRow,insertRow,postJSON,getRowsTable,changeQuery,selectQuery} from './db.js';
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
                if (tableInfo.columns[i].column_description==='Идентификатор' || tableInfo.columns[i].column_description==='Наименование КА'
                     || tableInfo.columns[i].column_description==='Номер орбиты') {
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
                        if (key===name) {
                           
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
                    if (tr===e.target.parentElement) {
                    //   tr.style='background-color: #B5B8B1';
                    tr.classList.add('selected');
                   
                    document.getElementById('id-ka').innerHTML=`КА: ${tr.children[0].innerHTML}`;
                    document.getElementById('ka-name').innerHTML=`${tr.children[1].innerHTML}`;
                    document.querySelector('.beams-Table').innerHTML=`<thead> </thead><tbody></tbody>`;
                    createBeamTable(tr.children[0].innerHTML)
                
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
        const selectedValue = document.querySelector('input[name="type_beams"]:checked').value;
        console.log(`${selectedValue}!!!!`);
        clearCanvas();
        getRowsTable(`${selectedValue}`,0,99999).then(beams=>{
          console.log(beams.length)
          if (beams.length ===0) {
              console.log('В данный момент нет данных')
          //   const data = { name: `${selectedValue}`};
          //   console.log(data)
          //   const rusName={};
          //   postJSON(data).then(tableInfo=>{
          //       const tr = document.createElement('tr');
          //       for( let i=0;i<tableInfo.columns.length;i++){
          //           // console.log(tableInfo.columns[i].column_description)
          //           const th=document.createElement('th');
          //           if (tableInfo.columns[i].column_description==='Идентификатор' || tableInfo.columns[i].column_description==='Азимут луча, градус'
          //                ||  tableInfo.columns[i].column_description==='Азимут луча, градус' ) {
          //
          //                   rusName[tableInfo.columns[i].column_name]=tableInfo.columns[i].column_description;
          //                   let decr_rus=tableInfo.columns[i].column_description;
          //                   switch (decr_rus) {
          //                       case 'Идентификатор':
          //                           decr_rus='Лучи'
          //                           break;
          //                       case 'Азимут луча, градус':
          //                           decr_rus='Азимут от подсп.точки'
          //                           break;
          //
          //                       default:
          //                           break;
          //                   }
          //                   th.innerHTML+=decr_rus;
          //
          //                   tr.append(th);
          //           }
          //       }
          //       let az=0;
          //       let distance=[850000,800000,1700000,600000,500000,1400000,600000,1500000,100000,1800000,700000,550000,630000,720000,480000,1350000];
          //       for (let i = 0; i < 16; i++) {
          //           const trBody=document.createElement('tr')
          //           let count=i+1;
          //           trBody.classList.add('beams-element');
          //           trBody.innerHTML+=`<td><input value='${count}'></td>`;
          //           trBody.innerHTML+=`<td>${az}</td>`;
          //           trBody.innerHTML+=`<td>${distance[i]}</td>`;
          //           trBody.innerHTML+=`<td>${900000}</td>`;
          //           document.querySelector('.beams-Table tbody').append(trBody);
          //           az+=30;
          //       }
          //       const thRas=document.createElement('th');
          //       thRas.innerHTML='Расстояние от подсп.точки'
          //       tr.append(thRas)
          //       const th=document.createElement('th');
          //       th.innerHTML=`Радиус,м`;
          //       tr.append(th)
          //       document.querySelector('.beams-Table thead').append(tr);
          //
          //       console.log(tableInfo)
          // });
        }
          else{
              const data = { name: `${selectedValue}`};
              console.log(data)
              const rusName={};
              postJSON(data).then(tableInfo=>{
                  const tr = document.createElement('tr');
                  for( let i=0;i<tableInfo.columns.length;i++){
                       console.log(tableInfo.columns[i].column_name)
                      const th=document.createElement('th');


                          rusName[tableInfo.columns[i].column_name]=tableInfo.columns[i].column_description;
                          let decr_rus=tableInfo.columns[i].column_description;
                          switch (decr_rus) {
                              case 'Идентификатор':
                                  decr_rus='Идентификатор'
                                  break;
                              case 'Азимут луча, градус':
                                  decr_rus='Азимут от подсп.точки'
                                  break;

                              default:
                                  break;
                          }
                          th.innerHTML+=decr_rus;
                          th.id=tableInfo.columns[i].column_name
                          tr.append(th);

                  }
                  document.querySelector('.beams-Table thead').append(tr);
              });
              console.log(selectedValue)
              const idKaData=document.getElementById('id-ka').innerHTML;
              let idKa=idKaData.replace(/\D/g, '');
             // if(!idKa){
             //     idKa='1';
             //     document.getElementById('id-ka').innerText=`KA: ${idKa}`;
             // }
              console.log(idKa)
              selectQuery(`SELECT * FROM ${selectedValue}  WHERE ID_KA = ${idKa}`).then((dataBeams)=>{

                  dataBeams.forEach((beams)=>{
                      const tr=document.createElement('tr');

                      beams.forEach((dataBeam)=>{
                          const td=document.createElement('td');
                          td.textContent=dataBeam;
                          tr.append(td);
                      })
                      tr.classList.add('beams-element');
                      document.querySelector('.beams-Table tbody').append(tr);

                  })
                  document.querySelectorAll('.beams-element').forEach(beam=>{
                      console.log('1')
                      beam.addEventListener('click',(e)=>{
                          const trs=document.querySelectorAll('.beams-Table tbody tr');
                          console.log('trs')
                          trs.forEach((tr)=>{
                              if (tr===e.target.parentElement) {
                                  clearCanvas();

                                  //   tr.style='background-color: #B5B8B1';
                                  tr.classList.add('selected');
                                  const distanceBeam=700000;
                                  let centerY=0,centerX=0,radius=(tr.children[4].innerHTML/1000)*0.125;
                                  console.log(tr.children[3].innerHTML)
                                  console.log(tr.children[4].innerHTML)
                                  centerY=500+(distanceBeam*0.125)/1000+radius*Math.sin(tr.children[3].innerHTML* (Math.PI/180));
                                  centerX=500+(distanceBeam*0.125)/1000+radius*Math.cos(tr.children[3].innerHTML* (Math.PI/180));
                                  console.log(centerX,centerY,radius)
                                  drawCircle(centerX,centerY,radius,'black')
                              }
                              else{
                                  tr.classList.remove('selected');
                              }
                          })

                      })

                  })
              })
            // console.log(beams)
            // const tr = document.createElement('tr');
            // const ths=['Лучи','Азимут от подсп.точки','Расстояние от подсп.точки','Радиус,м']
            // for(let i=0;i<4;i++){
            //     const th=document.createElement('th')
            //     th.innerHTML=ths[i]
            //     tr.append(th)
            // }
            //
            //
            // document.querySelector('.beams-Table thead').append(tr);
            // let az=0;
            // let distance=[850000,800000,1700000,600000,500000,1400000,600000,1500000,100000,1800000,700000,550000,630000,720000,480000,1350000];
            //
            // for (let i = 0; i < 16; i++) {
            //
            //     const trBody=document.createElement('tr')
            //     let count=i+1;
            //     trBody.classList.add('beams-element');
            //
            //     trBody.innerHTML+=`<td>${count}</td>`;
            //     trBody.innerHTML+=`<td>${az}</td>`;
            //     trBody.innerHTML+=`<td>${distance[i]}</td>`;
            //     trBody.innerHTML+=`<td>${900000}</td>`;
            //     document.querySelector('.beams-Table tbody').append(trBody);
            //     az+=30;
            //
            // }
              console.log( document.querySelectorAll('.beams-element'))

          }

        document.querySelectorAll('.beams-element').forEach(beam=>{
            console.log('1')
            beam.addEventListener('click',(e)=>{
                const trs=document.querySelectorAll('.beams-Table tbody tr');
                console.log('trs')
                trs.forEach((tr)=>{
                    if (tr===e.target.parentElement) {
                    clearCanvas();
                  
                    //   tr.style='background-color: #B5B8B1';
                    tr.classList.add('selected');
                    let centerY=0,centerX=0,radius=(tr.children[4].innerHTML/1000)*0.125;
                    const distanceBeam=700000;
                    console.log(tr.children[1].innerHTML)
                    centerY=500+(distanceBeam*0.125)/1000+radius*Math.sin(tr.children[3].innerHTML* (Math.PI/180));
                    centerX=500+(distanceBeam*0.125)/1000+radius*Math.cos(tr.children[3].innerHTML* (Math.PI/180));
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

                
                let centerY=0,centerX=0,radius=(tr.children[4].innerHTML/1000)*0.125;
                console.log(tr.children[1].innerHTML)
                const distanceBeam=700000;
                centerY=500+(distanceBeam*0.125)/1000+radius*Math.sin(tr.children[3].innerHTML* (Math.PI/180));
                centerX=500+(distanceBeam*0.125)/1000+radius*Math.cos(tr.children[3].innerHTML* (Math.PI/180));
                console.log(centerX,centerY,radius)
                drawCircle(centerX,centerY,radius,'black')
                

            
                
               
                   
               
              })
        })


          
         
          
           
          
            // leftContent.innerHTML+=`${KA[0].SHIROTA_LN}`
            // console.log(leftContent,KA[0])
        });
    }

    function drawCircle(centerY,centerX,radius,color) {
        const canvas = document.getElementById("canvas");
       
    const ctx = canvas.getContext('2d');


    ctx.beginPath();

    ctx.arc(centerY, centerX, radius, 0, 2 * Math.PI);
    

    ctx.strokeStyle = color; 
    ctx.stroke();
      }
   
    createKATable();
    createBeamTable();
    drawCircle(500,500,312.5,'blue');
    const radioButtons = document.querySelectorAll('input[name="type_beams"]');
    console.log(radioButtons);
    radioButtons.forEach(radio=> radio.addEventListener('change',(event)=>
        {
            console.log(event.target.value);
            document.querySelector('.beams-Table').innerHTML=`<thead> </thead><tbody></tbody>`;
            createBeamTable();
        })
    )
    document.getElementById('save-beams').addEventListener('click',()=>{
        const idKaData=document.getElementById('id-ka').innerHTML;
        if (idKaData!=='КА:') {
            document.querySelector('.modal-beams-save').classList.toggle('close-modal');
            const idKa=idKaData.replace(/\D/g, '');
            console.log(idKa)

        }
        else
        {
            console.log('для сохранения нужно выбрать КА' )
        }

    })
    document.getElementById('edit-beams').addEventListener('click',()=>{

        document.querySelector('.modal-columns-edit').innerHTML=``;
        const beamSelected=document.querySelector('tr.beams-element.selected');
        const ths=document.querySelectorAll('tr th');
        console.log(ths)
        if (beamSelected) {
            document.querySelector('.modal-beams-edit').classList.toggle('close-modal');
            Array.from(beamSelected.children).forEach((child,index)=>{
                if (index!==0){
                    const dataColum=document.createElement('div');
                    dataColum.classList.add('data-column');
                    dataColum.innerHTML+=`<div class="name-column">${ths[index].innerHTML}</div>`;
                    dataColum.innerHTML+=`<input value='${child.innerHTML}'></input>`;
                    console.log(child.innerHTML)
                    document.querySelector('.modal-columns-edit').append(dataColum)
                }

            })
        }
        else{
            console.log('выберите луч для редактирования')
        }


    })
    document.getElementById('close-edit-beams').addEventListener('click',()=>{
        document.querySelector('.modal-beams-edit').classList.toggle('close-modal');
    })
    document.getElementById('close-save-beams').addEventListener('click',()=>{
        document.querySelector('.modal-beams-save').classList.toggle('close-modal');
    })
    document.getElementById('save-save-beams').addEventListener('click',()=>{
        const idKaData=document.getElementById('id-ka').innerHTML;
        const idKa=idKaData.replace(/\D/g, '');
        const elementsAllBeams=document.querySelectorAll('tr.beams-element');
        const elementsColumsBeams=document.querySelectorAll('table.beams-Table thead th');
        console.log(elementsAllBeams[0]);
        console.log(elementsColumsBeams[1]);
        const selectedValue = document.querySelector('input[name="type_beams"]:checked').value;
        const queryBeam=`UPDATE ${selectedValue} SET `;
        const arrColumsBeams=[];
        const arrDataBeams=[];
        const arrIdBeams=[];

        elementsColumsBeams.forEach((column,i)=> {
            if (i===0){
                arrIdBeams.push(column.id);
            }
           if (i>2){
               console.log(column.id)
               arrColumsBeams.push(column.id);
               Array.from(elementsAllBeams[i].children).forEach((beam,index)=>{
                   if ( index>2){
                       console.log(beam.innerHTML);
                       arrDataBeams.push(beam.innerHTML);
                   }

               })
           }



                console.log(`......................`)
            // queryBeam+=`${elementsColumsBeams[i]} = CASE ID`;
        })
        // changeQuery('SELECT * FROM KA_BEAM_PRD');
        document.querySelector('.modal-beams-save').classList.toggle('close-modal');
    })
    document.getElementById('save-edit-beams').addEventListener('click',()=>{
        const dataColumns=document.querySelectorAll('.data-column input');
        const beamSelected=document.querySelector('tr.beams-element.selected');
        dataColumns.forEach((data,i)=>{
            beamSelected.children[i].innerHTML=`<td>${data.value}</td>`
            console.log(data.value)
        })
        let centerY=0,centerX=0,radius=(beamSelected.children[4].innerHTML/1000)*0.125;
        const distanceBeam=700000;
        console.log(beamSelected.children[1].innerHTML)
        centerY=500+(distanceBeam*0.125)/1000+radius*Math.sin(beamSelected.children[3].innerHTML* (Math.PI/180));
        centerX=500+(distanceBeam*0.125)/1000+radius*Math.cos(beamSelected.children[3].innerHTML* (Math.PI/180));
        console.log(centerX,centerY,radius)
        clearCanvas();
        drawCircle(centerX,centerY,radius,'black')

        document.querySelector('.modal-beams-edit').classList.toggle('close-modal');

    })
})
