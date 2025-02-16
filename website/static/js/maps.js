"use strict"

import {editRow,deleteRow,insertRow,postJSON,getRowsTable} from './db.js';

export const map = new ol.Map({
    // Задание источника данных для карты
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'http://185.192.247.60:8666/tiles_disk/{z}/{x}/{y}.png',
                crossOrigin: 'anonymous',
            }),
        }),
    ],
    // Задание целевого элемента для отображения карты
    target: 'map',
    // Задание начальных координат и масштаба карты
    view: new ol.View({
        center: ol.proj.fromLonLat([80, 0], 'EPSG:4326'), // Точка по умолчанию обычные долгота и широта в градусах
        zoom: 1, // Зум по умолчанию 
        smoothExtentConstraint: false, // 
        smoothResolutionConstraint: false, // 
        projection: 'EPSG:4326', // Указываем базовую проекцию
        maxZoom: 9 // Максимальный зум
    }),
});

// Создание векторного слоя
const pointLayer = new ol.layer.Vector({
    _typeLayer: 'kaPoint', // Назначение типа слоя
    _isOverlay: true, // Флаг слоя над основным слоем
    source: new ol.source.Vector({ features: new ol.Collection() }), // Источник данных для точек
    visible: false // Флаг видимости слоя
})

// Установка видимости слоя
pointLayer.setVisible(false);

// Создание стиля для точек
const pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5, // Радиус круга
        fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.8)' }), // Заливка (красный цвет с прозрачностью)
        stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.8)', width: 2 }), // Обводка (белый цвет)
    }),
});

// Применение стиля к векторному слою
pointLayer.setStyle(pointStyle);

// Добавление слоя на карту
map.addLayer(pointLayer);

// Создание точки
const point = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([80, 50], 'EPSG:4326')), // Координаты долгота и широта
});

// Добавление точки в слой
pointLayer.getSource().addFeature(point);

/**
 * Формат повторяет GeoJson, пример как читать geojson: 
 *  
 */ 
// Пример данных в формате GeoJSON


// Создание источника для слоя
// "EPSG:4326" - это проекция измеряет широту и долготу  в градусах (как на сайте)
// "EPSG:3857" -  использует метры (как в Гугл картах)


// Создание слоя с данными GeoJSON
// Создание векторного слоя с данными из GeoJSON
// const geojsonLayer = new ol.layer.Vector({
//     // Указываем источник данных для слоя
//     source: geojsonSource, // Это объект источника данных (Vector), который содержит данные GeoJSON
    
//     // Задание стиля для отображения объектов на слое
//     style: new ol.style.Style({
//         // Определение стиля для точек на слое
//         image: new ol.style.Circle({
//             // Радиус круга, который будет отображаться для каждой точки
//             radius: 5, // Радиус в пикселях
            
//             // Заливка круга
//             fill: new ol.style.Fill({
//                 // Задаем цвет заливки круга
//                 color: 'rgba(0, 0, 255, 0.8)' // Синий цвет с прозрачностью 0.8
//             }),
            
//             // Обводка круга
//             stroke: new ol.style.Stroke({
//                 // Задаем цвет обводки круга
//                 color: 'rgba(255, 255, 255, 0.8)', // Белая обводка с прозрачностью 0.8
//                 width: 2 // Ширина обводки
//             }),
//         }),
//     }),
// });

