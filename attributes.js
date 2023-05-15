const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');

let links =
['https://limars.ru/vinnyj-shkaf/vinnyj-shkaf-dlya-doma/meyvel-mv08-tb1/',
'https://limars.ru/vinnyj-shkaf/vinnyj-shkaf-dlya-doma/meyvel-mv12-tb1/',
'https://limars.ru/vinnyj-shkaf/vinnyj-shkaf-dlya-doma/meyvel-mv12-tbd1/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv9-kst1/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv9-kwt1/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv19-kst1/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv19-kwt1/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv28-kst2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv28-kwt2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv46-kst2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv46pro-kst2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv46pro-kwt2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv22-ksb1/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv42-ksb2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv-77-pro-kbt2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv-99-pro-kbt2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv116-kbt2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv116-kst2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv160-kbt2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv160-kst2/',
'https://limars.ru/vinnyj-shkaf/meyvel-mv171-kbt1/'];

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
      .replace('от +5 до +20', 'От +5 до +20°C')
      .replace('от +5 до +12', 'От +5 до +12°C')
      .replace('от +12 до +20', 'От +12 до +20°C')
      .replace('от +5 до +18', 'От +5 до +18°C')
      .replace('от +5 до +10', 'От +5 до +10°C')
      .replace('от +10 до +18', 'От +10 до +18°C')
      .replace('от +8 до +18', 'От +8 до +18°C')
      .replace('Отдельностоящая,', 'Отдельностоящий')
      .replace('Отдельностоящая', 'Отдельностоящий')
      .replace('Встраиваемая,', 'Встраиваемый')
      .replace('Встраиваемая', 'Встраиваемый')
      .replace('Компрессорное', 'Компрессорный')
      .replace('Термоэлектрическое', 'Термоэлектрический')
      .replace('Макс. кол-во бутылок (бордо), шт.', 'Вместимость (бутылок)')
      .replace('Охлаждение', 'Тип охлаждения')
      .replace('Температурные зоны', 'Кол-во температурных зон')
      .replace('Установка', 'Тип установки')
      .replace('Вес нетто', 'Вес без упаковки')
      .replace('Вес брутто', 'Вес с упаковкой')
      .replace('%', '')
      .replace(', %', '')
      .replace('Размер двери, (ВxШ)', 'Размер двери (В × Ш)')
      .replace('Мин. размер ниши (ВxШxГ)', 'Минимальный размер ниши (В × Ш × Г)')
      .replace('Размер упаковки (ВxШxГ)', 'Размер упаковки (В × Ш × Г)')
      .replace('Температура', 'Диапазон температур')
      .replace('х', '×')
      .replace('х', '×')
      .replace('x', '×')
      .replace(', л', '')
      .replace(', °C', '')
      .replace(', шт', '')
      .replace(', мм', '')
      .replace(', кВт/год', '')
      .replace(', дБ', '')
      .replace(', кг', '')
      .replace(' г)', ' гр.)')
      .replace(', кВт/сутки', '')
      .replace('60-80', '60-80%')
      .replace('60 - 80', '60-80%')
      .replace('486×290×540', '486 × 290 × 540 мм')
      .trim())
        })
      })

  .catch(error => console.log('error'));
}

setTimeout(() => {
  let removeElems = [
  'Срок гарантии', '2 года',
  'Производитель', 'Meyvel', 'Meyvel (Италия)', 'MEYVEL (Италия)',
  'EAN код', 'EAN-код', '4657764560842', '4657764560842', '4657764560859', '4657764560125', '4657764560613', '4657764560132', '4657764560620', '4657764560149', '4657764560637', '4657764560712', '4657764560156', '4657764560644', '4631161257628', '4657764560705', '4657764560460', '4657764560453', '4657764560040', '4657764560040', '4657764560057', '4657764560057', '4657764560767'
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
}, '5000');

setTimeout(() => {
  let file = fs.createWriteStream('attributes.csv');
  for (let i = 0; i < attributesValues.length; i++) {
    file.write('id' + ',')
    file.write(attributesTitles[i] + ',')
    file.write(attributesValues[i] + '\n')
  }
  file.end();
}, '10000');