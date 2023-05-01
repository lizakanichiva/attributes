const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');

let links =
['https://limars.ru/sejfy/meyvel-sf5-310-200/',
'https://limars.ru/sejfy/meyvel-sf5-350-250/',
'https://limars.ru/sejfy/meyvel-sf5-430-195/',
'https://limars.ru/sejfy/meyvel-sf8-430-195/',
'https://limars.ru/sejfy/meyvel-sf9-480-150-drawer/',
'https://limars.ru/sejfy/meyvel-sf8-430-195-white/',
'https://limars.ru/sejfy/meyvel-sf10-450-200-drawer/',
'https://limars.ru/sejfy/meyvel-sf3-430-200/',
'https://limars.ru/sejfy/sejf-vstraivaemyj-safe-10-box/',
'https://limars.ru/sejfy/sejf-safe-10-plus-smart/',
'https://limars.ru/sejfy/sejf-vstraivaemyj-safe-30-box/',
'https://limars.ru/sejfy/sejf-vstraivaemyj-safe-30-easy/',
'https://limars.ru/sejfy/sejf-safe-30-p-plus-smart/',
'https://limars.ru/sejfy/sejf-safe-30-plus-smart/',
'https://limars.ru/sejfy/sejf-safe-35-plus-smart/'
];

let attributes = [];
let attributesTitles = [];
let attributesValues = [];

for(let i = 0; i < links.length; i++){
  axios.get(links[i])
  .then(html => {       
    const $ = cheerio.load(html.data);
    
    $('.atr_abs').remove();
    $.html();
    
    $('.col-sm-12.col-xs-12.col-md-6').remove();
    $.html();

    $('div.col-xs-6').each((i, elem) => {
      attributes.push($(elem)
      .text()
      .replace(/(\r\n|\n|\r|\t)/gm, '')
      .replace('Установка', 'Тип установки')
      .replace('Вес нетто, кг', 'Вес без упаковки')
      .replace('Вес брутто, кг', 'Вес с упаковкой')
      .replace('Размер упаковки (ВxШxГ)', 'Габариты в упаковке (В × Ш × Г)')
      .replace('х', '×')
      .replace('х', '×')
      .replace(', л', '')
      .replace(', мм', '')
      .trim())
        })
      })

  .catch(error => console.log('error'));
}

setTimeout(() => {
  let removeElems = [
  'Срок гарантии', '1 год',
  'Срок гарантии', '2 года',
  'Производитель', 'Meyvel',
  'Производитель', 'Indel B',
  'EAN код', '4657764560255', '4657764560262', '4657764560279', '4657764560286', '4657764560309', '4657764560293', '4657764560316', '4657764560354'
  ];
  for(let i = 0; i < attributes.length; i++){ 
    for(let a = 0; a < removeElems.length; a++){
      if (attributes[i] === removeElems[a]) { 
          attributes.splice(i, 1); 
          i--
      }
    }
  }

  for (let i = 0; i < attributes.length; i += 2) {
    attributesTitles.push(attributes[i])
    attributes[i+1] && attributesValues.push(attributes[i + 1]);
  }

  attributesValues.unshift('value')
  attributesTitles.unshift('title')

 console.log(attributes);
 console.log(attributesValues);
 console.log(attributesTitles);
}, '10000');

setTimeout(() => {
  let file = fs.createWriteStream('attributes.csv');
  for (let i = 0; i < attributesValues.length; i++) {
    file.write('id' + ',')
    file.write(attributesTitles[i] + ',')
    file.write(attributesValues[i] + '\n')
  }
  file.end();
}, '15000');