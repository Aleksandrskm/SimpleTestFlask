'use strict';
import {
    editRow,
    deleteRow,
    insertRow,
    postJSON,
    getRowsTable,
    changeQuery,
    selectQuery,
    getDistanceBeam,updateOrInsert
} from './db.js';
function renderPopup(popupElement,message){
    const div = document.createElement("div");
    // popupElement.innerHTML=` <button type="button" onclick="this.closest('dialog').classList.remove('popup');this.closest('dialog').close();">
    //       Закрыть
    //   </button>`;
    const p=document.createElement("p");
    popupElement.innerHTML=``;
    p.innerHTML=message;
    div.append(p);
    div.classList.add('dialog-div');
    popupElement.prepend(div);
    popupElement.classList.add('popup');
    popupElement.showModal()
    setTimeout(()=>{
        popupElement.classList.remove('popup')
        popupElement.close()
    },5000)
}
let tableInfoBeams=[];
let tableValuesBeams=[];

document.addEventListener('DOMContentLoaded',function(){
    function drawsTrBeam(tr,flagSelected=true,color='black',lineWidth = 1){
        if(flagSelected){
            tr.classList.add('selected');

        }
        const distanceBeam=tr.children[2].innerHTML;
        let centerY=0,centerX=0,radius=(tr.children[4].innerHTML/1000)*0.125;
        console.log(tr.children[3].innerHTML)
        console.log(tr.children[4].innerHTML)
        const widthCanvas = document.getElementById('canvas').offsetWidth;
        const heightCanvas = document.getElementById('canvas').offsetHeight;
        centerX=350+(distanceBeam*0.125)/1000*Math.sin((180-tr.children[3].innerHTML)* (Math.PI/180));
        centerY=350+(distanceBeam*0.125)/1000*Math.cos((180-tr.children[3].innerHTML)* (Math.PI/180));
        console.log('centerX',centerX,'centerX',centerY,'radius',radius)
        drawCircle(centerY,centerX,radius,color,lineWidth,tr.children[0].innerHTML)
    }
    function closeTab() {
        // Создаем пустую страницу и сразу закрываем
        // window.history.back();
        window.close();
    }
    document.getElementById('exit').addEventListener('click', closeTab);
    function selectFirstRow(){
        const tr=document.querySelector('.KA-Table tbody tr');
        tr.classList.add('selected');
        document.getElementById('id-ka').innerHTML=`КА: ${tr.children[0].innerHTML}`;
        document.getElementById('ka-name').innerHTML=`${tr.children[1].innerHTML}`;
        document.querySelector('.beams-Table').innerHTML=`<thead> </thead><tbody></tbody>`;
        createBeamTable(tr.children[0].innerHTML)
        clearCanvas();
    }
    function selectFitstKa(e){
        const trs=document.querySelectorAll('.KA-Table tbody tr');
        trs.forEach((tr)=>{
            if (tr===e.target.parentElement) {
                //   tr.style='background-color: #B5B8B1';
                tr.classList.add('selected');
                console.log(tr,'tr','event',e);
                document.getElementById('id-ka').innerHTML=`КА: ${tr.children[0].innerHTML}`;
                document.getElementById('ka-name').innerHTML=`${tr.children[1].innerHTML}`;
                document.querySelector('.beams-Table').innerHTML=`<thead> </thead><tbody></tbody>`;
                createBeamTable(tr.children[0].innerHTML)

            }
            else{
                tr.classList.remove('selected');
            }
        })
        clearCanvas();
    }
    function createKATable(){
        getRowsTable('KA',0,99999).then(KA=>{
          const data = { name: 'KA' };
          const rusName={};
          document.querySelector('.tab-Ka-name').innerHTML=`Список ${data.name}:`;
          postJSON(data).then(tableInfo=>{
            const tr = document.createElement('tr');
            for( let i=0;i<tableInfo.columns_info.length;i++){
                // console.log(tableInfo.columns[i].column_description)
                const th=document.createElement('th');
                if ( tableInfo.columns_info[i].description==='Идентификатор' || tableInfo.columns_info[i].description==='Наименование КА'
                     || tableInfo.columns_info[i].description==='Номер орбиты') {
                    console.log()
                    if (tableInfo.columns_info[i].description==='Идентификатор'){
                        rusName[tableInfo.columns_info[i].name]='ID';
                        th.innerHTML+='ID';
                    }
                    else {
                        rusName[tableInfo.columns_info[i].name]=tableInfo.columns_info[i].description;
                        th.innerHTML+=tableInfo.columns_info[i].description;
                    }

                    // th.innerHTML+=tableInfo.columns_info[i].description;
                    tr.append(th);
                }
            }
            document.querySelector('.KA-Table thead').append(tr);
            console.log(Object.keys(rusName));
            for (let i = 0; i < KA.rows.length; i++) {
                const elKA=document.createElement('tr');
               
                elKA.id=KA.rows[i].ID;
                elKA.classList.add('ka-element');
                // elKA.innerHTML+=`<br>`;
            const keysRusName=(Object.keys(rusName));
                for(const key in  KA.rows[i])
                {
                    // console.log(rusName)
                    for(const name in rusName)
                    { 
                        //  console.log(name,key)
                        if (key===name) {
                           
                        elKA.innerHTML+=`<td>${(KA.rows[i][key])}</td>`
                    }
        
                    }
                }
            // elKA.innerHTML+=`<br>`
            document.querySelector('.KA-Table tbody').append(elKA)
            
           }
           const kaElems=document.querySelectorAll('.ka-element');
           kaElems.forEach((ka) => {
               ka.addEventListener('click',selectFitstKa)
          });
              selectFirstRow()
        });

        });
    }
    function clearCanvas() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const widthCanvas = document.getElementById('canvas').offsetWidth;
        const heightCanvas = document.getElementById('canvas').offsetHeight;
        console.log('width/2',widthCanvas/2,'height/2',heightCanvas/2);
        drawCircle(350,350,312.5,'gray');
        const trsBeams=document.querySelectorAll('.beams-Table tbody tr');
        trsBeams.forEach((tr)=>{
            drawsTrBeam(tr,false)
            console.log('!!!!!!!!!test')
        })
    }
    function createBeamTable(idKa){
        const selectedValue = document.querySelector('input[name="type_beams"]:checked').value;
        console.log(`${selectedValue}!!!!`);
        clearCanvas();
        getRowsTable(`${selectedValue}`,0,99999).then(beams=>{
          if (beams.length ===0) {
              console.log('В данный момент нет данных')
        }
          else{
              const data = { name: `${selectedValue}`};
              let typeBeams='';
              if (data.name==='KA_BEAM_PRD')
              {
                  typeBeams='по передаче'
              }
              else {
                  typeBeams='по приему'
              }

              document.querySelector('.tab-Beams-name').innerHTML=`Характеристики лучей ${typeBeams}`;
              console.log(data)
              const rusName={};
              postJSON(data).then(tableInfo=>{
                  tableInfoBeams=[...tableInfo.columns_info.map(column => column.name)];
                  console.log(tableInfoBeams,'tableInfoBeams');
                  const tr = document.createElement('tr');
                  for( let i=2;i<tableInfo.columns_info.length;i++){
                       console.log(tableInfo.columns_info[i].name)
                      if(i>1 && i <6 || i === 8){

                          console.log('description',tableInfo.columns_info[i].description)
                          const th=document.createElement('th');
                          rusName[tableInfo.columns_info[i].name]=tableInfo.columns_info[i].description;
                          let decr_rus=tableInfo.columns_info[i].description;
                          switch (decr_rus) {
                              case 'Номер луча приема':
                                  decr_rus='Номер луча'
                                  break;
                              case 'Номер луча передачи':
                                  decr_rus='Номер луча'
                                  break;
                              case 'Дальность центра точки луча от подспутниковой точки, метры':
                                  decr_rus='Дальность центра  луча от подспутниковой точки КА, метры'
                                  break;
                              case 'Азимут центр точки луча на поверхности, градус':
                                  decr_rus='Азимут луча относительно орбиты КА, градус'
                                  break;

                              default:
                                  break;
                          }
                          th.innerHTML+=decr_rus;
                          th.id=tableInfo.columns_info[i].name
                          tr.append(th);
                      }


                  }
                  const trArr=[...tr.children];
                  console.log(trArr,'children');
                  const trArrCorrect=[trArr[0],
                      trArr[4],
                      trArr[2],
                      trArr[1],
                      trArr[3]]
                  tr.append(...trArrCorrect)
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

              selectQuery(`SELECT * FROM ${selectedValue} WHERE ID_KA = ${idKa}`).then((dataBeams)=>{
                  tableValuesBeams=[]
                  dataBeams.forEach((beams) => {
                      const tr = document.createElement('tr');
                      tr.classList.add('beams-element');

                      const tdArray = []; // Массив для хранения td

                      beams.forEach((dataBeam, index) => {
                          if (index > 1 && index < 6 || index === 8) {
                              const td = document.createElement('td');
                              td.textContent = dataBeam;
                              tdArray.push(td); // Добавляем td в массив
                          }
                      });
                      tableValuesBeams.push(beams.map(beam=>beam.toFixed(6)));
                      // Переупорядочиваем массив td: 0, 4, 2, 1, 3
                      const orderedTdArray = [
                          tdArray[0],
                          tdArray[4],
                          tdArray[2],
                          tdArray[1],
                          tdArray[3]
                      ];
                      orderedTdArray[3].innerHTML=(Number(orderedTdArray[3].innerHTML).toFixed(6));
                      // Добавляем td в строку в нужном порядке
                      tr.append(...orderedTdArray);

                      // Устанавливаем dataset.id
                      tr.dataset.id = beams[0];

                      // Вставляем строку в таблицу
                      document.querySelector('.beams-Table tbody').append(tr);
                  });
                  console.log(tableValuesBeams,'tableValuesBeams');
                  const trsBeams=document.querySelectorAll('.beams-Table tbody tr');
                  trsBeams.forEach((tr)=>{
                      console.log('5',tr.children[4].innerHTML)
                      drawsTrBeam(tr,false)
                      console.log('!!!!!!!!!test')
                  })
                  document.querySelectorAll('.beams-element').forEach(beam=>{
                      console.log('1')
                      beam.addEventListener('click',(e)=>{
                          const trs=document.querySelectorAll('.beams-Table tbody tr');
                          console.log('trs')
                          trs.forEach((tr,index)=>{
                              if (tr===e.target.parentElement) {
                                   clearCanvas();
                                  drawsTrBeam(tr,true,'blue',5)
                              }
                              else{
                                  tr.classList.remove('selected');

                              }
                          })
                      })
                  })
              })
              console.log( document.querySelectorAll('.beams-element'))
          }
        document.querySelectorAll('.beams-element').forEach(beam=>{
            console.log('1')
            beam.addEventListener('click',(e)=>{
                const trs=document.querySelectorAll('.beams-Table tbody tr');
                console.log('trs')
                trs.forEach((tr)=>{
                    if (tr===e.target.parentElement) {
                        // clearCanvas();
                        drawsTrBeam(tr)
                    }
                    else{
                        tr.classList.remove('selected');
                    }
                  })
                
            })
        })
        // document.getElementById('view-beams').addEventListener('click',()=>{
        //     clearCanvas();
        //     const trs=document.querySelectorAll('.beams-Table tbody tr');
        //     trs.forEach((tr)=>{
        //         drawsTrBeam(tr,false)
        //       })
        // })
        });

    }
    function generateBeamUpdateQuery(tableName, arrDataBeams, arrColumnsBeams, arrIdBeams, idKa) {
        const recordsCount = arrIdBeams.length;
        const columnsCount = arrColumnsBeams.length;

        // Генерируем CASE для каждого поля
        const caseStatements = arrColumnsBeams.map((column, colIndex) => {
            const cases = arrIdBeams.map((id, idIndex) => {
                const valueIndex = idIndex * columnsCount + colIndex;
                const value = arrDataBeams[valueIndex];
                return `WHEN ID = ${id} THEN ${value}`;
            }).join(' ');

            return `${column} = CASE ${cases} ELSE ${column} END`;
        }).join(', ');

        // Формируем итоговый запрос в одну строку
        return `UPDATE ${tableName} SET ${caseStatements} WHERE ID IN (${arrIdBeams.join(', ')}) AND ID_KA = ${idKa};`;
    }
    function drawCircle(centerY,centerX,radius,color,lineWidth = 1,text ='' ) {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (text !== "") {
            // Настраиваем стиль текста
            ctx.font = `16px Arial`; // Размер шрифта зависит от радиуса
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = color;

            // Рисуем текст
            ctx.fillText(text, centerX, centerY);
        }
      }
   
    createKATable();
    // createBeamTable();

    const widthCanvas = document.getElementById('canvas').offsetWidth;
    const heightCanvas = document.getElementById('canvas').offsetHeight;
    console.log('width',widthCanvas,'height',heightCanvas);
    console.log('width/2',widthCanvas/2,'height/2',heightCanvas/2);
    // drawCircle(heightCanvas/2,widthCanvas/2,312.5,'blue');
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
    function formatLastThree(str) {
        str = String(str);
        if (str.length <= 3) return str; // Не меняем короткие строки
        return str.slice(0, -3) + ',' + str.slice(-3);
    }
    document.getElementById('edit-beams').addEventListener('click',()=>{

        document.querySelector('.modal-columns-edit').innerHTML=``;
        const beamSelected=document.querySelector('tr.beams-element.selected');
        const ths=document.querySelectorAll('.beams-Table tr th');
        console.log(ths)
        if (beamSelected) {
            document.querySelector('.modal-beams-edit').classList.toggle('close-modal');
            const dataColum=document.createElement('div');
            dataColum.classList.add('data-column');
            let typeBeam='';
            if(document.querySelector('input[name="type_beams"]:checked').value === 'KA_BEAM_PRD')
            {
                typeBeam='Передача'
            }
            else {
                typeBeam='Прием'
            }
            dataColum.innerHTML+=`<div class="name-column">Тип луча:</div>`;
            dataColum.innerHTML+=`<div>${typeBeam}</div>`;
            document.querySelector('.modal-columns-edit').append(dataColum)
            Array.from(beamSelected.children).forEach((child,index)=>{

                    const dataColum=document.createElement('div');
                    dataColum.classList.add('data-column');

                    // dataColum.innerHTML+=`<div class="name-column">${ths[index].innerHTML}</div>`;
                    if (index===0){
                        dataColum.innerHTML+=`<div class="name-column">${ths[index].innerHTML}</div>`;
                        dataColum.innerHTML+=`<input  class="beams-input" disabled value='${child.innerHTML}'></input>`;

                    }
                    else if (index===beamSelected.children.length-1 || index===2){
                        if(index===beamSelected.children.length-1){
                            dataColum.innerHTML+=`<div class="name-column">${ths[index].innerHTML.replace(/м/g, 'км')}</div>`;
                        }
                        else {
                            dataColum.innerHTML+=`<div class="name-column">${ths[index].innerHTML.replace(/метры/g, 'км')}</div>`;
                        }

                        dataColum.innerHTML+=`<input class="beams-input" value='${Number(child.innerHTML)/1000}'></input>`;

                    }
                    else {
                        dataColum.innerHTML+=`<div class="name-column">${ths[index].innerHTML}</div>`;
                        dataColum.innerHTML+=`<input  class="beams-input" value='${child.innerHTML}'></input>`;

                    }


                    console.log(child.innerHTML)
                    if (index===1){
                        const butnCulc=document.createElement('button');
                        butnCulc.id='calcCenterBeam';
                        // butnCulc.disabled=true;
                        butnCulc.textContent='Расчет дальности центра луча';
                        butnCulc.addEventListener('click',()=>{
                            const inputModalElements = [...document.querySelectorAll('.data-column input')];
                            getDistanceBeam(Number(inputModalElements[1].value),1500).then( distanse=>{

                                    console.log(distanse);
                                    inputModalElements[2].value=distanse.toFixed(3);
                                    inputModalElements[2].value=inputModalElements[2].value;
                            }

                            )
                        })
                        // dataColum.innerHTML+=` <button disabled id="calcCenterBeam">Расчет дальности центра луча</button>`;
                        dataColum.append(butnCulc);
                    }
                    document.querySelector('.modal-columns-edit').append(dataColum)


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
    document.getElementById('copy-beams-Kas').addEventListener('click',()=>{
        const idKas=[...document.querySelectorAll('.KA-Table tbody tr')].map(trKa=>Number(trKa.id));
        const idKaData=document.getElementById('id-ka').innerHTML;
        const idKaCurrent=Number(idKaData.replace(/\D/g, ''));
        const dataId=[...document.querySelectorAll('.beams-element')]

        const selectedValue = document.querySelector('input[name="type_beams"]:checked').value;

        async function processBeamsForAllKAs() {
            try {
                let promises = []; // Массив для промисов

                for (const idKa of idKas) {
                    promises=[]
                    const arrColumsBeams = [];
                    const arrDataBeams = [];
                    const arrIdBeams = [];
                    const arrAllBeams=[]
                    let dataSetIds = dataId.map((idElem) => idElem.dataset.id);

                    if (idKa > idKaCurrent) {
                        dataSetIds = dataSetIds.map(id => String(Number(id) + 16 * (idKa - idKaCurrent)));
                    } else if (idKa < idKaCurrent) {
                        dataSetIds = dataSetIds.map(id => String(Number(id) - 16 * (idKaCurrent - idKa)));
                    }

                    console.log(dataSetIds, 'dataSetIdsCurr', idKa, 'idKa');

                    const elementsAllBeams = document.querySelectorAll('tr.beams-element');
                    const elementsColumsBeams = document.querySelectorAll('table.beams-Table thead th');

                    elementsColumsBeams.forEach((column, i) => {
                        arrColumsBeams.push(column.id);
                        console.log(column.id, 'column.id');
                    });

                    for (let i = 0; i < elementsAllBeams.length; i++) {
                        Array.from(elementsAllBeams[i].children).forEach((beam,index)=>{
                            console.log(beam.innerHTML,'beamsIn');
                            arrAllBeams.push(beam.innerHTML);
                        })
                    }
                    for (let i = 0; i < arrAllBeams.length; i += 5) {
                        arrDataBeams.push(arrAllBeams.slice(i, i + 5));
                    }
                    console.log(arrIdBeams, 'arrIdBeams');
                    const fieldIndices = arrColumsBeams.map(field => tableInfoBeams.indexOf(field));


                    tableValuesBeams.forEach((row, index) => {
                        arrDataBeams[index].forEach((value, i) => {
                            row[fieldIndices[i]] = value;
                        });
                    });
                    console.log(tableInfoBeams,'tableInfoBeamsRes')
                    console.log(tableValuesBeams,'tableValuesBeamsRes');

                    const filteredColumns = tableInfoBeams.filter(col => col !== "ID" && col !== "ID_KA");
                    const filteredData = tableValuesBeams.map(row => row.slice(2)); // Удаляем первые два элемента

                    const resultBody = filteredData.map(row => {
                        const rowObj = {};
                        filteredColumns.forEach((col, index) => {
                            rowObj[col] = row[index];
                        });
                        return {
                            row: rowObj,
                            matching: [filteredColumns[0]]
                        };
                    });
                    console.log(resultBody,'resultObj');
                    resultBody.forEach((body) => {
                        promises.push(updateOrInsert(selectedValue,body))
                    })

                    // const queryBeam = generateBeamUpdateQuery(selectedValue, arrAllBeams, arrColumsBeams, dataSetIds, idKa);
                    // promises.push(changeQuery(queryBeam)); // Реальный запрос
                    break;

                }

                // Теперь запускаем ВСЕ запросы одновременно с Promise.all
                const results = await Promise.all(promises);


                return results;

            } catch (error) {

                throw error;
            }
        }

        processBeamsForAllKAs()
            .then(results =>  renderPopup(document.querySelector('#dialog-res'), `Данные лучей успешно перенесены на другие КА`))
            .catch(error =>  renderPopup(document.querySelector('#dialog-res'), `Произошла ошибка ${error}`));



    })
    document.getElementById('save-save-beams').addEventListener('click',()=>{
        const idKaData=document.getElementById('id-ka').innerHTML;
        const idKa=idKaData.replace(/\D/g, '');
        console.log(idKa);
        const elementsAllBeams=document.querySelectorAll('tr.beams-element');
        const elementsColumsBeams=document.querySelectorAll('table.beams-Table thead th');
        console.log(elementsAllBeams[0]);
        console.log(elementsColumsBeams[1]);
        const selectedValue = document.querySelector('input[name="type_beams"]:checked').value;
        const arrAllBeams=[]
        const arrColumsBeams=[];
        const arrDataBeams=[];
        const arrIdBeams=[];
        console.log(elementsAllBeams);

        const dataId=[...document.querySelectorAll('.beams-element')]
        const dataSetIds=dataId.map((idElem)=> idElem.dataset.id )
        console.log('datasetID',dataSetIds);
        console.log('dataset',document.querySelector('.beams-element').dataset);
        for (let i = 0; i < elementsAllBeams.length; i++) {
            Array.from(elementsAllBeams[i].children).forEach((beam,index)=>{
                if ( index===0){
                    // console.log(beam.innerHTML);
                    // arrIdBeams.push(elementsAllBeams[i]);
                    arrIdBeams.push(+beam.innerHTML);

                }
            })
        }
        console.log(arrIdBeams)
        console.log(elementsColumsBeams.length)
        elementsColumsBeams.forEach((column,i)=> {

               // console.log(column.id)
               arrColumsBeams.push(column.id);

                console.log(`......................`)
            // queryBeam+=`${elementsColumsBeams[i]} = CASE ID`;
        })
        for (let i = 0; i < elementsAllBeams.length; i++) {
            Array.from(elementsAllBeams[i].children).forEach((beam,index)=>{
                     console.log(beam.innerHTML,'beamsIn');
                arrAllBeams.push(beam.innerHTML);
            })
        }
        for (let i = 0; i < arrAllBeams.length; i += 5) {
            arrDataBeams.push(arrAllBeams.slice(i, i + 5));
        }
        console.log(arrIdBeams,'arrIdBeams')
        console.log(arrColumsBeams,'arrColumsBeams')
        console.log(arrDataBeams,'arrDataBeams')
        const fieldIndices = arrColumsBeams.map(field => tableInfoBeams.indexOf(field));

        // Обновляем основной массив
        tableValuesBeams.forEach((row, index) => {
            console.log(arrDataBeams[index],'arrDataBeams[index]');
            arrDataBeams[index].forEach((value, i) => {
                row[fieldIndices[i]] = value;
            });
        });

        console.log(tableValuesBeams,'tableValuesBeamsRes');
        const queryBeam=generateBeamUpdateQuery(selectedValue,arrAllBeams,arrColumsBeams,dataSetIds,idKa);
        console.log(queryBeam);
        changeQuery(queryBeam).then(r => {
            renderPopup(document.querySelector('#dialog-res'),`Данные таблицы успешно обновлены`)
        }).catch(error => {
            renderPopup(document.querySelector('#dialog-res'), `Произошла ошибка ${error}`);
        });
        document.querySelector('.modal-beams-save').classList.toggle('close-modal');
    })
    document.getElementById('save-edit-beams').addEventListener('click',()=>{
        const dataColumns=document.querySelectorAll('.data-column input');
        const beamSelected=document.querySelector('tr.beams-element.selected');
        dataColumns.forEach((data,i)=>{
            if (i==2 || i==4){
                beamSelected.children[i].innerHTML=`<td>${Number(data.value.replace(/,/g, '.'))*1000}</td>`
                console.log(data.value)
            }
            else if(i!=0 && i!=1){
                beamSelected.children[i].innerHTML=`<td>${Number(data.value.replace(/,/g, '.')).toFixed(6)}</td>`
                console.log(data.value)
            }
            else  {
                beamSelected.children[i].innerHTML=`<td>${Number(data.value.replace(/,/g, '.'))}</td>`
                console.log(data.value)
            }

        })

        clearCanvas();
        drawsTrBeam(beamSelected,false,'blue',5)
        document.querySelector('.modal-beams-edit').classList.toggle('close-modal');

    })
})
