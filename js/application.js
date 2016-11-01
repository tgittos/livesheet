var Character = {};

function onDataChange(e){
  var attrName = e.target.id;
  Character[attrName] = $(e.target).val();
  var encoded = location.href.split("?c=")[0] + "?c=" + JSON.stringify(Character);
  console.log(encoded);
  //location.href = location.href.split("?c=")[0] + "?c=" + encoded;
}

function loadCharacter(){
  $('.data').each(function(){
    $(this).val(Character[this.id]);
  });
}

$(document).ready(function(){
  // set up listeners
  $('.data').each(function(){
    $(this).keyup(onDataChange);
  });

  // load data into app
  var encodedJSON = location.href.split("?c=")[1];
  if (encodedJSON) {
    var json = decodeURI(encodedJSON);
    Character = JSON.parse(json);
    loadCharacter();
  }
});
