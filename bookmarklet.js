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

  function releaseTheKraken() {
    window.theKraken = function() {
      // Stop automatic page reload
      /*  window.onbeforeunload = function() {
          return "Are you sure you want to leave? Think of the kittens!";
        } */
    // Define all future variables in one step
    var jQuery = $;
      var ybGo, pairs, html, requestId, pvi;
      // Is intent tag present
      var intentTagSrc = $(
        'script[src*="//cdn.yldbt.com/js/yieldbot.intent.js"]').attr(
        'src');
      if (undefined == intentTagSrc) {
        var noGo = $('<div class="no_box"><div class="header"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"></div></br><div>The intent tag is <span style="color:red;font-weight: normal;"> not loaded or is loaded in an iframe. Incorrect implementation.</span></div></div>');
        $('body').append(noGo);
        noGo.css({
          position: 'fixed',
          top: '0',
          right: '0',
          width: '500px',
          height: 'auto',
          color: 'white',
          padding: '0 2% 0 3%',
          fontWeight: 'bold',
          zIndex: '999999',
          fontSize: '16px',
          backgroundColor: 'rgba(25,0,51,.85)',
        });

      } else {
        pub = yieldbot.pub(); // Retrieve pub ID
        intentTag = '<span style="color:#66CC00; font-weight:normal;"> loaded </span>';
        if (true === yieldbot._initialized) {
          ybGo = ' <span style="font-weight:normal;color: #66CC00;"> and activated - good to go!';
        } else {
          ybGo = ' <span style="font-weight:normal;color:red;"> but isn\'t activated :(';
        }
      }
      //Checking to see if the YB init and DFP scripts are fired;
      var init = $('script[src*="init?cb=yieldbot.updateState"]').attr(
        'src');
      //this isn't actually a timeout request; need to figure out how to get this number from the response
      var dfp = $(
        'script[src^="https://securepubads.g.doubleclick.net/"]').attr(
        'src');
      if (undefined !== dfp) {
        dfpLoaded = '<span style="color: #66CC00;">loaded';
      } else {
        dfpLoaded = '<span style="color: red;">not loaded or is loaded in an iframe';
      }
      // if init's undefined, don't continue
      if (undefined === init) {
        console.log('works for undefined init'); //better description here
      } else {
        //To compare ^ to the system's slot names via API
        /*  for (var key in h) {
          if (h.hasOwnProperty(keys)) {
            //console.log(values + " -> " + JSON.stringify(h[key]));
            //console.log(key + " -> " + h[key]);
          }
        } */
        // running through all of the history data stored
        var adSlots = [];
        var values = [];
        h = yieldbot._history;
        for (var i = 0, len = h.length; i < len; i++) {
          values.push(h[i][0]);
        }
        console.log(values);
        var slotsPage = values.indexOf('yieldbot.defineSlot');
        var intentTagAsync = values.includes('yieldbot.enableAsync');
        var getPageCriteria = values.includes('yieldbot.getPageCriteria');
        var getSlotCriteria = values.includes('yieldbot.getSlotCriteria');
        var render = values.includes('cts_rend');

        var index, value, result;
        for (index = 0; index < values.length; ++index) {
          value = values[index];
          if (value.substring(0, 8) === 'init took') {
        // You've found it, the full text is in `value`.
        // So you might grab it and break the loop, although
        // really what you do having found it depends on
        // what you need.
        result = value;
        console.log(result);
        break;
          }
        }
        var impression = values.indexOf('cts_imp');
        var updateReq = values.indexOf('yieldbot.updateState');
        var adOnPage = values.indexOf('cts_ad');
        var adAvailable = yieldbot.adAvailable();
        if (-1 != impression){
          requestId = 'is <span style="font-weight: normal; color: #66CC000;"> ' + h[impression][1];
        } else {
          requestId = '<span style="font-weight: normal; color: orange;"> was not sent';
        }
        if ('n' == adAvailable) {
          adAvail = '<span style="font-weight: normal; color: red;"> not available (this is totally cool if you\'re using the testing tool), </span>';
        } else if ('y' == adAvailable) {
          adAvail = '<span style="font-weight: normal; color:#66CC00 ;"> available, </span>';
        }
        if (-1 != intentTagAsync) {
          asyncEnabled = '<span style="font-weight: normal; color:#66CC00 ;"> enabled';
        } else {
          asyncEnabled = '<span style="font-weight: normal; color:red ;"> not enabled';
        }
        if (-1 != updateReq) {
          pvi = '<span style="font-weight:normal; color: #66CC00;">' + h[updateReq][2].pvi;
          updateS = h[updateReq][2].slots;
          for (j = 0; j < updateS.length; j++) {
            slots = JSON.stringify(updateS[j]);
            slots = slots.replace(/[({})(\")]/g, ' ');
            console.log(slots);
            adSlots.push(
              '<ul class="slot_info" style="padding:0;margin:0; color: #66CC00; font-weight: normal;">' +
              slots + '</ul>');
          }
          adSlots = adSlots.join('');
        } else {
          adSlots = '<span style="font-weight: normal; color: red;"> updateState didn\'t return any slot info';
          pvi = '<span style="font-weight: normal; color: red;"> undefined';
        }
        if (-1 != adOnPage) {
          adPushed = h[adOnPage];
          adPushed = '<span style="font-weight: normal;color:#66CC00;"> ' + adPushed[1];
          // console.log(adPushed);
        } else {
          adPushed = '<span style="font-weight:normal; color: orange;"> was not requested';
        }
      /*  if (true === initTime) {
          timeout =
            ' but it took longer than 4sec to load; triggered resume() ';
        } else {
          timeout = ' in under 4sec';
        } */
        if (-1 != impression) {
          adServed = ' <span style="font-weight:normal; color: #66CC00;"> and impression was recorded </span>';
        } else {
          adServed = ' <span style="font-weight:normal; color: orange;"> and impression was not recorded </span>';
        }
        if (true === getPageCriteria) {
          targeting = '<span style=" color: #66CC00;font-weight:normal;"> set by getPageCriteria - good to go for targeting!';
        } else if (true === getSlotCriteria) {
          targeting = '<span style="font-weight:normal color: #66CC00;"> set by getSlotCriteria - good to go for targeting!';
        } else {
          targeting = '<span style="color: red; font-weight:normal; "> not set - this is a fatal error; please have the client fix it :(';
        }
        if (true === render) {
          renderAd = ' <span style="color: #66CC00;font-weight: normal;"> rendered, </span>';
        } else {
          renderAd = ' <span style="color: red; font-weight: normal; "> not rendered, </span>';
        }

        //creating the element on the page and styling
        var element = $(
          '<div id="yb_box"><div class="header"><span style="font-size: 20px; color: #66CC00;"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"></span><a style="color: #66CC00!important; font-weight: bold;" href="https://my.yieldbot.com/ui/meow/publisher/' +
          pub +
          '"> Meow </a></div> <div class="yb_div"> Intent tag is ' +
          intentTag + ybGo + /*timeout + */
          '</span></div><div class="yb_div"> Request for a creative ' +
          requestId +
          '</span></div> <div class="yb_div"> Async is  ' +
          asyncEnabled +
          '</span></div><div class="yb_div"> Pub ID is  <span style="font-weight: normal; color:#66CC00 ;"> ' +
          pub +
          '</span> <span id="display_name" style="color:orange;font-weight:normal;">should be </span></div> <div class="yb_div"> Slots we\'re trying to bid on (in Meow) : ' +
          adSlots +
          '</span></div><div class="yb_div"> Slots on the page: ' +
          slotsPage +
          '</span></div><div class="yb_div"> Targeting is ' +
          targeting +
          '</span></div><div class="yb_div"> Ad is' +
          adAvail + renderAd + adServed +
          '</div><div class="yb_div"> DFP is  <span style="color:#66CC00; font-weight: normal;">' +
          dfpLoaded +
          '</span></div><div class="yb_div"> Bid on slot' +
          adPushed +
          '</span></div><div class="yb_div"> PVI is  ' + pvi +
          '</span></div> <div id="yb_div"> <span id="ad_serving" style="font-weight:normal;color:orange;"> </span> <span id="is_mobile" style="font-weight:normal;color:orange;"> </span></div></div>');
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

        //  var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId=ffd8&format=json'
        //    var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId:ffd8';
        console.log('received');
        var url = 'https://dev.yieldbot.com/v2/config/publisher/'
        var pubUrl = url + pub;
        var adUrl = url + pub + '/adslot';
        //figre out how to handle appending
        $.ajax({
          url: pubUrl,
          dataType: 'jsonp',
          crossDomain: true,
          jsonp: 'callback',
          jsonpCallback: 'receive',
          type: 'GET',
          cache: true,
          success: (function receive(json) {
            configPub = [json.display_name,
            json.ad_serving_enabled,
            json.is_mobile];
          /*  pubItems = [];
            console.log(configPub);
            for (var key in configPub) {
              pubItems.push(key);
            }
            // pubItems.sort();
             for (var k = 0; k < pubItems.length; k++) {
              var key = pubItems[k];
              var pub = JSON.stringify(configPub[key]);
              console.log(key + pub);
              html += '<ul style="font-size: 15px; color: orange; font-weight: normal;"> ' + key + ' ' + pub +' </ul>';
            } */
            console.log(configPub);
            displayName = configPub[0];
            adServing = configPub[2];
            mobile = configPub[3];
            $("#display_name").append(displayName);
            $("#ad_serving").append(adServing);
            $("#is_mobile").append(mobile);
              // console.log(html);

          })
        });
        /* $.ajax({
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
