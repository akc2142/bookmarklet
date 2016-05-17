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
      //  .ajax({
      // Stop automatic page reload
      /*  window.onbeforeunload = function() {
          return "Are you sure you want to leave? Think of the kittens!";
        } */
      // Define all future variables in one step
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/,
          "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      var ybGo, pairs, html, requestId, pvi;
      // Is intent tag present
      var intentTagSrc = jQuery('script[src*="/js/yieldbot.intent.js"]').attr(
        'src');
      if (undefined == intentTagSrc) {
        var noGo = jQuery(
          '<div class="no_box"><div class="header"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"></div></br><div>The intent tag is <span style="color:red;font-weight: normal;"> not loaded or is loaded in an iframe. Incorrect implementation.</span></div></div>'
        );
        jQuery('body').append(noGo);
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
        intentTag =
          '<span style="color:#66CC00; font-weight:normal;"> loaded </span>';
        if (true === yieldbot._initialized) {
          ybGo =
            ' <span style="font-weight:normal;color: #66CC00;"> and activated ';
        } else {
          ybGo =
            ' <span style="font-weight:normal;color:red;"> and isn\'t activated :(';
        }
      }
      //Checking to see if the YB init and DFP scripts are fired;
      var init = jQuery('script[src*="init?cb=yieldbot.updateState"]').attr(
        'src');
      //this isn't actually a timeout request; need to figure out how to get this number from the response
      var dfp = jQuery(
        'script[src^="https://securepubads.g.doubleclick.net/"]').attr(
        'src');

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

        var slotsPage = [];
        var matchSlotsPage = [];
        var adSlots = [];
        var values = [];
        var slotIndex = [];
        var rendIndex = [];
        var rendPage = [];
        h = yieldbot._history;
        for (var i = 0, len = h.length; i < len; i++) {
          values.push(h[i][0]);
        }
        console.log(values);
        var initTk = JSON.stringify(values).match(/init took \d+ms/g);
        var intentTagAsync = values.includes('yieldbot.enableAsync');
        var getPageCriteria = values.includes('yieldbot.getPageCriteria');
        var params = values.includes('yieldbot.params');
        var getSlotCriteria = values.includes('yieldbot.getSlotCriteria');
        var render = values.includes('cts_rend');
        var impression = values.indexOf('cts_imp');
        var updateReq = values.indexOf('yieldbot.updateState');
        var adOnPage = values.includes('cts_ad');
        var adAvailable = yieldbot.adAvailable();
        var initTime = values.includes('init response took more than 4000ms to load, triggering resume()');
        if (null !== initTk) {
          initTook = '<span style="color:red;"> but ' + initTk;
        }
        else {
          initTook = '<span style="color:green;">';
        }
        if (-1 !== impression) {
          requestId =
            'is <span style="font-weight: normal; color: #66CC00;"> ' + h[
              impression][1];
        } else {
          requestId =
            '<span style="font-weight: normal; color: red;"> was not sent - this is necessary to serve a creative';
        }
        if ('n' == adAvailable) {
          adAvail =
            '<span style="font-weight: normal; color: red;"> not available <span style="font-weight: normal; color:#66CC00;"> (this is totally cool if you\'re using the testing tool)</span> </span>';
        } else if ('y' == adAvailable) {
          adAvail =
            '<span style="font-weight: normal; color:#66CC00 ;"> available, </span>';
        }
        if (-1 != intentTagAsync) {
          asyncEnabled =
            '<span style="font-weight: normal; color:orange;"> enabled';
        } else {
          asyncEnabled =
            '<span style="font-weight: normal; color:orange;"> not enabled';
        }
        for (var l = 0; l < h.length; l++) {
          if (h[l][0] === 'yieldbot.defineSlot') {
            slotIndex.push(l);
          }
        }
        for (var m = 0; m < slotIndex.length; m++) {
          index = h[slotIndex[m]][2];
          slotsPage.push(index);
        }
        if (-1 !== updateReq) {
          pvi = '<span style="font-weight:normal; color: #66CC00;">' + h[
            updateReq][2].pvi;
          updateS = h[updateReq][2].slots;
          // console.log(updateS);
          /*  consoleErrors = if () {h[updateReq][4][0]; console.log('works')} else {console.log('doesn\'t work');}

          console.log(consoleE); */
          for (a = 0; a < updateS.length; a++) {
            ad_slots = updateS[a].slot;
            matchSlotsPage.push(ad_slots);
          }
          for (j = 0; j < updateS.length; j++) {
            slots = JSON.stringify(updateS[j]);
            slots = slots.replace(/[({})(\")]/g, ' ');
            // console.log(slots);
            adSlots.push(
              '<ul class="slot_info" style="padding:0;margin:0; color: #66CC00; font-weight: normal;">' +
              slots + '</ul>');
          }
          adSlots = adSlots.join('');
        } else {
          adSlots =
            '<span style="font-weight: normal; color: red;"> updateState didn\'t return any slot info';
          pvi =
            '<span style="font-weight: normal; color: red;"> undefined';
        }
        /*  var isSameSet = function(arr1, arr2){
          return  jQuery(arr1).not(arr2).length === 0 && jQuery(arr2).not(arr1).length === 0;
        }
        var resultMatch = isSameSet(slotsPage, matchSlotsPage);
        console.log(resultMatch);
        if (true === resultMatch){
          matched = 'slots defined in system match slots defined on page';
        } else if () {

        } */
        for (var b = 0; b < h.length; b++) {
          if (h[b][0] === 'cts_ad') {
            rendIndex.push(b);
            console.log(rendIndex);
          }
        }
        for (var c = 0; c < rendIndex.length; c++) {
          rindex = h[rendIndex[c]][1];
          rendPage.push(rindex);
          console.log(rendPage);
        }
        if (-1 != adOnPage) {
          adPushed = '<span style="font-weight: normal;color:#66CC00;"> ' +
            rendPage;
          // console.log(adPushed);
        } else {
          adPushed =
            '<span style="font-weight:normal; color: orange;"> was not requested ';
        }
        /* if (true === initTime) {
          timeout =
            ' <span style="color:red;"> and it took longer than 4sec to load so it timed out </span>';
        } else {
          timeout = ' in under 4sec';
        } */
        if (-1 !== impression) {
          adServed =
            ' <span style="font-weight:normal; color: #66CC00;"> and impression was recorded - good to go! </span>';
        } else {
          adServed =
            ' <span style="font-weight:normal; color: red;"> and impression was not recorded (something is wrong if you\'re using the testing tool) </span>';
        }
        if (true === getPageCriteria || true === getSlotCriteria || true ===
          params) {
          if (updateReq < values.indexOf('yieldbot.getPageCriteria') || values.indexOf('getSlotCriteria') || values.indexOf('yieldbot.params')) {
            targeting =
              '<span style=" color: #66CC00;font-weight:normal;"> good to go!';
          }
        } else {
          targeting =
            '<span style="color: red; font-weight:normal; "> not set - this is a fatal error; please have the client fix it :(';
        }
        if (true === render) {
          renderAd =
            ' <span style="color: #66CC00;font-weight: normal;">, rendered - good to go, </span>';
        } else {
          renderAd =
            ' <span style="color: red; font-weight: normal; "> not rendered (something is wrong if you\'re using the testing tool), </span>';
        }
        //creating the element on the page and styling
        var element = jQuery(
          '<div id="yb_box"><div class="header"><span style="font-size: 20px; color: #66CC00;"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"></span><a style="color: #66CC00!important; font-weight: bold;" target="_blank" href="https://my.yieldbot.com/ui/meow/publisher/' +
          pub +
          '"> Meow         </a> <a style="color: #66CC00!important; font-weight: bold;" target="_blank" href="http://i.yldbt.com/m/start-testing"> Testing Tool </a></div> <div class="yb_div"> Intent tag is ' +
          intentTag + ybGo + initTook +
          '</span></div><div class="yb_div"> Pub ID is  <span style="font-weight: normal; color:#66CC00 ;"> ' +
          pub +
          '<span id="display_name" style="color:orange;font-weight:normal;z-index:999999;"> should be </span></div><div class="yb_div"> Slots we\'re trying to bid on: ' +
          adSlots +
          '</span></div><div class="yb_div"> Slots defined on the page: <span style="font-weight:normal; color: #66CC00;">' +
          slotsPage +
          '</span> </div><div class="yb_div"> Targeting is ' +
          targeting + '</span> </div> <div class="yb_div">' +
          '</span></div> <div id="yb_div"> <span id="ad_serving" style="font-weight:normal;color:orange;"> </span> </div> <div id="yb_div"> <span id="is_mobile" style="font-weight:normal;color:orange;"> </span></div></div>'
        );
        jQuery('body').append(element);
        element.css({
          position: 'fixed',
          top: '0',
          right: '0',
          width: '500px',
          height: 'auto',
          color: 'white',
          padding: '0 0.5% 2% 3%',
          fontWeight: 'bold',
          zIndex: '999999',
          fontSize: '16px',
          backgroundColor: 'rgba(25,0,51,.85)',
        });
        //  var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId=ffd8&format=json'
        //    var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId:ffd8';
        //console.log('received');
        var url = 'https://dev.yieldbot.com/v2/config/publisher/'
        var pubUrl = url + pub;
        var adUrl = url + pub + '/adslot';
        //figre out how to handle appending
        jQuery.ajax({
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
              json.is_mobile
            ];
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
            adServing =
              '<span style="font-weight:bold;color:white;">Ad serving enabled? </span>' +
              configPub[1];
            mobile =
              '<span style="font-weight:bold;color:white;">Mobile? </span>' +
              configPub[2];
            jQuery("#display_name").append(displayName);
            jQuery("#ad_serving").append(adServing);
            jQuery("#is_mobile").append(mobile);
            // console.log(html);
          })
        });
        /* jQuery.ajax({
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
            jQuery.each(configAds, function(key, val) {
              adItems.push('<ul id="info">' + key + ' ' + val +
                '</ul');
            });
            jQuery('<div>', {
              'id': 'ad_info',
              html: adItems.join('')
            });
          })
        });
        jQuery(adItems).appendTo('#psn_info'); */
        // Not CORS-friendly (deprecated)
        /*    var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId='+pub+'&format=json'
      jQuery.getJSON(url, function(json) {
        var config = { "Display Name is " : json.display_name,
        "CPM is " : json.cpm,
        "Is ad serving enabled? " : json.ad_serving_enabled,
        "Site URL is " : json.base_site,
        "Is it mobile? " : json.is_mobile
      };
        var items = [];
        jQuery.each(config, function(key, val) {
        items.push( '<li id="info">' + key + ' ' + val + '</li>' );
      });
        jQuery('<ul/>', {
        'id': 'pub_info',
        html: items.join('')
      }).appendTo('#psn_info');
    }); */
        console.log('it works! ');
      }
      //  });
    }();
  }
}
execute();