let geojsonLayersAll=[];
const geojsonLayers=[];
let typeSelect = 'Box';
function clearDistrict(geojsonLayers) {
    geojsonLayers.forEach(geojsonLayer=>{
    map.removeLayer(geojsonLayer);
    
   })
  
   
   

}
function drawDistrict(latLN,lonLN,latPV,lonPV,color) {
    const geojsonData = {
        // Тип коллекции объектов
        "type": "FeatureCollection",
        
        // Массив объектов "Feature" (каждый объект представляет собой географическую особенность)
        "features": [
           
            {
                "type": "Polygon",
                "coordinates": [
                    [
                        // [
                        //     76.01151296608155,
                        //     -6.672207446808514
                        // ],
                        [   
                            +lonPV,
                            +latLN
                            
                        ],
                        [   +lonPV,
                            +latPV
                            
                        ],
                        [
                            +lonLN,
                            +latPV
                            
                        ],
                        [
                            +lonLN,
                            +latLN
                            
                        ]
                    ]   
                ]
            }
        ]
    };
    const geojsonSource = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojsonData, {
            dataProjection: 'EPSG:4326', // Проекция данных GeoJSON  
            featureProjection: 'EPSG:4326', // Проекция карты
        }),
    });
  
    const geojsonLayer = new ol.layer.Vector({
        // Указываем источник данных для слоя
        source: geojsonSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                                // Задаем цвет обводки круга
                                color: color, // Белая обводка с прозрачностью 0.8
                                width: 1 // Ширина обводки
                            }),
            // fill: new ol.style.Fill({ color: `${color}` })
            // fill: new ol.style.Fill({
            //     //                 
            //                     color: color // Синий цвет с прозрачностью 0.8
            //                 }),
        })
    });
    // console.log(geojsonLayer)
     map.addLayer(geojsonLayer);
     return geojsonLayer;
}
let draw; // global so we can remove it later
function addInteraction() {
   
    if (typeSelect !== 'None') {
      let geometryFunction;
      if (typeSelect === 'Square') {
        typeSelect = 'Circle';
        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
      } else if (typeSelect === 'Box') {
        typeSelect = 'Circle';
        geometryFunction = ol.interaction.Draw.createBox();
      } 
      let drawSource = new ol.source.Vector();
      
      draw = new ol.interaction.Draw({
        source: drawSource,
        type: typeSelect,
        geometryFunction: geometryFunction,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                                // Задаем цвет обводки круга
                                color: 'rgba(255, 0, 0, 0.8)', // Белая обводка с прозрачностью 0.8
                                width: 2 // Ширина обводки
                            }),
        })
      });
      draw.on("drawend", (event) => {
        const geometry = event.feature.getGeometry();
        console.log({
          type: geometry.getType(),
          coordinates: geometry.getCoordinates(),
        });
        const geojsonData = {
            // Тип коллекции объектов
            "type": "FeatureCollection",
            
            // Массив объектов "Feature" (каждый объект представляет собой географическую особенность)
            "features": [
                {
                    // Один объект типа "Feature" (географическая особенность)
                    "type": "Feature",
                    
                    // Геометрия объекта
                    "geometry": {
                        // Тип геометрии: точка
                        "type": geometry.getType(),
                        
                        // Координаты точки (долгота, широта)
                        "coordinates": geometry.getCoordinates() // Долгота 80, широта 0
                    },
                    
                    // Свойства точки, которые могут быть полезны (например, имя)
                    "properties": { 
                        "name": "Точка 1" // Название этой точки
                    }
                },
                // {
                //     "type": "Polygon",
                //     "coordinates": [
                //         [
                //             // [
                //             //     76.01151296608155,
                //             //     -6.672207446808514
                //             // ],
                //             [
                //                 110.79111990185059,
                //                 -6.672207446808514
                //             ],
                //             [
                //                 56.79111990185059,
                //                 45.34906914893617
                //             ],
                //             [
                //                 76.01151296608155,
                //                 45.34906914893617
                //             ],
                //             [
                //                 76.01151296608155,
                //                 -6.672207446808514
                //             ]
                //         ]
                //     ]
                // }
            ]
        };
        const geojsonSource = new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(geojsonData, {
                dataProjection: 'EPSG:4326', // Проекция данных GeoJSON  
                featureProjection: 'EPSG:4326', // Проекция карты
            }),
        });
      
        const geojsonLayer = new ol.layer.Vector({
            // Указываем источник данных для слоя
            source: geojsonSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                                    // Задаем цвет обводки круга
                                    color: 'rgba(255, 0, 0, 0.8)', // Белая обводка с прозрачностью 0.8
                                    width: 1 // Ширина обводки
                                }),
            })
        });
        const interaction = new ol.interaction.Modify({
            // Мы можем передать VectorSource или список фич
            source: geojsonSource,
           });
           map.addInteraction(interaction);
           
           
           interaction.on('modifyend', (event) => {
            console.log(event.features);
           }); 
        
        map.addLayer(geojsonLayer);
       });
     
      console.log(draw)
      map.addInteraction(draw);
      
    }
  }
