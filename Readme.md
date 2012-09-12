
# upload

  file upload and progress api

## Installation

    $ component install component/upload

## Events

  - `error` (err) an error occurred
  - `upload` (upload) a file was dropped

## Example

```js
var Dropload = require('dropload');
var drop = Dropload(document.getElementById('drop'));

drop.validate(function(file, fn){
  var limit = 1024 * 1024;
  var type = file.type.split('/')[0];
  if ('image' != type) return fn(new Error("that's not an image :)"));
  if (file.size > limit) return fn(new Error('file size of 1mb exceeded'));
  fn();
});

drop.on('error', function(err){
  console.error(err.message);
});

drop.on('upload', function(upload){
  console.log('uploading %s', upload.file.name);
  upload.to('/upload');
});
```

## API

### Dropload(el)

  Initialize an `Dropload` with the given drop point `el`.

```js
var drop = new Dropload(el);
var drop = Dropload(el);
```

### Upload#validate(fn)

  Perform arbitrary validations on the `File` objects. The example
  below ensures that a mime type of "image/*" is given, and that
  the file size does not exceed 1mb.

```js
drop.validate(function(file, fn){
  var limit = 1024 * 1024;
  var type = file.type.split('/')[0];
  if ('image' != type) return fn(new Error("that's not an image :)"));
  if (file.size > limit) return fn(new Error('file size of 1mb exceeded'));
  fn();
});
```

## Running example

  Run the Express test server:

```
$ npm install
$ make test
```

# License

  MIT

