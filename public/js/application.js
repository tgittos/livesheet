function writeToDatabase(c) {
  $.post("/character", { apiKey: c['apiKey'], data: JSON.stringify(c) });
}

function buildCharacter(e){
  var inputType = $(e.target).attr('type');
  var attrName = e.target.id;
  if (inputType && inputType == 'checkbox') {
    Character[attrName] = $(e.target).is(':checked');
  } else {
    Character[attrName] = $(e.target).val();
  }
  Character['apiVersion'] = '1.0'
  writeToDatabase(Character);
}

function onDataChange(e){
  buildCharacter(e);
  if(Character['txt_character_name']) {
    document.title = "Livesheet - " + Character['txt_character_name'];
  }
}

function loadCharacter(){
  $('.data').each(function(){
    var inputType = $(this).attr('type');
    if (inputType && inputType == 'checkbox') {
      if (Character[this.id]) {
        $(this).attr('checked', 'checked');
      }
    } else {
      $(this).val(Character[this.id]);
    }
  });
  if(Character['txt_character_name']) {
    document.title = "Livesheet - " + Character['txt_character_name'];
  }
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

  // load data into app
  loadData();
});
