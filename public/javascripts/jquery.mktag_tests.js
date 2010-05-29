module('$.mktag')

test('mktag', function() {
  $.mktag('#tagTest').text("HELLO").appendTo('body');
  equals($('div#tagTest').length,1);

  $.mktag('b').text("BOLD").appendTo('#tagTest');
  equals($('#tagTest b').length, 1);

  $.mktag('a',{href: 'http://www.google.ca'}).text('Google!').appendTo('#tagTest');
  equals($('#tagTest a[href=http://www.google.ca]').length, 1);

  $.mktag('span#id1.class1.class2').text("EVERYTHING").appendTo('#tagTest');
  equals($('span#id1').length,1);
  equals($('span.class1').length,1);
  equals($('span.class2').length,1);

  $('#tagTest').remove();
});
