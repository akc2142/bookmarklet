(function() {
  // the minimum version of jQuery we want
  var v = '1.3.2';
  if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    var done = false;
    var script = document.createElement('script');
    script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/' + v +
      '/jquery.min.js';
    script.onload = script.onreadystatechange = function() {
      if (!done && (!this.readyState || this.readyState == 'loaded' || this
        .readyState == 'complete')) {
        done = true;
        releaseTheKraken();
      }
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  } else {
    releaseTheKraken();
  }

  function releaseTheKraken() {
    window.theKraken = function() {
      window.onbeforeunload = function() {
          return "Are you sure you want to leave? Think of the kittens!";
        }
        // create the element:
      var element = $('<div id="yb_box"></div>');
      // append it to the body:
      $('body').append(element);
      // style it:
      element.css({
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '200px',
        height: '90px',
        backgroundColor: 'black'
      });
      var outterDiv = document.createElement('div');
      console.log('it works!');
    }();
  }
})();
