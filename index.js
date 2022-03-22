const csv = require('csv-parser')
const fs = require('fs')
const csvwriter = require('csv-writer')

const json_1 = [];
const json_2 = [];

function calculateJson(json_1,json_2)
{
    json_1.map((json_1_item)=>{
        json_2.forEach((json_2_item,index)=>{
            if(json_1_item["RCSA NAME"]===json_2_item["RCSA NAME"]&&
            json_1_item["RISK NAME"]===json_2_item["RISK NAME"] &&
            (json_1_item["BUSINESS NAME"]===json_2_item["BUSINESS NAME"]||
            (json_1_item["BUSINESS NAME"]==="")))
            {
              json_2[index]={...json_2_item,"STATUS":json_1_item["STATUS"],"RSA COMMENTS":json_1_item["RSA COMMENTS"]}
            }
        })
    })

    json_2.map(item=>{
      console.log(item);  
    })
    var createCsvWriter = csvwriter.createObjectCsvWriter

    const csvWriter = createCsvWriter({
      path: 'output.csv',
      header: Object.keys(json_2[0]).map((key,index)=>{
                    return {title:key,id:key}
              })
    });

    csvWriter.writeRecords(json_2).then(()=> console.log('Data uploaded into csv successfully'));

}

function secondJson(json_1)
{
    fs.createReadStream('RSA_report_2.csv')
  .pipe(csv())
  .on('data', (data) => {
    json_2.push(data)
    })
  .on('end', () => {
    calculateJson(json_1,json_2)
  });
}

fs.createReadStream('RSA_report_1.csv')
  .pipe(csv())
  .on('data', (data) => {
    json_1.push(data)
    })
  .on('end', () => {
    secondJson(json_1)
  });