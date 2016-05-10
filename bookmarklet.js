function execute() {
    // the minimum version of jQuery we want
  var v = '1.11.3';
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
  /* function receive(json) {
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
 */

  function releaseTheKraken() {
    window.theKraken = function() {

      // Stop automatic page reload
      /*  window.onbeforeunload = function() {
          return "Are you sure you want to leave? Think of the kittens!";
        } */
      // Define all future variables in one step
      var asyncEnabled, ybGo, pairs;
      var intentTagSrc = $('script[src*="//cdn.yldbt.com/js/yieldbot.intent.js"]').attr('src');

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
      //Checking to see if the YB init and DFP scripts are fired;
      var init = $('script[src*="init?cb=yieldbot.updateState"]').attr('src');
      //this isn't actually a timeout request; need to figure out how to get this number from the response

      var adAvailable = yieldbot.adAvailable();
      if ('n' == adAvailable){
         adAvail = 'not available,';
      } else if ('y' == adAvailable){
       adAvail = 'available,';
      }
      var dfp = $('script[src^="https://securepubads.g.doubleclick.net/"]').attr('src');
      if (undefined !== dfp) {
       dfpLoaded = 'loaded';
      } else {
         dfpLoaded = 'not loaded or is loaded in an iframe';
      }
      if (undefined === init) {
        console.log('works for undefined init');
      } else {

        //Parsing the script's GET parameters
        /* function queryStringToJSON() {
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
        console.log(sizes + splitSizes); *

        //To compare ^ to the system's slot names via API
        /*  for (var key in h) {
          if (h.hasOwnProperty(keys)) {
            //console.log(values + " -> " + JSON.stringify(h[key]));
            //console.log(key + " -> " + h[key]);
          }
        } */
        // checking if there's targeting fired on the page and if render ad is fired

        var adSlots = [];
        var values = [];
        h = yieldbot._history;
        for (var i = 0, len = h.length; i < len; i++) {
          values.push(h[i][0]);
        }
         console.log(values);
        var slotsPage;
        var intentTagAsync = values.includes('yieldbot.enableAsync');
        var getPageCriteria = values.includes('yieldbot.getPageCriteria');
        var getSlotCriteria = values.includes('yieldbot.getSlotCriteria');
        var render = values.includes('cts_rend');
        var initTime = values.includes('init response took more than 4000ms to load, triggering resume()');
        var impression = values.indexOf('cts_imp');
        var updateReq = values.indexOf('yieldbot.updateState');
        var pvi = h[updateReq][2].pvi;
        var adOnPage = values.indexOf('cts_ad');
        var  adSlots = [];
        if (-1 != updateReq) {
          updateS = h[updateReq][2].slots[slots];
          $.each(updateS, function(slot, cpm, size) {
            adSlots.push('<ul id="info">' + slot + ' ' + cpm + ' '+ size + '</ul>');
          });
          $('<div/>', {
            'id': 'slot_info',
            html: adSlots.join('')
          });
        } else {
          updateS = 'updateState didn\'t return anything';
        }
        if (-1 != adOnPage){
          adPushed = h[adOnPage];
          adPushed = adPushed[1];
          console.log(adPushed);
        } else {
         adPushed = 'not served';
        }
        if (true === initTime) {
          timeout = ' and took longer than 4sec to load; triggered resume() ';
        } else {
          timeout = ' and loaded in under 4sec';
        }
        if (-1 !== impression){
          adServed = ' and impression was recorded';
        } else {
          adServed = ' and impression was recorded';
        }
        if (true === getPageCriteria) {
          targeting = 'set by getPageCriteria';
        } else if (true === getSlotCriteria) {
          targeting = 'set by getSlotCriteria';
        } else {
          targeting = 'not set';
        }
        if (true === render) {
          renderAd = ' rendered, ';
        } else {
          renderAd = ' not rendered, ';
        }
        //creating the element on the page and styling
        var element = $('<div id="yb_box"><div class="header"><span style="font-size: 20px; color: #66CC00;"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"></span><a style="color: #66CC00!important; font-weight: bold;" href="https://ui.yieldbot.com/ui/meow/publisher/' + pub + '"> Meow </a></div> <div class="yb_div"> Intent tag is <span style="color:#66CC00; font-weight: normal;">' + intentTag + ybGo + timeout + '</span></div><div class="yb_div"> PVI is  <span style="color:#66CC00; font-weight: normal;">' + pvi +'</span></div> <div class="yb_div"> Async is  <span style="color:#66CC00; font-weight: normal;">' +asyncEnabled +'</span></div><div class="yb_div"> Pub ID is  <span style="color:#66CC00; font-weight: normal;">' + pub +'</span> </div><div class="yb_div"> Slots we\'re bidding on: <span style="color:#66CC00; font-weight: normal;">' + slots +'</div><div class="yb_div"> Slots on the page: <span style="color:#66CC00; font-weight: normal;">' + slotsPage + '</div><div class="yb_div"> Targeting is  <span style="color:#66CC00; font-weight: normal;">'+ targeting +'</div><div class="yb_div"> Ad is  <span style="color:#66CC00; font-weight: normal;">'+ adAvail + renderAd + adServed +'</div><div class="yb_div"> DFP is  <span style="color:#66CC00; font-weight: normal;">'+ dfpLoaded +'</div><div class="yb_div"> Ad is  <span style="color:#66CC00; font-weight: normal;">'+ adPushed +'</div><div id="psn_info"></div></div>');
        $('body').append(element);
        element.css({
          position: 'fixed',
          top: '0',
          right: '0',
          width: '500px',
          height: 'auto',
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

        console.log('received');
        var url = 'https://dev.yieldbot.com/v2/config/publisher/'
        var pubUrl = url + pub;
        var adUrl = url + pub + '/adslot';

//figre out how to handle appending
    /*     $.ajax({
          url: pubUrl,
          dataType: 'jsonp',
          crossDomain: true,
          jsonp: 'callback',
          jsonpCallback: 'receive',
          type: 'GET',
          cache: true,
          success: (function receive(json) {
            var configPub = {
              "Display Name is ": json.display_name,
              "CPM is ": json.cpm,
              "Is ad serving enabled? ": json.ad_serving_enabled,
              "Site URL is ": json.base_site,
              "Is it mobile? ": json.is_mobile
            };
            console.log(json);
            var pubItems = [];
            $.each(configPub, function(key, val) {
              pubItems.push('<ul id="info">' + key + ' ' + val +
                '</ul>');
            });
            console.log(pubItems);
            $('<div/>', {
              'id': 'pub_info',
              html: pubItems.join('')
            }).appendTo('#psn_info');;
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
          success: (function receiveads(jsonads) {
          jsonads = jsonads.first();
            var configAds = {
              "Adslots name ": jsonads.name,
              "Adslot sizes ": jsonads.dimensions,
            };
            console.log(jsonads);
            var adItems = [];
            $.each(configAds, function(key, val) {
              adItems.push('<ul id="info">' + key + ' ' + val +
                '</ul');
            });
            $('<div>', {
              'id': 'ad_info',
              html: adItems.join('')
            });
          })
        });
        $(adItems).appendTo('#psn_info'); */

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
