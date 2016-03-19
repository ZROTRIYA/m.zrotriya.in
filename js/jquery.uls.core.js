(function($){'use strict';var template,ULS;template='\
		<div class="grid uls-menu uls-wide"> \
			<div class="row"> \
				<span id="uls-close" class="icon-close"></span> \
			</div> \
			<div class="row"> \
				<div class="uls-title-region seven columns">\
					<h1 data-i18n="uls-select-language" class="uls-title">Select Language</h1>\
				</div>\
				<div class="five columns map-block" id="map-block">\
					<div class="row">\
						<div data-regiongroup="1" id="uls-region-1" class="three columns uls-region uls-region-1">\
							<a data-i18n="uls-region-WW">Worldwide</a>\
						</div>\
						<div class="nine columns">\
							<div class="row uls-worldmap">\
								<div data-regiongroup="2" id="uls-region-2" class="four columns uls-region">\
									<a data-i18n="uls-region-AM">America</a>\
								</div>\
								<div data-regiongroup="3" id="uls-region-3" class="four columns uls-region">\
									<a><span data-i18n="uls-region-EU">Europe</span><br>\
									<span data-i18n="uls-region-ME">Middle East</span><br>\
									<span data-i18n="uls-region-AF">Africa</span></a>\
								</div>\
								<div data-regiongroup="4" id="uls-region-4" class="four columns uls-region">\
									<a><span data-i18n="uls-region-AS">Asia</span><br>\
									<span data-i18n="uls-region-PA">Pacific</span></a>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			</div>\
			<div id="search" class="row search"> \
				<div class="one column">\
					<span class="search-label"></span>\
				</div>\
				<div class="ten columns">\
					<div id="search-input-block" class="search-input-block">\
						<input type="text" class="filterinput filtersuggestion" id="filtersuggestion" disabled="true"\
							autocomplete="off" /> <input type="text" class="filterinput languagefilter" id="languagefilter"\
							data-clear="languagefilter-clear" data-suggestion="filtersuggestion"\
							placeholder="Language search" autocomplete="off" />\
					</div>\
				</div>\
				<div class="one column">\
					<span id="languagefilter-clear" class="languagefilter-clear"></span>\
				</div>\
			</div>\
			<div class="row uls-language-list"></div>\
			<div class="row" id="settings-block"></div>\
		</div> ';ULS=function(element,options){this.$element=$(element);this.options=$.extend({},$.fn.uls.defaults,options);this.$menu=$(template);this.languages=this.options.languages;for(var code in this.languages){if($.uls.data.languages[code]===undefined){if(window.console&&window.console.log){window.console.log('ULS: Unknown language '+code+'.');}delete this.languages[code];}}this.left=this.options.left;this.top=this.options.top;this.shown=false;this.initialized=false;this.$languageFilter=this.$menu.find('#languagefilter');this.$regionFilters=this.$menu.find('.uls-region');this.$resultsView=this.$menu.find('div.uls-language-list');this.render();this.listen();this.ready();};ULS.prototype={constructor:ULS,ready:function(){if(this.options.onReady){this.options.onReady.call(this);}},visible:function(){if(this.options.onVisible){this.options.onVisible.call(this);}},position:function(){var pos=$.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});return{top:this.top||pos.top+pos.height,left:this.left||'25%'};},show:function(){this.$menu.css(this.position());if(this.options.compact){this.$menu.addClass('uls-compact');}if(!this.initialized){$('body').prepend(this.$menu);this.i18n();this.defaultSearch();this.initialized=true;}$('.uls-menu').hide();this.$menu.show();this.$menu.scrollIntoView();this.shown=true;if(!this.isMobile()){this.$languageFilter.focus();}this.visible();},i18n:function(){if($.i18n){this.$menu.find('[data-i18n]').i18n();this.$languageFilter.prop('placeholder',$.i18n('uls-search-placeholder'));}},defaultSearch:function(){this.$resultsView.lcd('empty');this.$regionFilters.regionselector('show');},hide:function(){this.$menu.hide();this.shown=false;},render:function(){},noresults:function(){this.$resultsView.lcd('noResults');},success:function(){this.$resultsView.show();},listen:function(){var lcd,uls=this;uls.$element.on('click',$.proxy(uls.click,uls));uls.$languageFilter.on('searchclear',$.proxy(uls.defaultSearch,uls));uls.$menu.find('#uls-close').on('click',$.proxy(uls.cancel,uls));uls.$menu.on('click',function(e){e.stopPropagation();});uls.$menu.on('keypress',$.proxy(this.keypress,this)).on('keyup',$.proxy(this.keyup,this));if(this.eventSupported('keydown')){this.$menu.on('keydown',$.proxy(this.keypress,this));}lcd=uls.$resultsView.lcd({languages:uls.languages,quickList:uls.options.quickList,clickhandler:$.proxy(uls.select,uls),source:uls.$languageFilter,showRegions:uls.options.showRegions}).data('lcd');uls.$languageFilter.languagefilter({$target:lcd,languages:uls.languages,success:function(){$('.regionselector').removeClass('active');uls.success();},noresults:function(){$('.regionselector').removeClass('active');uls.noresults();},searchAPI:uls.options.searchAPI,onSelect:$.proxy(uls.select,uls)});this.$menu.find('.uls-region, .uls-region-link').regionselector({$target:lcd,languages:uls.languages,success:function(regionfilter){uls.$languageFilter.languagefilter('deactivate');if(regionfilter.regionGroup===1){lcd.quicklist();}uls.success();},noresults:function(){uls.$languageFilter.languagefilter('clear');}});$('html').click($.proxy(this.hide,this));},select:function(langCode){this.hide();this.$languageFilter.trigger('searchclear');if(this.options.onSelect){this.options.onSelect.call(this,langCode);}},cancel:function(){this.hide();if(this.options.onCancel){this.options.onCancel.call(this);}},keyup:function(e){if(!this.shown){return;}if(e.keyCode===27){this.cancel();e.preventDefault();e.stopPropagation();}},keypress:function(e){if(!this.shown){return;}if(e.keyCode===27){this.cancel();e.preventDefault();e.stopPropagation();}},click:function(e){e.stopPropagation();e.preventDefault();if(this.shown){this.hide();}else{this.show();}},eventSupported:function(eventName){var isSupported=eventName in this.$menu;if(!isSupported){this.$element.setAttribute(eventName,'return;');isSupported=typeof this.$element[eventName]==='function';}return isSupported;},isMobile:function(){return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);}};$.fn.uls=function(option){return this.each(function(){var $this=$(this),data=$this.data('uls'),options=typeof option==='object'&&option;if(!data){$this.data('uls',(data=new ULS(this,options)));}if(typeof option==='string'){data[option]();}});};$.fn.uls.defaults={menu:template,onSelect:null,searchAPI:null,languages:$.uls.data.getAutonyms(),quickList:null,compact:false,showRegions:['WW','AM','EU','ME','AF','AS','PA']};if(!$.fn.i18n){$.fn.i18n=function(){};}$.fn.scrollIntoView=function(){return this.each(function(){var scrollPosition,$window=$(window),windowHeight=$window.height(),windowTop=$window.scrollTop(),windowBottom=windowTop+windowHeight,$element=$(this),panelHeight=$element.height(),panelTop=$element.offset().top,panelBottom=panelTop+panelHeight;if((panelTop<windowTop)||(panelBottom>windowBottom)){if(windowTop>panelTop){scrollPosition=panelTop;}else{scrollPosition=panelBottom-windowHeight;}$('html, body').stop().animate({scrollTop:scrollPosition},500);}});};$.fn.uls.Constructor=ULS;}(jQuery));