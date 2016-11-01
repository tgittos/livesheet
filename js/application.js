var Character = {};

function onDataChange(e){
  var inputType = $(e.target).attr('type');
  var attrName = e.target.id;
  if (inputType && inputType == 'checkbox') {
    Character[attrName] = $(e.target).is(':checked');
  } else {
    Character[attrName] = $(e.target).val();
  }
  var encoded = location.href.split("?c=")[0] + "?c=" + JSON.stringify(Character);
  console.log(encoded);
  //location.href = location.href.split("?c=")[0] + "?c=" + encoded;
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
  var encodedJSON = location.href.split("?c=")[1];
  if (encodedJSON) {
    var json = decodeURI(encodedJSON);
    Character = JSON.parse(json);
    loadCharacter();
  }
});
