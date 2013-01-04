# upload

  file upload and progress api

## Installation

    $ component install component/dropload

## Events

  - `upload` (upload) a file was dropped

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
```

## Running example

  Run the Express test server:

```
$ npm install
$ make test
```

# License

  MIT

