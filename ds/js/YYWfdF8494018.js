
    function atomiApplyParams({inputUrl}) {
      try {
        console.log(inputUrl)
        const inputUrlObj = new URL(inputUrl, window.location.origin);
        const currentPageParams = new URLSearchParams(window.location.search);
        const inputUrlParams = new URLSearchParams(inputUrlObj.search);
      
        // Iterate over all parameters in the current page's URL
        for (const [key, value] of currentPageParams) {
          // If the input URL does not already contain the parameter, add it
          if (!inputUrlParams.has(key)) {
            inputUrlParams.append(key, value);
          }
        }
      
        // Construct the final URL
        const finalUrl = inputUrlObj.origin + inputUrlObj.pathname + '?' + inputUrlParams.toString();
        console.log(finalUrl)
        return finalUrl;
      } catch (error) {
        console.log(error);
      }
    }

    function atomiFormatDate(options = { slated: false, addDate: 0 }) {
      try {
        const userLocale = navigator.language || 'en-US';
        const defaultOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

        const today = new Date();

        if (options.slated) {
          const slatedDate = new Date(today);
          slatedDate.setDate(slatedDate.getDate() + (options.addDate || 0));

          const formatter = new Intl.DateTimeFormat(userLocale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });

          return formatter.format(slatedDate);

          // const day = slatedDate.getDate().toString().padStart(2, "0");
          // const month = (slatedDate.getMonth() + 1).toString().padStart(2, "0");
          // const year = slatedDate.getFullYear();
          // return `${day}/${month}/${year}`;
        }

        if(options.addDate){
          today.setDate(today.getDate()+options.addDate)
        }
        const formattedDate = today.toLocaleDateString(userLocale, defaultOptions);

        return formattedDate;
      } catch (error) {
        console.log(error);
      }
    };

    function atomiFormatTime() {
      try {
        const now = new Date();
        return now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      } catch (error) {
        console.log(error);
      }
    };
    function runDelayedFunctions(data) {
      try {
        document.querySelectorAll('.atomicat-delay').forEach(el => el.classList.remove('atomicat-delay'));
        if(data?.setDisplayed){
          localStorage.setItem(data?.setDisplayed, true);
        }
        
      } catch (error) {
        console.log(error);
      }
    }
  
    (function() {
      try {
        document.addEventListener('DOMContentLoaded', function () {
          document.addEventListener("keydown", function (e) {
            e.ctrlKey && e.preventDefault();
          }),
          (document.onkeydown = function (e) {
            if (123 == e.keyCode) return !1;
          }),
          document.addEventListener("contextmenu", (e) => e.preventDefault());
        });
      } catch (error) {
        console.log(error);
      }
    })();
    (function() {
          try {
              const clickeventList = [{"compKey":"a2c05f84-37d1-489f-943f-958574d66331","misc":{"type":"button"}},{"compKey":"c7ae6b71-cd1a-44e7-9fd8-0d4c6e0c1a6b","misc":{"type":"text"}},{"compKey":"8615fb30-8258-4b92-bf18-e2d10f85387c","misc":{"type":"button"}},{"compKey":"0d108375-207f-44d0-81d2-7d35f1b0f298","misc":{"type":"text"}},{"compKey":"e310ef6e-9853-42f4-aa06-28d39a034d61","misc":{"type":"text"}},{"compKey":"ab12e035-6084-4c3e-bd75-37473e3af8cc","misc":{"type":"text"}},{"compKey":"32e75e4a-5d3b-41ad-a3ea-2507e21d76a3","misc":{"type":"text"}}];
    
    
              clickeventList.forEach((comp, index) => {
                  const compKey = comp?.compKey?.slice(0, 7);
                  const eleType = comp?.misc?.type;
                  const showItemsById = comp?.misc?.showItemsById;
                  const hideAfterClick = comp?.misc?.hideAfterClick;
                  const hideOnComplete = comp?.misc?.hideOnComplete;
                  console.log(comp, "clickevent")
                  if(hideAfterClick) {
                    const hideAfterClickEle = document.querySelector(`.atomicat-hide-after-click-${compKey}`);
                    console.log(hideAfterClickEle, "hideAfterClickEle")
                    if (hideAfterClickEle) {
                      hideAfterClickEle.addEventListener("click", function() {
                          console.log("hideAfterClickEle clicked")
                          hideAfterClickEle.classList.add("atomicat-hidden");
                      })
                    }
                  }
                  if(hideOnComplete) {
                    const hideOnCompleteEle = document.querySelector(`.atomicat-hide-on-complete-${compKey}`);
                    console.log(hideOnCompleteEle, "hideOnCompleteEle")
                    if (hideOnCompleteEle) {
                      hideOnCompleteEle.addEventListener("animationend", function() {
                          console.log("hideOnCompleteEle animationend")
                          hideOnCompleteEle.classList.add("atomicat-hidden");
                      })
                    }
                  }
                  if(showItemsById) {
                    const showItemsByIdEle = document.querySelector(`.atomicat-show-hidden-item-${compKey}`);
                    if(eleType === "progressbar"){
                      showItemsByIdEle.addEventListener("animationend", function() {
                        console.log("animation end")
                        atomiShowItems()
                      })
                    } else{
                      showItemsByIdEle.addEventListener("click", function() {
                        console.log("showItemsByIdEle click")
                        atomiShowItems()
                      })
                    }
                    function atomiShowItems() {
                      showItemsById.forEach((item) => {
                        const hiddenItem = document.querySelector(`#${item}`) || document.querySelector(`.${item}`);
                        if (hiddenItem) {
                          hiddenItem.classList.remove("atomicat-delay");
                        }
                      })
                    }
                  }
              });
    
          } catch (error) {
              console.log(error);
          }
      })();
          (function() {
            try {
              var vturbvideoId = "66bfab4b8688f4000c417afb";
              var SECONDS_TO_DISPLAY = 1545;
              var attempts = 0;
              var elsDisplayed = false;
              var alreadyDisplayedKey = 'alreadyElsDisplayed1545';
              var alreadyElsDisplayed = localStorage.getItem(alreadyDisplayedKey);

              var showHiddenElements = function () {
                elsDisplayed = true;
                runDelayedFunctions();
                localStorage.setItem(alreadyDisplayedKey, true);
              };
              if (alreadyElsDisplayed === 'true') {
                setTimeout(function () {
                  showHiddenElements();
                }, 100);
              } else {
                startWatchVideoProgress();
              }
              function getVideoInstance() {
                if (smartplayer.instances.length > 1) {
                  return smartplayer.instances.find(
                    (instance) => instance.options.id === vturbvideoId
                  );
                }
                return smartplayer.instances[0];
              };
              function startWatchVideoProgress() {
                if (typeof smartplayer === 'undefined' || !(smartplayer.instances && smartplayer.instances.length)) {
                  if (attempts >= 10) return;
                  attempts += 1;
                  return setTimeout(function () {
                    startWatchVideoProgress();
                  }, 1000);
                }
                console.log(smartplayer.instances);
                var videoInstance = getVideoInstance();
                videoInstance.on('timeupdate', () => {
                  if (elsDisplayed || videoInstance.smartAutoPlay) return;
                  console.log("currentTime => " +videoInstance.video.currentTime +" SECONDS_TO_DISPLAY => " +SECONDS_TO_DISPLAY);
                  if (videoInstance.video.currentTime < SECONDS_TO_DISPLAY) return;
                  showHiddenElements();
                });
              };
            } catch (error) {
              console.log(error);
            }
            
          })();
        
      (function() {
        try {
          const countdownList = [{"misc":{"items":[{"show":false,"text":"Days"},{"show":false,"text":"Hours"},{"show":true,"text":"Minutes"},{"text":"Seconds","show":true}],"tag":"div","countdownType":"evergreen","labelTag":"span","dateTime":"00:34","type":"countdown"},"style":{"countdown":{"borderColor":"unset","maxWidth":{"mobile":"180px"},"digits":{"fontSize":{"mobile":"50px"},"color":"rgba(255, 255, 255, 1)"},"paddingRight":{"mobile":"5px"},"paddingBottom":{"mobile":"5px"},"border":{"style":"hidden"},"background":"unset","paddingLeft":{"mobile":"5px"},"gap":{"mobile":"16px"},"paddingTop":{"mobile":"5px"},"label":{"color":"rgba(255, 255, 255, 1)","fontSize":{"mobile":"14px"}}},"outer":{"marginTop":{"mobile":"10px"},"paddingTop":{"mobile":"5px"},"background":"transparent"}},"compKey":"6a8c72c6-18e3-4766-a7a3-9194fea1e696"},{"misc":{"dateTime":"00:34","tag":"div","countdownType":"evergreen","labelTag":"span","items":[{"show":false,"text":"Days"},{"text":"Hours","show":false},{"text":"Minutes","show":true},{"show":true,"text":"Seconds"}],"type":"countdown"},"style":{"countdown":{"paddingBottom":{"mobile":"0px","desktop":"0px"},"paddingRight":{"desktop":"0px","mobile":"0px"},"borderImage":"unset","label":{"color":"rgba(255, 255, 255, 1)","fontSize":{"mobile":"14px"}},"border":{"style":"hidden"},"paddingLeft":{"mobile":"0px","desktop":"0px"},"digits":{"color":"rgba(255, 255, 255, 1)","fontSize":{"mobile":"50px"}},"paddingTop":{"mobile":"0px","desktop":"0px"},"borderColor":"unset","background":"rgba(0, 0, 0, 1)","maxWidth":{"mobile":"150px","desktop":"270px"},"gap":{"mobile":"0px","desktop":"24px"}},"outer":{"background":"transparent","marginTop":{"desktop":"20px"},"paddingTop":{"mobile":"5px"}}},"compKey":"b9f73c6c-8e00-4065-85d9-b40bc73855a8"}];

          countdownList.forEach(function(countdown) {
            const countdownType = countdown.misc.countdownType;
            const dateTime = countdown.misc.dateTime;
            const compKey = countdown.compKey.slice(0, 7);
            const intervalName = 'atomicat_countdown_interval_' + compKey;

            window[intervalName] = setInterval(function updateCountdown() {
              let targetTime;
              if (countdownType === "evergreen") {
                const sessionStorageKey = 'atomicat_countdown_start_' + compKey;
                let countdownStart = sessionStorage.getItem(sessionStorageKey);
                if (!countdownStart) {
                  countdownStart = new Date().getTime();
                  sessionStorage.setItem(sessionStorageKey, countdownStart);
                }
                const [hours, minutes] = dateTime.split(":").map(Number);
                targetTime = new Date(parseInt(countdownStart));
                targetTime.setHours(targetTime.getHours() + hours);
                targetTime.setMinutes(targetTime.getMinutes() + minutes);
              } else if (countdownType === "due_date") {
                targetTime = new Date(dateTime);
              }

              const now = new Date();
              const distance = targetTime - now;

              if (distance <= 0) {
                clearInterval(window[intervalName]);
                const countdownContainer = document.querySelector('.atomicat-countdown-' + compKey);
                if(countdownContainer) {
                  const countdownDigits = countdownContainer.querySelectorAll('.atomicat-countdown-digits');
                  countdownDigits.forEach(digit => digit.textContent = '00');
                }
                return;
              }

              const days = Math.floor(distance / (1000 * 60 * 60 * 24));
              const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((distance % (1000 * 60)) / 1000);

              const countdownContainer = document.querySelector('.atomicat-countdown-' + compKey);
              if(countdownContainer) {
                if(countdownContainer.querySelector('.atomicat-countdown-days')){
                  countdownContainer.querySelector('.atomicat-countdown-days').textContent = days < 10 ? `0${days}` : days;
                }
                if(countdownContainer.querySelector('.atomicat-countdown-hours')){
                  countdownContainer.querySelector('.atomicat-countdown-hours').textContent = hours < 10 ? `0${hours}` : hours;
                }
                if(countdownContainer.querySelector('.atomicat-countdown-minutes')){
                  countdownContainer.querySelector('.atomicat-countdown-minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
                }
                if(countdownContainer.querySelector('.atomicat-countdown-seconds')){
                  countdownContainer.querySelector('.atomicat-countdown-seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
                }
              }
            }, 1000);

          });
        } catch (error) {
          console.log(error);
        }
      })();