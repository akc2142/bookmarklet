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
    /*  window.onbeforeunload = function() {
          return "Are you sure you want to leave? Think of the kittens!";
        } */
      // Define all future variables in one step
      var asyncEnabled, ybGo, pairs;
      var intentTagSrc = $('script[src*="//cdn.yldbt.com/js/yieldbot.intent.js"]').attr('src');
      var intentTagAsync = $('script[src*="//cdn.yldbt.com/js/yieldbot.intent.js"]').attr('async');
      if (undefined === intentTagSrc ) {
        intentTag = 'not loaded. FATAL ERROR.';
      }
      else {
          pub = yieldbot.pub(); // Retrieve pub ID
          intentTag = 'loaded';
          if (typeof yieldbot.go !== 'undefined') {
              ybGo = ' and activated';
          }
          // Check if async is enabled
          if (true === intentTagAsync) {
              asyncEnabled = 'enabled';
            } else {
              asyncEnabled = 'not enabled';
            }
        }
      //Checking to see if the YB init and DFP scripts are fired; need to come back to DFP
      var init = $('script[src*="init?cb=yieldbot.updateState"]').attr('src');
      var dfp = $('script[src^="https://securepubads.g.doubleclick.net/"]').attr('src');
      if (undefined !== dfp) {
        dfpLoaded = 'loaded';
      } else {
        dfpLoaded = 'not loaded';
      }
      //Parsing the script's GET parameters
      function queryStringToJSON() {
        var pairs = init.split('&');
        var result = {};
        pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
      });
      return JSON.stringify('results' + result);
      }
      //Splitting up the slot sizes and names sent in GET
      var splitInit = queryStringToJSON();
      var splitInit = JSON.parse(splitInit);
      console.log('split init' + splitInit);
      //Retrieve PVI
      var pvi = splitInit.pvi;
      var slots = JSON.stringify(splitInit.sn);
      var splitSlots = JSON.parse(slots.split('|'));
      console.log('split slots' + splitSlots);
      var sizes = JSON.stringify(splitInit.ssz);
      var splitSizes = JSON.parse(sizes.split('|'));
      console.log(sizes + splitSizes);
      //To compare ^ to the system's slot names via API

      //console.log(slotNames);
      var render = yieldbot.renderAd;

      var slotCriteria = yieldbot.getSlotCriteria();
      var pageCriteria = yieldbot.getPageCriteria();

      var element = $('<div id="yb_box"> <span style="font-size: 20px; color: #66CC00;"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"> theKRAKEN </span><div class="yb_div"> Intent tag is: <span style="color:#66CC00; font-weight: normal;">' + intentTag + ybGo + '</span></div><div class="yb_div"> PVI is: <span style="color:#66CC00; font-weight: normal;">' + pvi + '</span></div> <div class="yb_div"> Async is: <span style="color:#66CC00; font-weight: normal;">' + asyncEnabled + '</span></div><div class="yb_div"> Pub ID is: <span style="color:#66CC00; font-weight: normal;">' + pub + '</span> <a style="color: #66CC00!important; font-size: 12px; font-weight: normal;" href="https://ui.yieldbot.com/ui/meow/publisher/'+pub+'"> take me to Meow </a></div><div class="yb_div"> :<span style="color:#66CC00; font-weight: normal;">' + '</div><div id="psn_info"></div></div>');
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
      //var url = 'https://dev.yieldbot.com:443/v2/config/publisher/'+pub;
    /*  var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId%3A%20ffd8&format=json'
        $.ajax({
        url: url,
        dataType: 'jsonp',
        type: 'GET',
      }); */

      var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId%3A%20ffd8&format=json'
      $.getJSON(url, function(json) {
        var config = { "Display Name is " : json.display_name,
        "CPM is " : json.cpm,
        "Is ad serving enabled? " : json.ad_serving_enabled,
        "Site URL is " : json.base_site,
        "Is it mobile? " : json.is_mobile
      };
        var items = [];
        $.each(config, function(key, val) {
        items.push( '<li id="info">' + key + ' ' + val + '</li>' );
      });
        $('<ul/>', {
        'id': 'pub_info',
        html: items.join('')
      }).appendTo('#psn_info');
      });
      console.log('it works! ');
    }();
  }
})();
