var Https;

Https = require('https');

module.exports = function(grunt) {
  return grunt.registerMultiTask('keycode', 'Updates KeyEvent mapping.', function() {
    var done, options, repo_path;
    repo_path = '/android/platform_frameworks_base/master';
    done = this.async();
    options = this.options({
      original: {
        hostname: 'raw.github.com',
        path: repo_path + "/core/java/android/view/KeyEvent.java",
        method: 'GET'
      },
      regex: /public static final int (KEYCODE_[^\s]+)\s*=\s*([0-9]+);/g
    });
    return grunt.util.async.forEach(this.files, function(file, next) {
      var req;
      req = Https.request(options.original, function(res) {
        var raw;
        if (res.statusCode !== 200) {
          grunt.fail.warn("Unable to retrieve KeyEvent.java (HTTP " + res.statusCode + ")");
          return next();
        }
        raw = new Buffer('');
        res.on('data', function(chunk) {
          return raw = Buffer.concat([raw, chunk]);
        });
        return res.on('end', function() {
          var code, coffee, date, match;
          code = raw.toString();
          date = new Date().toUTCString();
          coffee = [];
          coffee.push("# Generated by `grunt keycode` on " + date);
          coffee.push("# KeyEvent.java Copyright (C) 2006 The Android Open Source Project");
          coffee.push('');
          coffee.push('module.exports =');
          while (match = options.regex.exec(code)) {
            coffee.push("  " + match[1] + ": " + match[2]);
          }
          coffee.push('');
          grunt.file.write(file.dest, coffee.join('\n'));
          grunt.log.ok("File " + file.dest + " created");
          return next();
        });
      });
      req.on('error', next);
      return req.end();
    }, done);
  });
};
