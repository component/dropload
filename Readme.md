# upload

  file upload and progress api

## Installation

    $ component install component/dropload

## Events

  - `upload` (upload) a file was dropped
  - `text` (string) string representation
  - `url` (string) url representation
  - `html` (string) html representation

## Example

```js
var Dropload = require('dropload');
var drop = Dropload(document.getElementById('drop'));

drop.on('error', function(err){
  console.error(err.message);
});

drop.on('upload', function(upload){
  console.log('uploading %s', upload.file.name);
  upload.to('/upload');
});

drop.on('text', function(str){
  console.log('text "%s"', str);
});

drop.on('url', function(str){
  console.log('url "%s"', str);
});

drop.on('html', function(str){
  console.log('html "%s"', str);
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

