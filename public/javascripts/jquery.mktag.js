jQuery.mktag = function(tagName, properties) {
  var tagType = tagName.match(/^[^\.#]*/)[0];
  if (tagType === null || tagType.length == 0) {
    tagType = 'div';
  }
  var tag = $(document.createElement(tagType));
  var tagId = tagName.match(/#[^\.]*/);
  if (tagId !== null) {
    tag.attr('id',tagId[0].substr(1));
  }

  var tagClasses = tagName.match(/\.[^\.#]*/g);
  if (tagClasses !== null) {
    for (x in tagClasses) {
      tag.addClass(tagClasses[x].substr(1));
    }
  }

  if (properties !== 'undefined') {
    for (prop in properties) {
      tag.attr(prop,properties[prop]);
    }
  }
  return tag;
}
