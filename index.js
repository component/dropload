
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
  this.validate(function(file, fn){ fn(); });
}

/**
 * Mixin emitter.
 */

Emitter(Dropload.prototype);

/**
 * Define a validation `fn`.
 *
 * Examples:
 *
 *    drop.validate(function(file, fn){
 *      var limit = 1024 * 1024;
 *      var type = file.type.split('/')[0];
 *      if ('image' != type) return fn(new Error("that's not an image :)"));
 *      if (file.size > limit) return fn(new Error('file size of 1mb exceeded'));
 *      fn();
 *    });
 *
 * @param {Function} fn
 * @return {Dropload}
 * @api public
 */

Dropload.prototype.validate = function(fn){
  this._validate = fn;
  return this;
};

/**
 * Dragenter handler.
 */

Dropload.prototype.ondragenter = function(e){
  this.classes.add('over');
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
  var self = this;
  for (var i = 0, len = files.length; i < len; ++i) {
    (function(file){
      var upload = new Upload(file);
      self._validate(file, function(err){
        if (err) return self.emit('error', err, file);
        self.emit('upload', upload);
      });
    })(files[i]);
  }
};
