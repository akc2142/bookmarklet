(function() {
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
  clearInterval();
    jQuery('#yb_box').remove();
    jQuery('#no_box').remove();
    jQuery('#no_init_box').remove();
    if (document.readyState === 'complete') {
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
        var ybGo, pairs, html, requestId, pvi, dfpSlots;
        // Is intent tag present
        var intentTagSrc = jQuery('script[src*="/js/yieldbot.intent.js"]')
          .attr('src');
        if (undefined === intentTagSrc) {
          var noGo = jQuery(
            '<div id="no_box"><div class="yb_header"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"></div></br><div> Client didn\'t check themself and wrickety-wrecked themself. <span style="color:red;font-weight: normal;"> </br> Fatal error: the intent tag is not loaded or is loaded in an iframe. Chickety-check in with a TAM. </span></div></div>'
          );
          jQuery('body').append(noGo);
          noGo.css({
            position: 'fixed',
            top: '0',
            right: '0',
            width: '500px',
            height: 'auto',
            color: 'white',
            padding: '0 2% 2% 3%',
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
        // if init's undefined, don't continue
        if (undefined === init && undefined !== intentTagSrc) {
          var noGoInit = jQuery(
            '<div id="no_init_box"><div class="yb_header"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"></div></br><div> Client didn\'t check themself and wrickety-wrecked themself. <span style="color:red;font-weight: normal;"> </br> Init is not defined but the intent tag is loaded. Try to refresh and test again. If the problem persists, chickety-check in a TAM. </span></div></div>'
          );
          jQuery('body').append(noGoInit);
          noGoInit.css({
            position: 'fixed',
            top: '0',
            right: '0',
            width: '500px',
            height: 'auto',
            color: 'white',
            padding: '0 2% 2% 3%',
            fontWeight: 'bold',
            zIndex: '999999',
            fontSize: '16px',
            backgroundColor: 'rgba(25,0,51,.85)',
          }); //better description here
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
          var h = yieldbot._history;
          for (var i = 0, len = h.length; i < len; i++) {
            values.push(h[i][0]);
          }
          //console.log(values);
          var initTk = JSON.stringify(values).match(/init took \d+/g);
          //  console.log(initTk);
          var intentTagAsync = values.includes('yieldbot.enableAsync');
          var getPageCriteria = values.includes(
            'yieldbot.getPageCriteria');
          var setSlotTargeting = values.includes(
            'yieldbot.setSlotTargeting');
          var params = values.includes('yieldbot.params');
          var getSlotCriteria = values.includes(
            'yieldbot.getSlotCriteria');
          // var render = values.includes('cts_rend');
          // var impression = values.indexOf('cts_imp');
          var updateReq = values.indexOf('yieldbot.updateState');
          var adOnPage = values.includes('cts_ad');
          var adAvailable = yieldbot.adAvailable();
          var dfp = googletag.service_manager_instance.j.publisher_ads.D.ybot;
          // var initTime = values.includes('init response took more than 4000ms to load, triggering resume()');
          if (undefined !== dfp) {
            dfpSlots = googletag.service_manager_instance.j.publisher_ads
              .D.ybot;
          } else if (undefined === googletag.service_manager_instance.j.publisher_ads
            .D.ybot) {
            var dfpValues = googletag.slot_manager_instance.l;
            for (var key in dfpValues) {
              // skip loop if the property is from prototype
              if (!dfpValues.hasOwnProperty(key)) continue;
              obj = dfpValues[key].w;
              if (obj.ybot_ad == 'y') {
                dfpSlots = obj.ybot_slot + ':' + obj.ybot_cpm + ':' + obj
                  .ybot_size;
                //console.log(dfpSlots);
              }
            }
          } else {
            dfpSlots = false;
          }
          if (null !== initTk) {
            initTook = '<span style="color:red;"> but ' + initTk +
              'seconds';
          } else {
            initTook = '<span style="color:green;">';
          }
          /* if (-1 !== impression) {
            requestId =
              'is <span style="font-weight: normal; color: #66CC00;"> ' +
              h[impression][1];
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
          } */
          for (var l = 0; l < h.length; l++) {
            if (h[l][0] === 'yieldbot.defineSlot') {
              slotIndex.push(l);
            }
          }
          for (var m = 0; m < slotIndex.length; m++) {
            index = h[slotIndex[m]][2];
            slotsPage.push(
              '<ul class="slot_info" style="padding:0;margin:0; color: #66CC00; font-weight: normal;">' +
              index + '</ul>');
          }
          slotsPage = slotsPage.join('');
          if (-1 !== updateReq) {
            pvi = '<span style="font-weight:normal; color: #66CC00;">' +
              h[updateReq][2].pvi;
            updateS = h[updateReq][2].slots;
            // console.log(updateS);
            /*  consoleErrors = if () {h[updateReq][4][0]; console.log('works')} else {console.log('doesn\'t work');}

          console.log(consoleE);
            for (a = 0; a < updateS.length; a++) {
              ad_slots = updateS[a].slot;
                      matchSlotsPage.push(ad_slots);
            } */
            for (j = 0; j < updateS.length; j++) {
              slots = updateS[j];
              matchSlotsPage = slots.slot + ':' + slots.cpm + ':' + slots
                .size;
              // console.log('match slots page: ' + matchSlotsPage);
              slotsObj = 'Slot - ' + slots.slot + ', CPM - ' + slots.cpm +
                ', Size - ' + slots.size;
              //console.log(slotsObj);
              //slots = slots.replace(/[(\[\])({})(\")(slot)(size)(cpm)(,)]/g, '');
              adSlots.push(
                '<ul class="slot_info" style="padding:0;margin:0; color: #66CC00; font-weight: normal;">' +
                slotsObj + '</ul>');
            }
            adSlots = adSlots.join('');
          } else {
            adSlots =
              '<span style="font-weight: normal; color: red;"> updateState didn\'t return any slot info';
            pvi =
              '<span style="font-weight: normal; color: red;"> undefined';
          }
          /* var isSameSet = function(arr1, arr2) {
          return jQuery(arr1).not(arr2).length === 0 && jQuery(arr2).not(
            arr1).length === 0;
        }
        var resultMatch = isSameSet(dfpSlots, matchSlotsPage);
        console.log(resultMatch);
        if (true === resultMatch) {
          matched = 'slots defined in system match slots defined on page';
        } */
          for (var b = 0; b < h.length; b++) {
            if (h[b][0] === 'cts_ad') {
              rendIndex.push(b);
              //console.log(rendIndex);
            }
          }
          for (var c = 0; c < rendIndex.length; c++) {
            rindex = h[rendIndex[c]][1];
            rendPage.push(rindex);
          //  console.log(rendPage);
          }
          /* if (-1 !== adOnPage) {
            adPushed =
              '<span style="font-weight: normal;color:#66CC00;"> ' +
              rendPage;
            // console.log(adPushed);
          } else {
            adPushed =
              '<span style="font-weight:normal; color: orange;"> was not requested ';
          }
          if (true === initTime) {
          timeout =
            ' <span style="color:red;"> and it took longer than 4sec to load so it timed out </span>';
        } else {
          timeout = ' in under 4sec';
        }
          if (-1 !== impression) {
            adServed =
              ' <span style="font-weight:normal; color: #66CC00;"> and impression was recorded - good to go! </span>';
          } else {
            adServed =
              ' <span style="font-weight:normal; color: red;"> and impression was not recorded (something is wrong if you\'re using the testing tool) </span>';
          }
          //debugging
          if (matchSlotsPage === dfpSlots) {
            console.log('strings match each other');
          } */
          //targeting
          if (true === getPageCriteria || true === getSlotCriteria ||
            true === params || true === setSlotTargeting) {
            if (updateReq < values.indexOf('yieldbot.getPageCriteria') ||
              values.indexOf('getSlotCriteria') || values.indexOf(
                'yieldbot.params') || values.indexOf(
                'yieldbot.setSlotTargeting') && matchSlotsPage ===
              dfpSlots) {
              targeting =
                '<span style=" color: #66CC00;font-weight:normal;"> good to go!';
            }
          } else {
            targeting =
              '<span style="color: red; font-weight:normal; "> not set or timed out (see above if init took longer than 4 sec) - fatal error. ';
          }
          if (undefined === adOnPage && adAvailable == 'y') {
          renderAd = ' <span style="color: orange; font-weight: normal; "> Make sure the testing tool is on and you\'re on a page that has slots. If this error persists, check in with a TAM. It could just be we\'re not winning ';
        } else {
          renderAd = '';
        }
          //creating the element on the page and styling
          var element = jQuery(
            '<div id="yb_box"><div class="yb_header"><span style="font-size: 20px; color: #66CC00;"><img src="https://raw.githubusercontent.com/akc2142/bookmarklet/master/yb.png"></span><a style="color: #66CC00!important; font-weight: bold;" target="_blank" href="https://my.yieldbot.com/ui/meow/publisher/' +
            pub +
            '"> Meow         </a> <a style="color: #66CC00!important; font-weight: bold;" target="_blank" href="http://i.yldbt.com/m/start-testing"> Testing Tool </a></div> <div class="yb_div"> Intent tag is ' +
            intentTag + ybGo + initTook +
            '</span></div><div class="yb_div"> Pub ID is  <span style="font-weight: normal; color:#66CC00 ;"> ' +
            pub +
            '<span id="display_name" style="color:orange;font-weight:normal;z-index:999999;"> should be </span></div><div class="yb_div"> Trying to bid on: ' +
            adSlots +
            '</span></div><div class="yb_div"> Slots defined on the page: <span style="font-weight:normal; color: #66CC00;">' +
            slotsPage +
            '</span> </div><div class="yb_div"> Targeting is ' +
            targeting + '</span> </div> <div class="yb_div">' +
            '</span> </div><div class="yb_div">' + renderAd +
            '</span> </div> <div class="yb_div">' +
            '</span></div> <div id="yb_div"> <span id="ad_serving" style="font-weight:normal;color:orange;"> </span> </div> <div id="yb_div"> <span id="is_mobile" style="font-weight:normal;color:orange;"> </span></div></div>'
          );
          //  var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId=ffd8&format=json'
          //    var url = 'https://ui.yieldbot.com/config/v3/publisher?query=docId:ffd8';
          //console.log('received');
          var url = 'https://ui.yieldbot.com/v2/config/publisher/';
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
              //console.log(configPub);
              displayName = configPub[0];
              adServing =
                '<span style="font-weight:bold;color:white;">Ad serving enabled? </span>' +
                configPub[1];
              mobile =
                '<span style="font-weight:bold;color:white;">Mobile? </span>' +
                configPub[2];
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
              jQuery("#display_name").append(displayName);
              jQuery("#ad_serving").append(adServing);
              jQuery("#is_mobile").append(mobile);
            })
          });
        }
        //  });
      }();
    } else {
      alert(
        'Page hasn\'t fully loaded. Please wait for it to finish loading before running the script'
      );
    }
  }
})();