document.getElementById('button-collapse-right').addEventListener('click',(e)=>{
    document.querySelector('.right-panel').classList.toggle('collapsed');
    document.querySelector('.right-panel .right').classList.toggle('hidden');
})
document.getElementById('button-collapse-left').addEventListener('click',(e)=>{
    document.querySelector('.left-panel').classList.toggle('collapsed');
    document.querySelector('.left-panel .left').classList.toggle('hidden');
})

function createZNTable(){
    getRowsTable('ZN',0,99999).then(zone=>{
        const leftContent=document.querySelector('.left-panel div.information_request');
        const data = { name: 'ZN' };
        const rusName={};
       
        postJSON(data).then(tableInfo=>{
            const tr = document.createElement('tr');
            
            for( let i=0;i<tableInfo.columns.length;i++){
               
                // console.log(tableInfo.columns[i].column_description)
                rusName[tableInfo.columns[i].column_name]=tableInfo.columns[i].column_description;
                const th=document.createElement('th');
                if (tableInfo.columns[i].column_description!='Идентификатор') {
                    console.log()
                    th.innerHTML+=tableInfo.columns[i].column_description;
                    
                    tr.append(th);
                }
             
               
               
               
               
            }
            document.querySelector('.district-Table thead').append(tr);
            console.log(Object.keys(rusName));
            for (let i = 0; i < zone.length; i++) {
                const elZN=document.createElement('tr');
               
                elZN.id=zone[i].ID;
                elZN.classList.add('zn-element');
                // elZN.innerHTML+=`<br>`;
            const keysRusName=(Object.keys(rusName));
                for(const key in zone[i])
                {
                    // console.log(rusName)
                    for(const name in rusName)
                    { 
                        //  console.log(name,key)
                        if (key==name && key!='ID') {
                           
                        elZN.innerHTML+=`<td>${(zone[i][key])}</td>`
                    }
        
                    }
                   
               
                }
            // elZN.innerHTML+=`<br>`
            document.querySelector('.district-Table tbody').append(elZN)
            
           }
           const allDistricts=document.querySelectorAll('.zn-element');
           allDistricts.forEach((zn) => {
            zn.addEventListener('click',(e)=>{
                const trs=document.querySelectorAll('table tr');
                trs.forEach((tr)=>{
                    if (tr==e.target.parentElement) {
                    //   tr.style='background-color: #B5B8B1';
                    tr.classList.add('selected');
                    }
                    else{
                        tr.classList.remove('selected');
                    }
                  })
                const latLN=zn.children[3].innerHTML;
                const lonLN=zn.children[4].innerHTML;
                const latPV=zn.children[5].innerHTML;
                const lonPV=zn.children[6].innerHTML;
                const nameDistrict=zn.children[0].innerHTML;
                const nameDistrictShort=zn.children[1].innerHTML;
                document.getElementById('name_district').value=nameDistrict;
                document.getElementById('name_district_short').value=nameDistrictShort;
                document.getElementById('lat_ln').value=latLN;
                document.getElementById('lon_ln').value=lonLN;
                document.getElementById('lat_pv').value=latPV;
                document.getElementById('lon_pv').value=lonPV;
                clearDistrict(geojsonLayers);
                geojsonLayers.push(drawDistrict(latLN,lonLN,latPV,lonPV,'rgba(0, 0, 255, 1)'));
                // console.log(zn.children[4],zn.children[5],zn.children[6],zn.children[7]);
            })
           
          });
          document.getElementById('view-all-district').addEventListener('click',()=>{
            if ( document.querySelector('.selected')) {
                document.querySelector('.selected').classList.remove('selected');
            }
            
            console.log(geojsonLayersAll)
            clearDistrict(geojsonLayers);
            clearDistrict(geojsonLayersAll);
            geojsonLayersAll=[];
            allDistricts.forEach(zn=>{
                const latLN=zn.children[3].innerHTML;
                const lonLN=zn.children[4].innerHTML;
                const latPV=zn.children[5].innerHTML;
                const lonPV=zn.children[6].innerHTML;
               
                // map.removeLayer(geojsonLayer);
                geojsonLayersAll.push(drawDistrict(latLN,lonLN,latPV,lonPV,'rgba(132, 132, 141, 0.7)')) ;
            })
          })
         
    
        });
       
      
        // leftContent.innerHTML+=`${zone[0].SHIROTA_LN}`
        // console.log(leftContent,zone[0])
    });
}
createZNTable();
// getRowsTable('ZN',0,99999).then(zone=>{
//     const leftContent=document.querySelector('.left-panel div.information_request');
//     const data = { name: 'ZN' };
//     const rusName={};
   
