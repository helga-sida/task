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
					    	if (self.hasNotEditor) {

					    		var editorSettings = {
					    			'editorId': 'code',
					    			'resultId': 'result-id',
					    			'editorContainer': 'editor',
					    			'buttonResult': 'button',
					    			'self': self
					    		}		

					    		$(document).trigger('createEditor', editorSettings);
					    		self.hasNotEditor = false;

					    	} else {
					    		$(document).trigger('showEditor');

					    	}

					    	self.bind('saveChanges', function (html) {
					    		$('#result').empty().html(html);
					    	});
					    	
					    },

					    hasNotEditor: true

					});


					var MarkdownEditor = function (editorId, resultId, editorContainer, buttonResult, self) {

						var that = this;

						that.init = function () {
							var myCodeMirror = that.createNewEditor();

							myCodeMirror.on('change', function() {
								that.fixChanges(myCodeMirror);
							});

							$(document)
								.on('click', '#'+buttonResult, function () {
									that.hideEditor();
									self.trigger('saveChanges', $('#'+resultId).html());

								})
								.on('showEditor', function () {
									
									$('#' + editorContainer).show();
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
							var divResult = $('<div>', { 'id': resultId});
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

						that.hideEditor = function () {
							$('#' + editorContainer).hide();
						}

						
					};

					var news_view = new NewsView;

					$(document).on('createEditor', function (event, editorSettins) {
						var editor = new MarkdownEditor(
											editorSettins.editorId, 
											editorSettins.resultId, 
											editorSettins.editorContainer, 
											editorSettins.buttonResult, 
											editorSettins.self
										);
					    editor.init();
					})
				});

			}());