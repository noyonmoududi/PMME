const XLSX = require('xlsx');


exports.readSheet = (filePath,sheetNumber=0) =>{
    let workbook = XLSX.readFile(filePath);

    let first_sheet_name = workbook.SheetNames[sheetNumber];

    /* Get worksheet */
    let worksheet = workbook.Sheets[first_sheet_name];

    let result = [];
    let row;
    let rowNum;
    let colNum;
    let range = XLSX.utils.decode_range(worksheet['!ref']);
    for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
        row = [];
        for(colNum=range.s.c; colNum<=range.e.c; colNum++){
            let nextCell = worksheet[
                XLSX.utils.encode_cell({r: rowNum, c: colNum})
                ];

            if( typeof nextCell === 'undefined' ){
                row.push(void 0);
            } else{
                if(nextCell.w){
                    row.push(nextCell.w);
                }else{
                    row.push(nextCell.v);
                }

            }
        }
        result.push(row);
    }
    return result;
};