//     postJSON(data).then(tableInfo=>{
//         const tr = document.createElement('tr');
        
//         for( let i=0;i<tableInfo.columns.length;i++){
           
//             // console.log(tableInfo.columns[i].column_description)
//             rusName[tableInfo.columns[i].column_name]=tableInfo.columns[i].column_description;
//             const th=document.createElement('th');
//             if (tableInfo.columns[i].column_description!='Идентификатор') {
//                 console.log()
//                 th.innerHTML+=tableInfo.columns[i].column_description;
                
//                 tr.append(th);
//             }
         
           
           
           
           
//         }
//         document.querySelector('.district-Table thead').append(tr);
//         console.log(Object.keys(rusName));
//         for (let i = 0; i < zone.length; i++) {
//             const elZN=document.createElement('tr');
           
//             elZN.id=zone[i].ID;
//             elZN.classList.add('zn-element');
//             // elZN.innerHTML+=`<br>`;
//         const keysRusName=(Object.keys(rusName));
//             for(const key in zone[i])
//             {
//                 // console.log(rusName)
//                 for(const name in rusName)
//                 { 
//                     //  console.log(name,key)
//                     if (key==name && key!='ID') {
                       
//                     elZN.innerHTML+=`<td>${(zone[i][key])}</td>`
//                 }
    
//                 }
               
           
//             }
//         // elZN.innerHTML+=`<br>`
//         document.querySelector('.district-Table tbody').append(elZN)
        
//        }
//        const allDistricts=document.querySelectorAll('.zn-element');
//        allDistricts.forEach((zn) => {
//         zn.addEventListener('click',(e)=>{
//             const trs=document.querySelectorAll('table tr');
//             trs.forEach((tr)=>{
//                 if (tr==e.target.parentElement) {
//                 //   tr.style='background-color: #B5B8B1';
//                 tr.classList.add('selected');
//                 }
//                 else{
//                     tr.classList.remove('selected');
//                 }
//               })
//             const latLN=zn.children[3].innerHTML;
//             const lonLN=zn.children[4].innerHTML;
//             const latPV=zn.children[5].innerHTML;
//             const lonPV=zn.children[6].innerHTML;
//             const nameDistrict=zn.children[0].innerHTML;
//             document.getElementById('name_district').value=nameDistrict;
//             document.getElementById('lat_ln').value=latLN;
//             document.getElementById('lon_ln').value=lonLN;
//             document.getElementById('lat_pv').value=latPV;
//             document.getElementById('lon_pv').value=lonPV;
//             clearDistrict(geojsonLayers);
//             geojsonLayers.push(drawDistrict(latLN,lonLN,latPV,lonPV,'rgba(0, 0, 255, 0.3)'));
//             // console.log(zn.children[4],zn.children[5],zn.children[6],zn.children[7]);
//         })
       
//       });
//       document.getElementById('view-all-district').addEventListener('click',()=>{
//         if ( document.querySelector('.selected')) {
//             document.querySelector('.selected').classList.remove('selected');
//         }
        
//         console.log(geojsonLayersAll)
//         clearDistrict(geojsonLayers);
//         clearDistrict(geojsonLayersAll);
//         geojsonLayersAll=[];
//         allDistricts.forEach(zn=>{
//             const latLN=zn.children[3].innerHTML;
//             const lonLN=zn.children[4].innerHTML;
//             const latPV=zn.children[5].innerHTML;
//             const lonPV=zn.children[6].innerHTML;
           
