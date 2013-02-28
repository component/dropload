
/**
 * Module dependencies.
 */

var Emitter = require('emitter')
  , classes = require('classes')
  , Upload = require('upload')
  , events = require('events')

/**
 * Expose `Dropload`.
 */

module.exports = Dropload;

/**
 * Types.
 */

var typeMap = {
  'text/plain': 'text',
  'text/uri-list': 'url',
  'text/html': 'html'
};

/**
 * Initialize a drop point
 * on the given `el`.
 *
 * Emits:
 *
 *   - `error` on validation error
 *   - `upload` passing an `Upload`
 *
 * @param {Element} el
 * @api public
 */

function Dropload(el) {
  if (!(this instanceof Dropload)) return new Dropload(el);
  Emitter.call(this);
  this.el = el;
  this.classes = classes(el);
  this.events = events(el, this);
  this.events.bind('drop');
  this.events.bind('dragenter');
  this.events.bind('dragleave');
  this.events.bind('dragover');
}

/**
 * Mixin emitter.
 */

Emitter(Dropload.prototype);

/**
 * Unbind event handlers.
 *
 * @api public
 */

Dropload.prototype.unbind = function(){
  this.events.unbind();
};

/**
 * Dragenter handler.
 */

Dropload.prototype.ondragenter = function(e){
  this.classes.add('over');
};

/**
 * Dragover handler.
 */

Dropload.prototype.ondragover = function(e){
  e.preventDefault();
};

/**
 * Dragleave handler.
 */

Dropload.prototype.ondragleave = function(e){
  this.classes.remove('over');
};

/**
 * Drop handler.
 */

Dropload.prototype.ondrop = function(e){
  e.stopPropagation();
  e.preventDefault();
  this.classes.remove('over');
  var items = e.dataTransfer.items;
  if (items) this.drop(items);
  this.upload(e.dataTransfer.files);
};

/**
 * Handle the given `items`.
 *
 * @param {DataTransferItemList}
 * @api private
 */

Dropload.prototype.drop = function(items){
  for (var i = 0; i < items.length; i++) {
    this.dropItem(items[i]);
  }
};

/**
 * Handle `item`.
 *
 * @param {Object} item
 * @api private
 */

Dropload.prototype.dropItem = function(item){
  var self = this;
  var type = typeMap[item.type];
  item.getAsString(function(str){
    self.emit(type, str, item);
  });
};

/**
 * Upload the given `files`.
 *
 * Presents each `file` in the FileList
 * as an `Upload` via the "upload" event
 * after it has been validated.
 *
 * @param {FileList} files
 * @api public
 */

Dropload.prototype.upload = function(files){
  for (var i = 0; i < files.length; i++) {
    this.emit('upload', new Upload(files[i]));
  }
};
