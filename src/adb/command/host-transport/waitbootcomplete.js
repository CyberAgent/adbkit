/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const debug = require('debug')('adb:command:waitboot');

const Command = require('../../command');
const Protocol = require('../../protocol');

class WaitBootCompleteCommand extends Command {
  execute() {
    this._send( 
      'shell:while getprop sys.boot_completed 2>/dev/null; do sleep 1; done');
    return this.parser.readAscii(4)
      .then(reply => {
        switch (reply) {
          case Protocol.OKAY:
            return this.parser.searchLine(/^1$/)
              .finally(() => {
                return this.parser.end();
            }).then(() => true);
          case Protocol.FAIL:
            return this.parser.readError();
          default:
            return this.parser.unexpected(reply, 'OKAY or FAIL');
        }
    });
  }
}

module.exports = WaitBootCompleteCommand;
