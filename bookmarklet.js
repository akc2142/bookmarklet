function execute() {
  function receive(json) {
    console.log(json);
    var configPub = {
      "Display Name is ": json.display_name,
      "CPM is ": json.cpm,
      "Is ad serving enabled? ": json.ad_serving_enabled,
      "Site URL is ": json.base_site,
      "Is it mobile? ": json.is_mobile,
    };
    var items = [];
    $.each(configPub, function(key, val) {
      items.push('<li id="info">' + key + ' ' + val + '</li>');
    });
    $('<ul/>', {
      'id': 'pub_info',
      html: items.join('')
    }).appendTo('#psn_info');
  }

  function receivead(jsonads) {
      console.log(jsonads);
      var configAds = {
        "Adslots name ": jsonads.name,
        "Adslot sizes ": jsonads.dimensions,
      };
      var items = [];
      $.each(configAds, function(key, val) {
        items.push('<li id="info">' + key + ' ' + val + '</li>');
      });
      $('<ul/>', {
        'id': 'pub_info',
        html: items.join('')
      }).appendTo('#psn_info');
    }
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
      if (undefined === intentTagSrc) {
        intentTag = 'not loaded. FATAL ERROR.';
      } else {
        pub = yieldbot.pub(); // Retrieve pub ID
        intentTag = 'loaded';
        if (true === yieldbot._initialized) {
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
      var initTimeout = yieldbot.getInitTimeout();
      if (4000 <= initTimeout) {
        timeout = 'It took longer than 4sec to load :( ';
      } else {
        timeout = 'and loaded in under 4sec';
      }
      var adAvailable = yieldbot.adAvailable();
      /* var dfp = $('script[src^="https://securepubads.g.doubleclick.net/"]').attr('src');
      if (undefined !== dfp) {
        dfpLoaded = 'loaded';
      } else {
        dfpLoaded = 'not loaded';
      } */
      if (undefined === init) {
        console.log('works for undefined init');
      } else {
        //Parsing the script's GET parameters
        function queryStringToJSON() {
            var pairs = init.split('&');
            var result = {};
            pairs.forEach(function(pair) {
              pair = pair.split('=');
              result[pair[0]] = decodeURIComponent(pair[1] || '');
            });
            console.log(result);
            return JSON.stringify(result);
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
        /*  for (var key in h) {
          if (h.hasOwnProperty(keys)) {
            //console.log(values + " -> " + JSON.stringify(h[key]));
            //console.log(key + " -> " + h[key]);
          }
        } */
        // checking if there's targeting fired on the page and if render ad is fired
        values = [];
        h = yieldbot._history;
        for (var i = 0, len = h.length; i < len; i++) {
          values.push(h[i][0]);
        }
        // console.log(values);
        var getPageCriteria = values.includes('yieldbot.getPageCriteria');
        var getSlotCriteria = values.includes('yieldbot.getSlotCriteria');
        var render = values.includes('yieldbot.renderAd');
        if (true === getPageCriteria) {
          targeting = 'set by getPageCriteria';
        } else if (true === getSlotCriteria) {
          targeting = 'set by getSlotCriteria';
        } else {
          targeting = 'not set';
        }
        if (true === render) {
          renderAd = 'attempted to be rendered';
        } else {
          renderAd = 'not attempted to be rendered';
        }
        //creating the element on the page and styling
        var element = $('<div id="yb_box"><div class="header"><span style="font-size: 20px; color: #66CC00;"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"></span><a style="color: #66CC00!important; font-weight: bold;" href="https://ui.yieldbot.com/ui/meow/publisher/' + pub + '"> Meow </a></div> <div class="yb_div"> Intent tag is <span style="color:#66CC00; font-weight: normal;">' + intentTag + ybGo + '</span></div><div class="yb_div"> PVI is  <span style="color:#66CC00; font-weight: normal;">' +pvi +'</span></div> <div class="yb_div"> Async is  <span style="color:#66CC00; font-weight: normal;">' +asyncEnabled +'</span></div><div class="yb_div"> Pub ID is  <span style="color:#66CC00; font-weight: normal;">' + pub +'</span> </div><div class="yb_div"> Slot names defined on the page: <span style="color:#66CC00; font-weight: normal;">' +splitSlots +'</div><div class="yb_div"> Slot sizes defined on the page: <span style="color:#66CC00; font-weight: normal;">' +splitSizes + '</div><div class="yb_div"> Targeting is  <span style="color:#66CC00; font-weight: normal;">'+ targeting +'</div><div class="yb_div"> Ad was  <span style="color:#66CC00; font-weight: normal;">'+ renderAd +'</div><div id="psn_info"></div></div>');
        $('body').append(element);
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
        /*    var updateStateRequest = $('script[src*="init?cb=yieldbot.updateState"]').attr('src').replace('cb=yieldbot.updateState','');
      $.ajax({
      cache: true,
      dataType: "jsonp",
      type: "GET",
      crossDomain: true,
      jsonp: 'cb',
      jsonpCallback: 'yieldbot.updateState',
      url: updateStateRequest,
      async: false,
      error: function (XMLHttpRequest, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
      }
  }); */
        //  var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId=ffd8&format=json'
        //    var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId:ffd8';
        var url = 'https://dev.yieldbot.com/v2/config/publisher/'
        var pubUrl = url + pub;
        var adUrl = url + pub + '/adslot';
        $.ajax({
          url: pubUrl,
          dataType: 'jsonp',
          crossDomain: true,
          cache: true,
          jsonp: 'callback',
          jsonpCallback: 'receive',
          type: 'GET',
          always: (function receive(json) {
            var configPub = {
              "Display Name is ": json.display_name,
              "CPM is ": json.cpm,
              "Is ad serving enabled? ": json.ad_serving_enabled,
              "Site URL is ": json.base_site,
              "Is it mobile? ": json.is_mobile
            };
            var items = [];
            $.each(configPub, function(key, val) {
              items.push('<li id="info">' + key + ' ' + val +
                '</li>');
            });
            $('<ul/>', {
              'id': 'pub_info',
              html: items.join('')
            }).appendTo('#psn_info');
          })
        });
        $.ajax({
          url: adUrl,
          dataType: 'jsonp',
          crossDomain: true,
          cache: true,
          jsonp: 'callback',
          jsonpCallback: 'receiveads',
          type: 'GET',
          always: (function receiveads(jsonads) {
            var configAds = {
              "Adslots name ": jsonads.name,
              "Adslot sizes ": jsonads.dimensions,
            };
            var items = [];
            $.each(configAds, function(key, val) {
              items.push('<li id="info">' + key + ' ' + val +
                '</li>');
            });
            $('<ul/>', {
              'id': 'pub_info',
              html: items.join('')
            }).appendTo('#psn_info');
          })
        });
        // Not CORS-friendly (deprecated)
        /*    var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId='+pub+'&format=json'
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
    }); */
        console.log('it works! ');
      }
    }();
  }
}
execute();
