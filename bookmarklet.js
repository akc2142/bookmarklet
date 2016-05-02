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
      // Stop automatic page reload
      window.onbeforeunload = function() {
          return "Are you sure you want to leave? Think of the kittens!";
        }
      // Define all future variables in one step
      var asyncEnabled, ybGo;
      var pub = yieldbot.pub(); // Retrieve pub ID
      // Check if async is enabled
      if (yieldbot.enableAsync !== 'null') {
          asyncEnabled = 'true';
        }

      var init = $('script[src^="http://ads-adseast.yldbt.com"]').attr('src');

      if (init !== undefined) {
        var splitInit = init.split('&');
        console.log(splitInit);
      } else {
        var unavailable = 'No ads loaded';
      }
    
      var render = yieldbot.renderAd;
      if (yieldbot.go !== null) {
          ybGo = 'true';
      }
      var slotCriteria = yieldbot.getSlotCriteria();
      var pageCriteria = yieldbot.getPageCriteria();
      var element = $('<div id="yb_box"> <div class="yb_pub">Pub ID is: </div>' + pub + '<div class="yb_async">Async is enabled: </div>' + asyncEnabled + '</div> <div class="yb_intent">Intent tag is loaded: </div>' + ybGo + '</div> </div> <div class="yb_ads"> </div>' + ybGo + '</div>' + unavailable);
      // append it to the body:
      $('body').append(element);
      // style it:
      element.css({
        position: 'absolute',
        top: '60px',
        right: '10px',
        width: '500px',
        height: '400px',
        backgroundColor: 'rgba(0,0,0,.75)',
      });
      console.log('it works! ');
    }();
  }
})();
