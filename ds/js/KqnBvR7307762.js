
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
        const modalList = [{"compKey":"42e07492-1734-4656-8b65-42aa24e849a6","style":{"outer":{"tooltip":{"desktop":"top: 50%; left: 100%; bottom: auto; right: auto; -webkit-transform: translateY(-50%); -ms-transform: translateY(-50%); transform: translateY(-50%); -webkit-transition: all .3s ease-in-out; transition: all .3s ease-in-out; margin-left: 10px; border-color: rgba(0, 0, 0, 0) #000 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);","arrow":{"desktop":"top: calc(50% - 5px); right: 100%; left: auto; bottom: auto; border-color: rgba(0, 0, 0, 0) #000 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0); border-right-color: #555;"}}}},"misc":{"content":"CHAMADA PARA AÇÃO","type":"button","tag":"a","modal":{"display":true,"type":"customModal","customModalID":"6218596c-881d-4f3e-9fd5-ef98bba6d25b"},"hideOnDesktop":true,"hideOnTablet":true,"hideOnMobile":true}}];
        const modalCont = []
        const globalTriggers = document.querySelectorAll(".atomicat-global-modal-trigger");
        const globalClose = document.querySelector(".atomicat-global-modal-close");
        const modalOverlay = document.querySelector(".atomicat-modal-overlay");
        const allModals = document.querySelectorAll(".atomicat-modal");

        modalOverlay?.addEventListener("click", function() {
            modalOverlay?.classList.toggle("atomicat-modal-active");
            allModals.forEach((modal) => {
                modal.classList.remove("atomicat-modal-active");
            });
        });

        globalClose?.addEventListener("click", function() {
            document.querySelector(".atomicat-global-modal-container").classList.toggle("atomicat-modal-active");  
            modalOverlay?.classList.toggle("atomicat-modal-active");
        });

        globalTriggers.forEach((trigger) => {
            trigger.addEventListener("click", function() {
              document.querySelector(".atomicat-global-modal-container").classList.toggle("atomicat-modal-active");
              modalOverlay?.classList.toggle("atomicat-modal-active");
            });
        });

        modalCont.forEach((modal) => {
          const contKey = modal?.contKey?.slice(0, 7);
          const { modalMisc } = modal;
          const { onMouseLeave, showAfterDelay, scrollY } = modalMisc;
          const triggerCont = () => {
            const contEle = document.querySelector(`.atomicat-container-${contKey}`)
            contEle?.classList?.add("atomicat-modal-active");
            modalOverlay?.classList.add("atomicat-modal-active");
          }
            if(onMouseLeave?.active) {
              let once = false;

              document.addEventListener('mouseout', function (e) {
                if (!e?.relatedTarget && e?.clientY <= 0) {
                  if(!once) {
                    triggerCont();
                    once = onMouseLeave?.apply === "always" ? false : true;
                  }
                }
              });
            }
            if(showAfterDelay?.active && showAfterDelay?.value) {
              const { showAfterDelay } = modalMisc;
              setTimeout(() => {
                triggerCont();
              }, showAfterDelay?.value * 1000 )
            }

            if(scrollY?.active && scrollY?.value) {
              let once = false;
              const body = document.body;
              const html = document.documentElement;
              const pageHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
              const calcScrollY = (scrollY?.value / 100) * pageHeight;
               
              window.addEventListener("scroll", () => {
                  if (window.scrollY > calcScrollY && !once) {
                    triggerCont();
                    once = scrollY?.apply === "always" ? false : true;
                  }
              });
            }
            
        });

        allModals.forEach((modal) => {
            modal?.addEventListener('click', function(e) {
            
            if (
                          (typeof e?.target?.className === "string" &&
                            (e?.target?.className?.includes("atomicat-modal") ||
                              e?.target?.className?.includes(
                                "atomicat-modal-outer-container"
                              ) ||
                              e?.target?.className?.includes(
                                "atomicat-modal-inner-container"
                              ))) ||
                          e?.target?.className?.includes?.(
                            "atomicat-inner-container"
                          ) 
                        ) {
              const globalModal = document.querySelector('.atomicat-modal');
              const globalModalOverlay = document.querySelector('.atomicat-modal-overlay');
              modal.classList.remove('atomicat-modal-active');
              if(globalModal) {
                globalModal.classList.remove('atomicat-modal-active');
                globalModalOverlay.classList.remove('atomicat-modal-active');
              }
            }
          });
        });

        modalList.forEach((modal) => {
            const modalID = modal.misc.modal.customModalID?.slice(0, 7);
            const modalKey = modal.compKey?.slice(0, 7);
            const modalElement = document.querySelector(".atomicat-modal-trigger-" + modalKey);
            const closeModal = document.querySelector(".atomicat-modal-close-" + modalID);

            closeModal?.addEventListener("click", function() {
              document.querySelector(".atomicat-container-" + modalID).classList.remove("atomicat-modal-active");
              modalOverlay?.classList.remove("atomicat-modal-active");   
            });

            modalElement?.addEventListener("click", function() {
              document.querySelector(".atomicat-container-" + modalID).classList.toggle("atomicat-modal-active");
               modalOverlay?.classList.toggle("atomicat-modal-active");
            });
        })
    } catch (error) {
        console.log(error);
    }
    })();(function() {
          try {
              const clickeventList = [{"compKey":"10e2ebea-1171-4777-9df9-840d1c193a27","misc":{"type":"button"}},{"compKey":"7ab2305a-e713-4644-bd1a-e154aac6236c","misc":{"type":"text"}},{"compKey":"5b719886-9770-45cd-98ec-c250459bc07d","misc":{"type":"button"}},{"compKey":"dfd66762-1c56-4bc9-adb0-73cf8810a76e","misc":{"type":"text"}},{"compKey":"37427172-81f5-4be4-895a-e1221fbb3942","misc":{"type":"button"}},{"compKey":"3c469ad5-bac8-4cd7-b129-4705ea6fcafa","misc":{"type":"text"}},{"compKey":"ab4a2605-003d-42c3-8119-5bd008c76ea1","misc":{"type":"button"}},{"compKey":"6c45bbd2-4253-480a-8571-95957b851cb1","misc":{"type":"text"}}];
    
    
              clickeventList.forEach((comp, index) => {
                  const compKey = comp?.compKey?.slice(0, 7);
                  const eleType = comp?.misc?.type;
                  const showItemsById = comp?.misc?.showItemsById || comp?.misc?.showItemsByClass;
                  const hideAfterClick = comp?.misc?.hideAfterClick;
                  const hideOnComplete = comp?.misc?.hideOnComplete;
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
                        atomiShowItems()
                      })
                    } else{
                      showItemsByIdEle.addEventListener("click", function() {
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
              var vturbvideoId = "67292aca304c8e000c0f46da";
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
          const countdownList = [{"misc":{"items":[{"text":"Days","show":false},{"show":false,"text":"Hours"},{"text":"Minutes","show":true},{"show":true,"text":"Seconds"}],"tag":"div","labelTag":"span","dateTime":"00:40","type":"countdown","countdownType":"evergreen"},"compKey":"8837f115-c632-4cfd-bbd8-d0eb1daa92f6","style":{"outer":{"paddingTop":{"mobile":"5px"},"background":"transparent","marginTop":{"mobile":"10px"}},"countdown":{"paddingBottom":{"mobile":"5px"},"paddingRight":{"mobile":"5px"},"maxWidth":{"mobile":"180px"},"digits":{"fontSize":{"mobile":"50px"},"color":"rgba(255, 255, 255, 1)"},"paddingTop":{"mobile":"5px"},"label":{"color":"rgba(255, 255, 255, 1)","fontSize":{"mobile":"14px"}},"background":"rgba(0, 0, 0, 1)","border":{"style":"hidden"},"borderColor":"unset","paddingLeft":{"mobile":"5px"},"gap":{"mobile":"16px"}}}},{"style":{"countdown":{"paddingRight":{"desktop":"0px","mobile":"0px"},"paddingTop":{"desktop":"0px","mobile":"0px"},"gap":{"mobile":"0px","desktop":"24px"},"paddingLeft":{"desktop":"0px","mobile":"0px"},"maxWidth":{"desktop":"270px","mobile":"150px"},"label":{"fontSize":{"mobile":"14px"},"color":"rgba(255, 255, 255, 1)"},"paddingBottom":{"desktop":"0px","mobile":"0px"},"flexDirection":"column","borderColor":"unset","border":{"style":"hidden"},"background":"rgba(0, 0, 0, 1)","digits":{"color":"rgba(255, 255, 255, 1)","fontSize":{"mobile":"50px"}}},"outer":{"marginTop":{"desktop":"20px"},"paddingTop":{"mobile":"5px"},"tooltip":{"arrow":{"desktop":"top: calc(50% - 5px); right: 100%; left: auto; bottom: auto; border-color: rgba(0, 0, 0, 0) #000 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0); border-right-color: #555;"},"desktop":"top: 50%; left: 100%; bottom: auto; right: auto; -webkit-transform: translateY(-50%); -ms-transform: translateY(-50%); transform: translateY(-50%); -webkit-transition: all .3s ease-in-out; transition: all .3s ease-in-out; margin-left: 10px; border-color: rgba(0, 0, 0, 0) #000 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);"},"border":{"style":"hidden"}}},"compKey":"c512f135-c0e1-453f-b9db-d4753755c7dc","misc":{"tag":"div","labelTag":"span","countdownType":"evergreen","items":[{"show":false,"text":"Days"},{"show":false,"text":"Hours"},{"show":true,"text":"Minutes"},{"text":"Seconds","show":true}],"type":"countdown","dateTime":"00:40"}},{"style":{"outer":{"background":"transparent","marginTop":{"desktop":"20px"},"paddingTop":{"mobile":"5px"}},"countdown":{"maxWidth":{"mobile":"150px","desktop":"270px"},"paddingBottom":{"desktop":"0px","mobile":"0px"},"digits":{"fontSize":{"mobile":"50px"},"color":"rgba(255, 255, 255, 1)"},"paddingRight":{"mobile":"0px","desktop":"0px"},"gap":{"desktop":"24px","mobile":"0px"},"paddingTop":{"desktop":"0px","mobile":"0px"},"label":{"fontSize":{"mobile":"14px"},"color":"rgba(255, 255, 255, 1)"},"paddingLeft":{"mobile":"0px","desktop":"0px"},"borderColor":"unset","border":{"style":"hidden"},"background":"rgba(0, 0, 0, 1)"}},"misc":{"labelTag":"span","tag":"div","dateTime":"00:40","countdownType":"evergreen","type":"countdown","items":[{"text":"Days","show":false},{"show":false,"text":"Hours"},{"show":true,"text":"Minutes"},{"text":"Seconds","show":true}]},"compKey":"4d189970-1b0c-476d-ac8f-391836fe7538"},{"misc":{"labelTag":"span","dateTime":"00:40","items":[{"text":"Days","show":false},{"show":false,"text":"Hours"},{"text":"Minutes","show":true},{"text":"Seconds","show":true}],"type":"countdown","countdownType":"evergreen","tag":"div"},"compKey":"cdfe83e7-f93f-4de6-88a7-033a930dd035","style":{"outer":{"marginTop":{"mobile":"10px"},"paddingTop":{"mobile":"5px"},"background":"transparent"},"countdown":{"paddingLeft":{"mobile":"5px"},"paddingRight":{"mobile":"5px"},"label":{"color":"rgba(255, 255, 255, 1)","fontSize":{"mobile":"14px"}},"border":{"style":"hidden"},"background":"rgba(0, 0, 0, 1)","maxWidth":{"mobile":"180px"},"gap":{"mobile":"16px"},"paddingTop":{"mobile":"5px"},"paddingBottom":{"mobile":"5px"},"digits":{"fontSize":{"mobile":"50px"},"color":"rgba(255, 255, 255, 1)"},"borderColor":"unset"}}}];

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