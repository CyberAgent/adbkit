/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class ServiceMap {
  constructor() {
    this.remotes = Object.create(null);
    this.count = 0;
  }

  end() {
    for (let remoteId in this.remotes) {
      const remote = this.remotes[remoteId];
      remote.end();
    }
    this.remotes = Object.create(null);
    this.count = 0;
  }

  insert(remoteId, socket) {
    if (this.remotes[remoteId]) {
      throw new Error(`Remote ID ${remoteId} is already being used`);
    } else {
      this.count += 1;
      return this.remotes[remoteId] = socket;
    }
  }

  get(remoteId) {
    return this.remotes[remoteId] || null;
  }

  remove(remoteId) {
    let remote;
    if (remote = this.remotes[remoteId]) {
      delete this.remotes[remoteId];
      this.count -= 1;
      return remote;
    } else {
      return null;
    }
  }
}

module.exports = ServiceMap;
