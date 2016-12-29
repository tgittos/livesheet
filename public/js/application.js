function writeToDatabase(c) {
  $.post("/character", { apiKey: c['apiKey'], data: JSON.stringify(c) });
}

function buildCharacter(e){
  var sheetType = getSheetType();
  var inputType = $(e.target).attr('type');
  var attrName = e.target.id;
  if (!Character[sheetType]) { Character[sheetType] = {}; }
  if (inputType && inputType == 'checkbox') {
    Character[sheetType][attrName] = $(e.target).is(':checked');
  } else {
    Character[sheetType][attrName] = $(e.target).val();
  }
  Character['apiVersion'] = '1.1'
  Character['sheetType'] = getSheetType(); 
  writeToDatabase(Character);
}

function onDataChange(e){
  buildCharacter(e);
  if(Character['txt_character_name']) {
    document.title = "Livesheet - " + Character['txt_character_name'];
  }
}

function loadCharacter(){
  var sheetType = getSheetType();
  console.log('loading character for', sheetType);
  $('.data').each(function(){
    var inputType = $(this).attr('type');
    if (inputType && inputType == 'checkbox') {
      if (Character[sheetType] &&
          Character[sheetType][this.id]) {
        $(this).attr('checked', 'checked');
      }
    } else {
      if (Character[sheetType] &&
          Character[sheetType][this.id]) {
        $(this).val(Character[sheetType][this.id]);
      }
    }
  });
  if(Character[sheetType] && Character[sheetType]['txt_character_name']) {
    document.title = "Livesheet - " + Character[sheetType]['txt_character_name'];
  }
}

function getSheetType() {
  return $('#sheetSelector select').val();
}

function migrateToLatest(){
  var sheetType = getSheetType();
  Character['apiVersion'] = '1.1';
  var newObj = {};
  console.log('migration character:', Character);
  for (var k in Character) {
    if (Character.hasOwnProperty(k) &&
        k !== 'apiKey' &&
        k !== 'apiVersion') {
      newObj[k] = Character[k];
      delete Character[k];
    }
  }
  Character[sheetType] = newObj;
  writeToDatabase(Character);
}

function loadData(){
  if (!Character) {
    var apiKey = location.href.split("/")[1];
    if (apiKey) {
      $.getJSON('/character/' + apiKey, function(success){
        var json = success["charData"];
        Character = JSON.parse(json);
      });
    }
  }
  if (Character['apiVersion'] !== '1.1') {
    console.log('migrating character up to 1.1');
    migrateToLatest();
  }
  console.log('character:', Character);
  loadCharacter();
}

$(document).ready(function(){
  // set up listeners
  $('.data').each(function(){
    var inputType = $(this).attr('type');
    $(this).keyup(onDataChange);
    if(inputType && inputType == 'checkbox') {
      $(this).change(onDataChange);
    }
  });

  $('#sheetSelector').on('change', function(e){
    var sheetType = $(e.target).val();
    window.location = '/' + sheetType + '/' + Character['apiKey'];
  });

  // load data into app
  loadData();
});
