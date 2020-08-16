/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Sinon = require('sinon');
const Chai = require('chai');
Chai.use(require('sinon-chai'));
const {expect} = Chai;

const MockConnection = require('../../../mock/connection');
const Protocol = require('../../../../src/adb/protocol');
const RebootCommand = require('../../../../src/adb/command/host-transport/reboot');

describe('RebootCommand', function() {

  it("should send 'reboot:'", function(done) {
    const conn = new MockConnection;
    const cmd = new RebootCommand(conn);
    conn.socket.on('write', chunk => expect(chunk.toString()).to.equal( 
      Protocol.encodeData('reboot:').toString()));
    setImmediate(function() {
      conn.socket.causeRead(Protocol.OKAY);
      return conn.socket.causeEnd();
    });
    return cmd.execute()
      .then(() => done());
  });

  return it("should send wait for the connection to end", function(done) {
    const conn = new MockConnection;
    const cmd = new RebootCommand(conn);
    let ended = false;
    conn.socket.on('write', chunk => expect(chunk.toString()).to.equal( 
      Protocol.encodeData('reboot:').toString()));
    setImmediate(() => conn.socket.causeRead(Protocol.OKAY));
    setImmediate(function() {
      ended = true;
      return conn.socket.causeEnd();
    });
    return cmd.execute()
      .then(function() {
        expect(ended).to.be.true;
        return done();
    });
  });
});
