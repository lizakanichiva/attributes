const axios = require('axios');
const cheerio = require('cheerio');

const fs = require("fs");

let links =
['https://limars.ru/vinnyj-shkaf/meyvel-mv141pro-kbt2/',
"https://limars.ru/vinnyj-shkaf/meyvel-mv8-kst1/",
"https://limars.ru/vinnyj-shkaf/meyvel-mv8-kbt1/",
'https://limars.ru/vinnyj-shkaf/meyvel-mv18-kbt1/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv18-kst1/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv23-kbt2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv89-kbb3/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv89-ksb3/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv163-kbt2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv163-kst2/'];

let attributes = [];
let attributesTitles = [];
let attributesValues = [];

let file = fs.createWriteStream('attributes.csv');

for(let i = 0; i < links.length; i++){
  axios.get(links[i])
  .then(html => {       
    const $ = cheerio.load(html.data);
    
    $('.atr_abs').remove();
    $.html();
    
    $('.col-sm-12.col-xs-12.col-md-6').remove();
    $.html();

    $("div.col-xs-6").each((i, elem) => {
      attributes.push($(elem)
      .text()
      .replace(/(\r\n|\n|\r|\t)/gm, "")
      .replace('от +5 до +20', 'От +5 до +20°C')
      .replace('от +5 до +12', 'От +5 до +12°C')
      .replace('от +12 до +20', 'От +12 до +20°C')
      .replace('от +5 до +18', 'От +5 до +18°C')
      .replace('от +5 до +10', 'От +5 до +10°C')
      .replace('от +10 до +18', 'От +10 до +18°C')
      .replace("Отдельстоящая,", "Отдельстоящий,")
      .replace("Встраиваемая", "Встраиваемый")
      .replace('Компрессорное', 'Компрессорный')
      .replace('Макс. кол-во бутылок (бордо), шт.', "Вместимость (бутылок)")
      .replace('Охлаждение', "Тип охлаждения")
      .replace("Температурные зоны", "Кол-во температурных зон")
      .replace("Установка", "Тип установки")
      .replace("Вес нетто", "Вес без упаковки")
      .replace("Вес брутто", "Вес с упаковкой")
      .replace(", %", "")
      .replace('Размер двери, (В×Ш)', 'Размер двери (В × Ш)')
      .replace("Мин. размер ниши, (ВxШxГ)", "Мин. размер ниши (В × Ш × Г)")
      .replace('Размер упаковки, (ВxШxГ)', 'Размер упаковки (В × Ш × Г)')
      .replace("Температура", "Диапазон температур")
      .replace("х", "×")
      .replace(", л", "")
      .replace(", °C", "")
      .replace(", шт", "")
      .replace(", мм", "")
      .replace(", кВт/год", "")
      .replace(", дБ", "")
      .replace(", кг", "")
      .trim())
        })
      })

  .then(remove => {
    let removeElems = [
    'Срок гарантии', '2 года',
    "Производитель", 'Meyvel',
    'EAN код', '4657764560217', '4657764560668', '4657764560187', '4657764560200', '4657764560194', '4657764560248', '4657764560163', '4657764560163', '4657764560224', '4657764560231'
    ];
    for(let i = 0; i < attributes.length; i++){ 
      for(let a = 0; a < removeElems.length; a++){
        if (attributes[i] === removeElems[a]) { 
          attributes.splice(i, 1); 
          i--
        }
      }
    }
  })

  .then(titleAndValue => {
    for (let i = 0; i < attributes.length; i += 2) {
      attributesTitles.push(attributes[i]
        .trim()
        )
      attributes[i+1] && attributesValues.push(attributes[i + 1]);
    }
  })

  .then(csvFile => {
    for (let i = 0; i < attributesValues.length; i++) {
      file.write('id' + ',')
      file.write(attributesTitles[i] + ',')
      file.write(attributesValues[i] + '\n')
    }
  })
  .then(() => console.log(attributesTitles))
  .catch(error => console.log('error'));
}
setTimeout(() => {
  file.end();
}, "5000");