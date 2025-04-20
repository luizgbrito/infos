
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
        const modalList = [];
        const modalCont = [{"contKey":"628d857f-088b-4ba6-a463-2137dfa9832d","modalMisc":{"isGlobal":true}}]
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
              const clickeventList = [{"compKey":"bfd072e7-213b-44a6-80b9-265611f0fa6a","misc":{"type":"button"}},{"compKey":"9b079391-eb60-4229-aa4d-665d4b6ed610","misc":{"type":"text"}},{"compKey":"3f7965c6-1c97-45da-84ab-449232fe6c48","misc":{"type":"image"}},{"compKey":"f72af486-5409-43be-9b2c-5a8e277c0f7a","misc":{"type":"button"}},{"compKey":"2278dfc1-900f-4852-894e-b06619b44e47","misc":{"type":"text"}},{"compKey":"e5725d70-21dd-41ec-b9e6-aa29be0ad209","misc":{"type":"text"}},{"compKey":"895dbb9b-f5f5-47b2-87f9-1268853dc02d","misc":{"type":"text"}},{"compKey":"24055ad2-f311-4cb2-b821-4b974a43cbe8","misc":{"type":"text"}},{"compKey":"93fb7685-aaf9-4472-bb93-2f9e6cb340bb","misc":{"type":"text"}}];
    
    
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