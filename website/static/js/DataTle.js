 export class DataTle
{
    constructor(NAIM,KOD_NORAD,TLE_CLASSIFICATION,TLE_INTERNATIONAL_CLASS,TLE_EPOCH_YEAR,TLE_EPOCH_TIME,TLE_ELEMENT_VERSION
        ,TLE_NOMER_VITKA,TLE_LINE1,TLE_CONTROL_SUM_LINE1,TLE_PERV_PROIZV,TLE_VTOR_PROIZV,TLE_KOEF_TORM,TLE_NAKLON,TLE_DOLGOTA_UZLA,TLE_ECSCENTR,
                TLE_PERICENTR,TLE_MEAN_ANOMALY,TLE_MEAN_MOTION,TLE_LINE2,TLE_CONTROL_SUM_LINE2
    ){
        this.KOD_NORAD=KOD_NORAD;
        this.TLE_CLASSIFICATION=TLE_CLASSIFICATION;
        this.TLE_INTERNATIONAL_CLASS=TLE_INTERNATIONAL_CLASS;
        this.TLE_EPOCH_YEAR=TLE_EPOCH_YEAR;
        this.TLE_EPOCH_TIME=TLE_EPOCH_TIME;
        this.TLE_ELEMENT_VERSION=TLE_ELEMENT_VERSION;
        this.TLE_NOMER_VITKA=TLE_NOMER_VITKA;
        this.TLE_LINE1=TLE_LINE1;
        this.TLE_CONTROL_SUM_LINE1=TLE_CONTROL_SUM_LINE1;
        this.TLE_PERV_PROIZV=TLE_PERV_PROIZV;
        this.TLE_VTOR_PROIZV=TLE_VTOR_PROIZV;
        this.TLE_KOEF_TORM=TLE_KOEF_TORM;
        this.TLE_NAKLON=TLE_NAKLON;
        this.TLE_DOLGOTA_UZLA=TLE_DOLGOTA_UZLA;
        this.TLE_ECSCENTR=TLE_ECSCENTR;
        this.TLE_PERICENTR=TLE_PERICENTR;
        this.TLE_MEAN_ANOMALY=TLE_MEAN_ANOMALY;
        this.TLE_MEAN_MOTION=TLE_MEAN_MOTION;
        this.TLE_LINE2=TLE_LINE2;
        this.TLE_CONTROL_SUM_LINE2=TLE_CONTROL_SUM_LINE2;
    }
    setAllTLEParam(line,count_line){
        let element='';
        let counter=0;
        let dataTLE=line;
        if (count_line==0) {
            this.TLE_LINE1=dataTLE;
            for (let i = 0; i < dataTLE.length; i++) {
                if (i==0) {
                    element+=dataTLE[i];
                    element='';
                    counter+=1;
                }
                else if (i>1 && i<7) {
                    if (i==6) {
                        element+=dataTLE[i];
                        this.KOD_NORAD=element;
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if(i==7){
                    element+=dataTLE[i];

                    this.TLE_CLASSIFICATION=element;
                    element='';
                    counter+=1;
                }
                else if (i>7 && i<15) {
                    if (i==14) {
                        element+=dataTLE[i];
                        this.TLE_INTERNATIONAL_CLASS=(element);
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>17 && i<20) {
                    if (i==19) {
                        element+=dataTLE[i];
                        this.TLE_EPOCH_YEAR=Number(element);
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>19 && i<32) {
                    if (i===31) {
                        element+=dataTLE[i];
                        this.TLE_EPOCH_TIME=+(element);
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>32 && i<43) {
                    // console.log(element,i)
                    if (i==42) {
                        element+=dataTLE[i];

                        let correctElem

                        if (element[0]==' ') {
                            correctElem=element.replace(/\s/,'0');
                        }
                        this.TLE_PERV_PROIZV=+correctElem;
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>43 && i<53) {
                    if (i==52) {
                        let correctElem='';
                        let num='',degree='';
                        if (element[0]==' ') {
                            correctElem=element.replace(/\s/,'0');
                            let indexDegree=element.search(/[-+]/);

                            for (let i = 0; i < indexDegree; i++) {
                                num+=correctElem[i];
                            }

                            for (let index = indexDegree; index < correctElem.length; index++) {
                                degree += correctElem[index];

                            }
                        }
                        element+=dataTLE[i];
                        this.TLE_VTOR_PROIZV=Math.pow(+num,+degree);
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>52 && i<62) {
                    if (i==61) {
                        let correctElem='';
                        let num='',degree='';
                        if (element[0]==' ') {
                            correctElem=element.replace(/\s/,'0.');
                            // console.log(element)
                            let indexDegree=correctElem.search(/[-+]/);
                            for (let i = 0; i < indexDegree; i++) {
                                num+=correctElem[i];
                            }
                            for (let index = indexDegree; index < correctElem.length; index++) {
                                degree += correctElem[index];
                            }
                        }
                        element+=dataTLE[i];
                        this.TLE_KOEF_TORM=num*Math.pow(10,+degree);
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i==62) {
                    element+=dataTLE[i];
                    element='';
                    counter+=1;
                }
                else if (i>63 && i<68) {
                    if (i==67) {
                        element+=dataTLE[i];
                        this.TLE_ELEMENT_VERSION=+element;
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i==68) {
                    element+=dataTLE[i];
                    this.TLE_CONTROL_SUM_LINE1=+element;
                    element='';
                    counter+=1;

                }

            }
        }
        else if (count_line==1) {
            this.TLE_LINE2=dataTLE;
            for (let i = 0; i < dataTLE.length; i++) {
                if (i==0) {
                    element+=dataTLE[i];
                    element='';
                    counter+=1;
                }
                else if (i>1 && i<7) {
                    if (i==6) {
                        element+=dataTLE[i];
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>8 && i<16) {
                    if (i==15) {
                        element+=dataTLE[i];
                        this.TLE_NAKLON=+element;
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>16 && i<25) {
                    if (i==24) {
                        element+=dataTLE[i];
                        this.TLE_DOLGOTA_UZLA=+element;
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>25 && i<33) {
                    if (i==32) {
                        element+=dataTLE[i];
                        this.TLE_ECSCENTR=Number('0.'+element);
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>33 && i<42) {
                    if (i==41) {
                        element+=dataTLE[i];
                        this.TLE_PERICENTR=+element;
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>42 && i<51) {
                    if (i==50) {
                        element+=dataTLE[i];
                        this.TLE_MEAN_ANOMALY=+element;
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>51 && i<61) {
                    if (i==60) {
                        element+=dataTLE[i];
                        this.TLE_MEAN_MOTION=+element;
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i>62 && i<68) {
                    if (i==67) {
                        element+=dataTLE[i];
                        this.TLE_NOMER_VITKA=+element;
                        element='';
                        counter+=1;
                    }
                    else{
                        element+=dataTLE[i];
                    }
                }
                else if (i==68) {
                    element+=dataTLE[i];
                    this.TLE_CONTROL_SUM_LINE2=+element;
                    element='';
                    counter+=1;
                }
            }
        }
    }
    toTLEFormat(number) {
        // Для 0.00029538 нужно получить 29538-3
        // Это означает: 0.29538 × 10^-3

        // Шаг 1: Находим множитель чтобы получить число от 0.1 до 0.99999
        let temp = number;
        let exponent = 0;

        while (Math.abs(temp) < 0.1 && temp !== 0) {
            temp *= 10;
            exponent--;
        }

        // Для 0.00029538:
        // ×10 = 0.0029538 (exp = -1)
        // ×10 = 0.029538 (exp = -2)
        // ×10 = 0.29538 (exp = -3) ← остановились

        // Шаг 2: Умножаем на 100000 чтобы получить 5 цифр
        let numericPart = Math.round(temp * 100000);
        let numericStr = numericPart.toString().padStart(5, '0');

        return ` ${numericStr}${exponent}`;
    }
    getAllTLEAsString() {
        // Формируем первую строку TLE
        let line1 = "";

        // Поле 1: Номер строки (фиксированное значение)
        line1 += "1 ";

        // Поле 2: Код NORAD (5 цифр) + U (классификация)
        line1 += `${this.KOD_NORAD.toString().padStart(5, "0")}${this.TLE_CLASSIFICATION}`;

        line1+=`${this.TLE_INTERNATIONAL_CLASS}   `
        // Поле 4: Год эпохи (2 цифры) и время эпохи (12 цифр с точкой)
        const year = this.TLE_EPOCH_YEAR.toString();
        const epochTime = this.TLE_EPOCH_TIME.toFixed(8).padStart(12, "0");
        line1 += year + epochTime + " ";

        // Поле 5: Первая производная (.XXXXXXXX формат)
        let pervProizvStr = "";
        if (this.TLE_PERV_PROIZV !== undefined && this.TLE_PERV_PROIZV !== null) {
            const num = Math.abs(this.TLE_PERV_PROIZV);
            pervProizvStr = (this.TLE_PERV_PROIZV >= 0 ? " ." : "-.") +
                num.toFixed(8).substring(2).padEnd(8, "0");
        } else {
            pervProizvStr = " .00000000";
        }
        line1 += pervProizvStr.substring(0, 10) + "  ";

        // Поле 6: Вторая производная (00000+0 формат)
        let vtorProizvStr = "";
        if (this.TLE_VTOR_PROIZV !== undefined && this.TLE_VTOR_PROIZV !== null && this.TLE_VTOR_PROIZV !== 1) {
            // Преобразуем обратно в экспоненциальный формат
            const absValue = Math.abs(this.TLE_VTOR_PROIZV);
            const exponent = Math.floor(Math.log10(absValue));
            const mantissa = absValue / Math.pow(10, exponent);

            const sign = this.TLE_VTOR_PROIZV >= 0 ? "+" : "-";
            vtorProizvStr = Math.round(mantissa * 100000).toString().padStart(5, "0") +
                sign +
                Math.abs(exponent).toString().padStart(2, "0");
        } else {
            vtorProizvStr = "00000+0";
        }
        line1 += vtorProizvStr.substring(0, 7) + " ";

        // Поле 7: Коэффициент торможения (XXXXX-X формат)
        let koefTormStr = "";
        if (this.TLE_KOEF_TORM !== undefined && this.TLE_KOEF_TORM !== null) {
            koefTormStr=this.toTLEFormat(this.TLE_KOEF_TORM)
            console.log('koefTormStr',koefTormStr)
        } else {
            koefTormStr = "00000-0";
        }
        line1 += koefTormStr + " ";

        // Поле 8: Тип эфемерид (0) и номер элемента (999)
        line1 += "0  ";
        line1 += (this.TLE_ELEMENT_VERSION || "999").toString().padStart(3, "0");

        // Поле 9: Контрольная сумма
        line1 += (this.TLE_CONTROL_SUM_LINE1 || "0").toString();

        // Формируем вторую строку TLE
        let line2 = "";

        // Поле 1: Номер строки
        line2 += "2 ";

        // Поле 2: Код NORAD
        line2 += this.KOD_NORAD.toString().padStart(5, "0") + " ";

        // Поле 3: Наклонение (XXX.XXXX формат)
        line2 += (this.TLE_NAKLON || "0").toFixed(4).padStart(8, " ") + " ";

        // Поле 4: Долгота восходящего узла (XXX.XXXX формат)
        line2 += (this.TLE_DOLGOTA_UZLA).toFixed(4).padStart(8, "0") + " ";

        // Поле 5: Эксцентриситет (.XXXXXXX формат)
        let ecscentrStr = "";
        if (this.TLE_ECSCENTR !== undefined && this.TLE_ECSCENTR !== null) {
            ecscentrStr = this.TLE_ECSCENTR.toFixed(7).substring(2); // убираем "0."
            ecscentrStr =ecscentrStr.padEnd(7, "0");
        } else {
            ecscentrStr = "0000000";
        }
        line2 += ecscentrStr.substring(0, 8) + " ";

        // Поле 6: Аргумент перицентра (XXX.XXXX формат)
        line2 += (this.TLE_PERICENTR || "0").toFixed(4).padStart(8, " ") + " ";

        // Поле 7: Средняя аномалия (XXX.XXXX формат)
        line2 += (this.TLE_MEAN_ANOMALY || "0").toFixed(4).padStart(8, " ") + " ";

        // Поле 8: Среднее движение (XX.XXXXXXXX формат)
        line2 += (this.TLE_MEAN_MOTION || "0").toFixed(8).padStart(11, " ") + " ";

        // Поле 9: Номер витка
        line2 += (this.TLE_NOMER_VITKA || "0000").toString().padStart(4, "0");

        // Поле 10: Контрольная сумма
        line2 += (this.TLE_CONTROL_SUM_LINE2 || "0").toString();

        this.TLE_LINE1 = line1;
        this.TLE_LINE2 = line2;
            // line1: line1,
            // line2: line2
            //
    }
    generateTLEFromParams() {
        // Формирование первой строки TLE
        let line1 = "1 ";

        // NORAD ID (позиции 3-7)
        let norad = this.KOD_NORAD.toString().padStart(5, '0');
        line1 += norad + this.TLE_CLASSIFICATION + " ";

        // Международное обозначение (позиции 9-17)
        let intClass = (this.TLE_INTERNATIONAL_CLASS || "").padEnd(8, ' ');
        line1 += intClass.substring(0, 8);

        // Пробелы и год эпохи с временем (позиции 19-32)
        let epochYear = (this.TLE_EPOCH_YEAR || 0).toString();
        let epochDay = Math.floor(this.TLE_EPOCH_TIME || 0).toString();
        let epochFraction = ((this.TLE_EPOCH_TIME || 0) % 1).toFixed(8).substring(2);
        line1 += "   " + epochYear.padStart(2, '0') + epochDay.padStart(3, '0') + "." + epochFraction.padEnd(8, '0') + " ";

        // Первая производная (позиции 34-43)
        let pervProizv = (this.TLE_PERV_PROIZV || 0);
        let pervFormatted = " ." + Math.abs(pervProizv).toFixed(8).substring(2).padStart(8, '0');
        line1 += pervFormatted + " ";

        // Вторая производная (позиции 45-52)
        line1 += "00000+0 ";

        // Коэффициент торможения (позиции 54-61)
        line1 += "29538-3 ";

        // Эпоха революции и версия элементов (позиции 63-68)
        line1 += "0 " + this.TLE_ELEMENT_VERSION.toString();

        // Контрольная сумма для строки 1
        line1 += this.TLE_CONTROL_SUM_LINE1.toString();

        this.TLE_LINE1 = line1;

        // Формирование второй строки TLE
        let line2 = "2 ";

        // NORAD ID (позиции 3-7)
        line2 += norad + "  ";

        // Наклонение (позиции 9-16)
        let naklon = (this.TLE_NAKLON || 0).toFixed(4);
        line2 += naklon.padStart(8, ' ') + " ";

        // Долгота восходящего узла (позиции 18-25)
        let dolgota = (this.TLE_DOLGOTA_UZLA || 0).toFixed(4);
        line2 += dolgota.padStart(8, ' ') + " ";

        // Эксцентриситет (позиции 27-33)
        let ecscentr = ((this.TLE_ECSCENTR || 0) * 10000000).toFixed(0);
        line2 += ecscentr.padStart(7, '0') + " ";

        // Аргумент перицентра (позиции 35-42)
        let pericentr = (this.TLE_PERICENTR || 0).toFixed(4);
        line2 += pericentr.padStart(8, ' ') + " ";

        // Средняя аномалия (позиции 44-51)
        let meanAnomaly = (this.TLE_MEAN_ANOMALY || 0).toFixed(4);
        line2 += meanAnomaly.padStart(8, ' ') + " ";

        // Среднее движение (позиции 53-63)
        let meanMotion = (this.TLE_MEAN_MOTION || 0).toFixed(8);
        line2 += meanMotion.padStart(11, ' ');

        // Номер витка (позиции 64-68)
        line2 += this.TLE_NOMER_VITKA.toString();

        // Контрольная сумма для строки 2
        line2 += this.TLE_CONTROL_SUM_LINE2.toString();

        this.TLE_LINE2 = line2;

        return {
            line1: this.TLE_LINE1,
            line2: this.TLE_LINE2
        };
    }
// Метод для инициализации из JSON объекта
     static fromJSON(json) {
         return new DataTle(
             json.NAIM,
             json.KOD_NORAD,
             json.TLE_CLASSIFICATION,
             json.TLE_INTERNATIONAL_CLASS,
             json.TLE_EPOCH_YEAR,
             json.TLE_EPOCH_TIME,
             json.TLE_ELEMENT_VERSION,
             json.TLE_NOMER_VITKA,
             "", // TLE_LINE1
             json.TLE_CONTROL_SUM_LINE1, // Используем переданное значение
             json.TLE_PERV_PROIZV,
             json.TLE_VTOR_PROIZV,
             json.TLE_KOEF_TORM,
             json.TLE_NAKLON,
             json.TLE_DOLGOTA_UZLA,
             json.TLE_ECSCENTR,
             json.TLE_PERICENTR,
             json.TLE_MEAN_ANOMALY,
             json.TLE_MEAN_MOTION,
             "", // TLE_LINE2
             json.TLE_CONTROL_SUM_LINE2  // Используем переданное значение
         );
     }
}