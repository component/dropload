
/**
 * Module dependencies.
 */

var Emitter = require('emitter')
  , classes = require('classes')
  , Upload = require('upload');

/**
 * Expose `Dropload`.
 */

module.exports = Dropload;

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
  el.addEventListener('drop', this.ondrop.bind(this), false);
  el.addEventListener('dragenter', this.ondragenter.bind(this), false);
  el.addEventListener('dragleave', this.ondragleave.bind(this), false);
  el.addEventListener('dragover', this.ondragover.bind(this), false);
}

/**
 * Mixin emitter.
 */

Emitter(Dropload.prototype);

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
  this.upload(e.dataTransfer.files);
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
  for (var i = 0, len = files.length; i < len; ++i) {
    this.emit('upload', new Upload(files[i]));
  }
};
