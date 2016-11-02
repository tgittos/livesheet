var Character = {};

function buildCharacter(e){
  var inputType = $(e.target).attr('type');
  var attrName = e.target.id;
  if (inputType && inputType == 'checkbox') {
    Character[attrName] = $(e.target).is(':checked');
  } else {
    Character[attrName] = $(e.target).val();
  }
  Character['apiVersion'] = '1.0'
  if (!Character['apiKey']) {
    Character['apiKey'] = btoa(Character['txt_character_name']);
  }
}

function onDataChange(e){
  buildCharacter(e);
  var encoded = location.href.split("#")[0] + "#" + btoa(JSON.stringify(Character));
  location.href = encoded; 
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
  var encodedJSON = location.href.split("#")[1];
  if (encodedJSON) {
    var json = decodeURI(atob(encodedJSON));
    Character = JSON.parse(json);
    loadCharacter();
  }
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
