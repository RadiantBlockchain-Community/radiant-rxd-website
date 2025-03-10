(function() {
    var ReadMore = function(element) {
      this.element = element;
      this.moreContent = this.element.getElementsByClassName('js-read-more__content');
      this.count = this.element.getAttribute('data-characters') || 200;
      this.counting = 0;
      this.btnClasses = this.element.getAttribute('data-btn-class');
      this.ellipsis = this.element.getAttribute('data-ellipsis') && this.element.getAttribute('data-ellipsis') == 'off' ? false : true;
      this.btnShowLabel = 'Read more';
      this.btnHideLabel = 'Read less';
      this.toggleOff = this.element.getAttribute('data-toggle') && this.element.getAttribute('data-toggle') == 'off' ? false : true;
      if( this.moreContent.length == 0 ) splitReadMore(this);
      setBtnLabels(this);
      initReadMore(this);
    };
  
    function splitReadMore(readMore) { 
      splitChildren(readMore.element, readMore);
    };
  
    function splitChildren(parent, readMore) {
      if(readMore.counting >= readMore.count) {
        parent.classList.add('js-read-more__content');
        return parent.outerHTML;
      }
      var children = parent.childNodes;
      var content = '';
      for(var i = 0; i < children.length; i++) {
        if (children[i].nodeType == Node.TEXT_NODE) {
          content = content + wrapText(children[i], readMore);
        } else {
          content = content + splitChildren(children[i], readMore);
        }
      }
      parent.innerHTML = content;
      return parent.outerHTML;
    };
  
    function wrapText(element, readMore) {
      var content = element.textContent;
      if(content.replace(/\s/g,'').length == 0) return '';
      if(readMore.counting >= readMore.count) {
        return '<span class="js-read-more__content">' + content + '</span>';
      }
      if(readMore.counting + content.length < readMore.count) {
        readMore.counting = readMore.counting + content.length;
        return content;
      }
      var firstContent = content.substr(0, readMore.count - readMore.counting);
      firstContent = firstContent.substr(0, Math.min(firstContent.length, firstContent.lastIndexOf(" ")));
      var secondContent = content.substr(firstContent.length, content.length);
      readMore.counting = readMore.count;
      return firstContent + '<span class="js-read-more__content">' + secondContent + '</span>';
    };
  
    function setBtnLabels(readMore) {
      var btnLabels = readMore.element.getAttribute('data-btn-labels');
      if(btnLabels) {
        var labelsArray = btnLabels.split(',');
        readMore.btnShowLabel = labelsArray[0].trim();
        readMore.btnHideLabel = labelsArray[1].trim();
      }
    };
  
    function initReadMore(readMore) {
      readMore.moreContent = readMore.element.getElementsByClassName('js-read-more__content');
      if( readMore.moreContent.length == 0 ) {
        readMore.element.classList.add('read-more--loaded');
        return;
      }
      var btnShow = ' <button class="js-read-more__btn '+readMore.btnClasses+'">'+readMore.btnShowLabel+'</button>';
      var btnHide = ' <button class="js-read-more__btn is-hidden '+readMore.btnClasses+'">'+readMore.btnHideLabel+'</button>';
      if(readMore.ellipsis) {
        btnShow = '<span class="js-read-more__ellipsis" aria-hidden="true">...</span>'+ btnShow;
      }
  
      readMore.moreContent[readMore.moreContent.length - 1].insertAdjacentHTML('afterend', btnHide);
      readMore.moreContent[0].insertAdjacentHTML('afterend', btnShow);
      resetAppearance(readMore);
      initEvents(readMore);
    };
  
    function resetAppearance(readMore) {
      for(var i = 0; i < readMore.moreContent.length; i++) readMore.moreContent[i].classList.add('is-hidden');
      readMore.element.classList.add('read-more--loaded');
    };
  
    function initEvents(readMore) {
      readMore.btnToggle = readMore.element.getElementsByClassName('js-read-more__btn');
      readMore.ellipsis = readMore.element.getElementsByClassName('js-read-more__ellipsis');
  
      readMore.btnToggle[0].addEventListener('click', function(event){
        event.preventDefault();
        updateVisibility(readMore, true);
      });
      readMore.btnToggle[1].addEventListener('click', function(event){
        event.preventDefault();
        updateVisibility(readMore, false);
      });
    };
  
    function updateVisibility(readMore, visibile) {
      for(var i = 0; i < readMore.moreContent.length; i++) readMore.moreContent[i].classList.toggle('is-hidden', !visibile);

      readMore.btnToggle[0].classList.toggle('is-hidden', visibile);
      readMore.btnToggle[1].classList.toggle('is-hidden', !visibile);
      if(readMore.ellipsis.length > 0 ) readMore.ellipsis[0].classList.toggle('is-hidden', visibile);
      
      if(!readMore.toggleOff) readMore.btn.classList.add('is-hidden');

      if(visibile) {
        var targetTabIndex = readMore.moreContent[0].getAttribute('tabindex');
        elMoveFocus(readMore.moreContent[0]);
        resetFocusTarget(readMore.moreContent[0], targetTabIndex);
      } else {
        elMoveFocus(readMore.btnToggle[0]);
      }
    };
  
    function resetFocusTarget(target, tabindex) {
      if( parseInt(target.getAttribute('tabindex')) < 0) {
              target.style.outline = 'none';
              !tabindex && target.removeAttribute('tabindex');
          }
    };
  
    function elMoveFocus(element) {
      element.focus();
      if (document.activeElement !== element) {
        element.setAttribute('tabindex','-1');
        element.focus();
      }
    };
  
      var readMore = document.getElementsByClassName('js-read-more');
      if( readMore.length > 0 ) {
          for( var i = 0; i < readMore.length; i++) {
              (function(i){new ReadMore(readMore[i]);})(i);
          }
      };
  }());