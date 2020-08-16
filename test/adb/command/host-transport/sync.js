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
const SyncCommand = require('../../../../src/adb/command/host-transport/sync');

describe('SyncCommand', () => it("should send 'sync:'", function(done) {
  const conn = new MockConnection;
  const cmd = new SyncCommand(conn);
  conn.socket.on('write', function(chunk) {
    expect(chunk.toString()).to.equal( 
      Protocol.encodeData('sync:').toString());
    conn.socket.causeRead(Protocol.OKAY);
    return conn.socket.causeEnd();
  });
  return cmd.execute()
    .then(() => done());
}));
