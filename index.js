
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
  this.ignored = {};
}

/**
 * Mixin emitter.
 */

Emitter(Dropload.prototype);

/**
 * Ignore `name`.
 *
 * @param {String} name
 * @api private
 */

Dropload.prototype.ignore = function(name){
  this.ignored[name] = true;
};

/**
 * Check if `name` is ignored.
 *
 * @param {String} name
 * @return {Boolean}
 * @api private
 */

Dropload.prototype.ignoring = function(name){
  return !! this.ignored[name];
};

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
  var files = e.dataTransfer.files;
  this.emit('drop', e);
  if (items) this.directories(items);
  if (items) this.items(items);
  if (files) this.upload(files);
  this.ignored = {};
};

/**
 * Walk directories and upload files.
 *
 * Directories are considered "files",
 * non-files return null for .webkitGetAsEntry()
 * for example when dragging urls.
 *
 * @param {DataTransferItemList} items
 * @api private
 */

Dropload.prototype.directories = function(items){
  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    if ('file' != item.kind) continue;

    if (!item.webkitGetAsEntry) continue;
    var entry = item.webkitGetAsEntry();

    if (entry.isDirectory) {
      this.ignore(entry.name);
      this.walkEntry(entry);
    }
  }
};

/**
 * Handle the given `items`.
 *
 * @param {DataTransferItemList}
 * @api private
 */

Dropload.prototype.items = function(items){
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    this.item(item);
  }
};

/**
 * Walk file entry recursively.
 *
 * @param {FileEntry} item
 * @api private
 */

Dropload.prototype.walkEntry = function(item){
  var self = this;

  if (item.isFile) {
    return item.file(function(file){
      file.entry = item;
      self.upload([file]);
    });
  }

  if (item.isDirectory) {
    var dir = item.createReader();
    dir.readEntries(function(entries){
      for (var i = 0; i < entries.length; i++) {
        var name = entries[i].name;
        if ('.' == name[0]) continue;
        self.walkEntry(entries[i]);
      }
    })
  }
};

/**
 * Handle `item`.
 *
 * @param {Object} item
 * @api private
 */

Dropload.prototype.item = function(item){
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
    var file = files[i];
    if (this.ignoring(file.name)) continue;
    this.emit('upload', new Upload(file));
  }
};
