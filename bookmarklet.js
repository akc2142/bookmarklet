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
        //var intentTag
      var render = yieldbot.renderAd;
      var asyncEnabled;
      if (yieldbot.enableAsync !== 'null') {
          asyncEnabled = 'true';
        }
      var pub = yieldbot.pub();
      var init = $('script[src^="http://ads-adseast.yldbt.com"]');
      if (init !== null) {
        var split_init = init.attr('src').split('&');
        console.log(split_init);
        return split_init;
      } else {
        return "Ads weren't served";
      }
      var json_init = JSON.parse(JSON.stringify(split_init));
      var go = function() {
        if (yieldbot.go !== 'null') {
          yb_go = 'true';
        }
      }
      var slotCriteria = yieldbot.getSlotCriteria();
      var pageCriteria = yieldbot.getPageCriteria();
      var element = $('<div id="yb_box"> <div class="yb_pub">Pub ID</div>' + pub + '<div class="yb_aync">Init</div>' + asyncEnabled + '</div>');
      // append it to the body:
      $('body').append(element);
      // style it:
      element.css({
        position: 'absolute',
        top: '60px',
        right: '10px',
        width: '500px',
        height: '400px',
        backgroundColor: 'black'
      });
      console.log('it works! ' + init);
    }();
  }
})();
