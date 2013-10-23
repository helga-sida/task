(function() {
			requirejs.config({
				baseUrl: 'scripts/components',
			    paths: {
			        jquery: 'jquery/jquery.min',
			        underscore: 'underscore/underscore-min',
			        backbone: 'backbone/backbone-min',
			        markdown: 'markdown/lib/markdown',
			        codemirror : "codemirror/lib/codemirror",
    				codemirrorMarkdown: "codemirror/mode/markdown/markdown",
			    },
			    shim: {
			    	jquery: {
			    		exports: '$'
			    	},
			        backbone: {
			            deps: ['underscore', 'jquery'],
			            exports: 'Backbone'
			        },
			        underscore: {
			            exports: '_'
			        },
			        markdown: {
			        	exports: 'markdown'
			        },
			        codemirrorMarkdown: {
			        	deps: ['codemirror'],
			        	exports: 'CodeMirror'
			        }
			    }
			});

			
			require(['jquery', 'backbone', 'markdown', 'codemirrorMarkdown'],
				function   ($, Backbone, markdown, CodeMirror) {
					var NewsView = Backbone.View.extend({
						el: $('.container'),

					    events: {
					        'click #redact-news': 'redactNews' 
					    },

					    redactNews: function () {
					    	var self = this;

					    	$('#news-container')
									.addClass('news-to-right')
									.animate({'left': '600px'}, 200, function () {
										self.enabelEditor();
										
									});

					    	
					    	$(document).on('saveChanges', function (event, html) {
					    		$('#result')
					    			.empty()
					    			.html(html);
					    		$('#news-container').animate({'left': '15px'}, 200);
					    	});
					    	
					    },

					    enabelEditor: function () {
					    	var self = this;

					    	if (self.hasNotEditor) {
								var editorSettings = {
					    			'editorId': 'code',
					    			'resultId': 'result-id',
					    			'editorContainer': 'editor',
								    'buttonResult': 'button'
								}		

					    		$(document).trigger('createEditor', editorSettings);
					    		self.hasNotEditor = false;

					    	} else {
								$(document).trigger('showEditor');

							}
					    },

					    hasNotEditor: true

					});


					var MarkdownEditor = function (editorId, resultId, editorContainer, buttonResult) {

						var that = this;

						that.init = function () {
							var myCodeMirror = that.createNewEditor();

							myCodeMirror.on('change', function() {
								that.fixChanges(myCodeMirror);
							});

							$(document)
								.on('click', '#'+buttonResult, function () {
									$('#' + editorContainer).fadeOut(200, function () {
										var html = $('#'+resultId).html();
										$(document).trigger('saveChanges', html);

									});

								})
								.on('showEditor', function () {
									$('#' + editorContainer).fadeIn(200);

								});

						}

						that.createNewEditor = function () {
							var settings = {
								lineNumbers: true,
        						lineWrapping: true,
        						mode: 'markdown'
							};

							var editor =  CodeMirror.fromTextArea(
													document.getElementById(editorId), 
													settings
												);

							that.createContainerForChanges(editor);

							return editor;
						}

						that.createContainerForChanges = function (editor) {
							that.createEditorSrtruct();
							that.fixChanges(editor);	

						}

						that.createEditorSrtruct = function () {
							var divResult = $('<div>', { 
												'id': resultId,
												'class': 'md-preview'
											});
							var buttonSave = $('<button>', { 
												'id': buttonResult,
												'text': 'Save'
											});

							$('#'+editorContainer)
								.append(divResult)
								.append(buttonSave);

						}

						that.fixChanges = function (editorCM) {
							var newMarkdown = editorCM.getValue();
							var newMarkup = markdown.toHTML(newMarkdown);
							$('#'+resultId).html(newMarkup);

						}
						
					};

					var news_view = new NewsView;

					$(document).on('createEditor', function (event, editorSettins) {
						var editor = new MarkdownEditor(
											editorSettins.editorId, 
											editorSettins.resultId, 
											editorSettins.editorContainer, 
											editorSettins.buttonResult
										);
					    editor.init();
					})
				});

			}());