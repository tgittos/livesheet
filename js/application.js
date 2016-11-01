var Character = {};

function onDataChange(e){
  var inputType = $(e.target).attr('type');
  var attrName = e.target.id;
  if (inputType && inputType == 'checkbox') {
    Character[attrName] = $(e.target).is(':checked');
  } else {
    Character[attrName] = $(e.target).val();
  }
  Character['apiVersion'] = '1.0'
  var encoded = location.href.split("#")[0] + "#" + btoa(JSON.stringify(Character));
  location.href = encoded; 
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
