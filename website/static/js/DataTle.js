 export class DataTle
{
    constructor(ID,NAIM,NAIM_RUS,KOD_NORAD,TLE_CLASSIFICATION,TLE_NAME,TLE_INTERNATIONAL_CLASS,TLE_EPOCH_YEAR,TLE_EPOCH_TIME,TLE_ELEMENT_VERSION
        ,TLE_NOMER_VITKA,TLE_LINE1,TLE_CONTROL_SUM_LINE1,DATA_BEG,TLE_PERV_PROIZV,TLE_VTOR_PROIZV,TLE_KOEF_TORM,TLE_NAKLON,TLE_DOLGOTA_UZLA,TLE_ECSCENTR,
                TLE_PERICENTR,TLE_MEAN_ANOMALY,TLE_MEAN_MOTION,TLE_LINE2,TLE_CONTROL_SUM_LINE2
    ){
        this.ID=ID;
        this.NAIM=NAIM;
        this.NAIM_RUS=NAIM_RUS;
        this.KOD_NORAD=KOD_NORAD;
        this.TLE_CLASSIFICATION=TLE_CLASSIFICATION;
        this.TLE_NAME=TLE_NAME;
        this.TLE_INTERNATIONAL_CLASS=TLE_INTERNATIONAL_CLASS;
        this.TLE_EPOCH_YEAR=TLE_EPOCH_YEAR;
        this.TLE_EPOCH_TIME=TLE_EPOCH_TIME;
        this.TLE_ELEMENT_VERSION=TLE_ELEMENT_VERSION;
        this.TLE_NOMER_VITKA=TLE_NOMER_VITKA;
        this.TLE_LINE1=TLE_LINE1;
        this.TLE_CONTROL_SUM_LINE1=TLE_CONTROL_SUM_LINE1;
        this.DATA_BEG=DATA_BEG;
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
        console.log(line);
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
                        this.TLE_KOEF_TORM=Math.pow(+num,+degree);
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
}