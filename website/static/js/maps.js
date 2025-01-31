"use strict"

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
pointLayer.setVisible(true);

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
    geometry: new ol.geom.Point(ol.proj.fromLonLat([80, 0], 'EPSG:4326')), // Координаты долгота и широта
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

let typeSelect = 'Square';

let draw; // global so we can remove it later
function addInteraction() {
   
    if (typeSelect !== 'None') {
      let geometryFunction;
      if (typeSelect === 'Square') {
        typeSelect = 'Circle';
        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
      } else if (typeSelect === 'Box') {
        typeSelect = 'Circle';
        geometryFunction = createBox();
      } 
      let drawSource = new ol.source.Vector();
      
      draw = new ol.interaction.Draw({
        source: drawSource,
        type: typeSelect,
        geometryFunction: geometryFunction,
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
            source: geojsonSource, // Это объект источника данных (Vector), который содержит данные GeoJSON
            
            // Задание стиля для отображения объектов на слое
            // style: new ol.style.Style({
            //     // Определение стиля для точек на слое
            //     image: new ol.style.Circle({
            //         // Радиус круга, который будет отображаться для каждой точки
            //         radius: 5, // Радиус в пикселях
                    
            //         // Заливка круга
            //         fill: new ol.style.Fill({
            //             // Задаем цвет заливки круга
            //             color: 'rgba(0, 0, 255, 0.8)' // Синий цвет с прозрачностью 0.8
            //         }),
                    
            //         // Обводка круга
            //         stroke: new ol.style.Stroke({
            //             // Задаем цвет обводки круга
            //             color: 'rgba(255, 255, 255, 0.8)', // Белая обводка с прозрачностью 0.8
            //             width: 2 // Ширина обводки
            //         }),
            //     }),
            // }),
        });
        map.addLayer(geojsonLayer);
       });
     
      console.log(draw)
      map.addInteraction(draw);
      
    }
  }
  



// Добавление слоя на карту
// map.addLayer(geojsonLayer);
addInteraction();