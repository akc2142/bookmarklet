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
      var asyncEnabled, ybGo, pairs;
      var pub = yieldbot.pub(); // Retrieve pub ID
      // Check if async is enabled
      if (yieldbot.enableAsync !== null) {
          asyncEnabled = 'enabled';
        } else {
          asyncEnabled = 'not enabled';
        }
      var init = $('script[src^="http://ads-adseast.yldbt.com"]').attr('src');
      var dfp = $('script[src^="https://securepubads.g.doubleclick.net/"]').getAttribute('src');
      if (dfp !== null) {
        dfpLoaded = 'loaded';
      } else {
        dfpLoaded = 'not loaded';
      }
      function queryStringToJSON() {
        if (init !== undefined) {
          var pairs = $('script[src^="http://ads-adseast.yldbt.com"]').attr('src').split('&');
        } else {
          var pairs = $('script[src^="http://i.yldbt.com"]').attr('src').split('&');
        }
        var result = {};
        pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
      });
      return JSON.stringify(result);
      }
      var splitInit = queryStringToJSON();
      var splitInit = JSON.parse(splitInit);
      console.log(splitInit);
      var pvi = splitInit.pvi;
      var slots = JSON.stringify(splitInit.sn);
      var splitSlots = slots.split('|');
      var parseSlots = JSON.parse(splitSlots);
      console.log(splitSlots);
      var sizes = JSON.stringify(splitInit.ssz);
      var splitSizes = JSON.parse(sizes.split('|'));
      console.log(sizes + splitSizes);

      //console.log(slotNames);
      var render = yieldbot.renderAd;
      if (yieldbot.go !== null) {
          ybGo = 'true';
      }
      var slotCriteria = yieldbot.getSlotCriteria();
      var pageCriteria = yieldbot.getPageCriteria();

      var element = $('<div id="yb_box"> <span style="font-size: 20px; color: #66CC00;"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"> theKRAKEN </span> <div class="yb_div"> PVI is: <span style="color:#66CC00; font-weight: normal;">' + pvi + '</span></div> <div class="yb_div"> Async is enabled: ' + asyncEnabled + '</div> <div class="yb_div"> Intent tag is loaded: ' + ybGo + '</div> <div class="yb_div"> Pub ID: ' + pub + '<a style="color: #66CC00!important; font-size: 12px; font-weight: normal;" href="https://ui.yieldbot.com/ui/meow/publisher/'+pub+'"> take me to Meow </a></div><div class="yb_div">' + '</div>');
      // append it to the body:
      $('body').append(element);
      // style it:
      element.css({
        position: 'fixed',
        top: '0',
        right: '0',
        width: '500px',
        height: '400px',
        color: 'white',
        padding: '0 0 0 3%',
        fontWeight: 'bold',
        zIndex: '999999',
        fontSize: '16px',
        backgroundColor: 'rgba(25,0,51,.85)',
      });
      console.log('it works! ');
    }();
  }
})();