//             // map.removeLayer(geojsonLayer);
//             geojsonLayersAll.push(drawDistrict(latLN,lonLN,latPV,lonPV,'rgba(129, 129, 170, 0.3)')) ;
//         })
//       })
     

//     });
   
  
//     // leftContent.innerHTML+=`${zone[0].SHIROTA_LN}`
//     // console.log(leftContent,zone[0])
// });
document.getElementById('daelete-district').addEventListener('click',()=>{
    const selectedRow=document.querySelector('.selected');
    if (selectedRow) {
       console.log(selectedRow)
        const modal=document.createElement('div');
        const modalDialog=document.createElement('div');
        const modalContent=document.createElement('div');
        modal.classList.add('modal');
        modalDialog.classList.add('modal__dialog');
        modalContent.classList.add('modal__content');
        modalContent.innerHTML=` <div class="modal__title"> Удаление строки из таблицы</div>`;
        modalContent.innerHTML+=` <div class="copy__row">Удаляется строка ${selectedRow.id}</div>`; 
      modalContent.innerHTML+=` 
      <div class='btnsModal'>
      <button class="btn modal__confirm btn_dark btn_min">Удалить</button>
      <button class="btn modal__close btn_dark btn_min">Отмена</button></div>`;
      const modalParent=document.querySelector('.right-panel');
    
     modalDialog.append(modalContent);
     modal.append(modalDialog);
     modalParent.append(modal); 
     const btnConfirm=document.querySelector('.modal__confirm');
     btnConfirm.addEventListener('click',()=>{
        const primaryKeys={
            ID:selectedRow.id
        }
        const data = {
            table_name: `ZN`,
            primary_keys: primaryKeys
          };
          console.log(data);
         
          deleteRow(data).then(()=>{
            modal.remove();
            document.querySelector('.district-Table thead').innerHTML='';
            document.querySelector('.district-Table tbody').innerHTML='';
            clearMap();
            createZNTable(); 

            })
          })
          
     const btnClose=document.querySelector('.modal__close');
      btnClose.addEventListener('click',()=>{ 
        
        modal.remove(); 
      });  
    };
  })
  document.getElementById('add-district').addEventListener('click',()=>{
    if (document.getElementById('name_district').value==''|| 
    document.getElementById('name_district_short').value==''||
    document.getElementById('lat_ln').value==''||
    document.getElementById('lon_ln').value==''||
    document.getElementById('lat_pv').value==''||
    document.getElementById('lon_pv').value=='') {
      console.log('пустые поля')  
    }
    else{
        let typeDistrict = document.querySelector('.select');

        const data ={ 
            table_name: "ZN",
            columns: [
                "NAIM","NAIM_SHORT", "ID_ZN_TIP","SHIROTA_LN","DOLGOTA_LN","SHIROTA_PV","DOLGOTA_PV"
            ],
            values:[
                document.getElementById('name_district').value,
                document.getElementById('name_district_short').value,
                typeDistrict.options[ typeDistrict.selectedIndex ].value,
                document.getElementById('lat_ln').value,
                document.getElementById('lon_ln').value,
                document.getElementById('lat_pv').value,
                document.getElementById('lon_pv').value
            ]
    }
    insertRow(data).then(()=>{
        document.querySelector('.district-Table thead').innerHTML='';
        document.querySelector('.district-Table tbody').innerHTML='';
        clearMap();
        createZNTable();
    });
    console.log(data)
    }
 
  }) 
  function clearMap(){
    if ( document.querySelector('.selected')) {
        document.querySelector('.selected').classList.remove('selected');
    }
    clearDistrict(geojsonLayers);
    clearDistrict(geojsonLayersAll);
    geojsonLayersAll=[];
    document.getElementById('name_district').value='';
    document.getElementById('name_district_short').value='';
    document.getElementById('lat_ln').value='';
    document.getElementById('lon_ln').value='';
    document.getElementById('lat_pv').value='';
    document.getElementById('lon_pv').value='';
  } 
document.getElementById('clearMapButton').addEventListener('click',clearMap)
// Добавление слоя на карту
// map.addLayer(geojsonLayer);
// addInteraction();