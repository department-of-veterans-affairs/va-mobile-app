const {
  DetoxCircusEnvironment,
  SpecReporter,
  WorkerAssignReporter,
} = require('detox/runners/jest-circus');
const _ = require('lodash');

class PlatformPrepender {
  constructor({ detox }) {
    this.detox = detox;
  }

  add_test(event, state) {
    const platform = this.detox.device.getPlatform();
    const currentTest = _.last(state.currentDescribeBlock.children);
    currentTest.name = `[${platform}] ${currentTest.name}`;
  }
}

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config, context) {
    super(config, context);

    // Can be safely removed, if you are content with the default value (=300000ms)
    this.initTimeout = 300000;

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    this.registerListeners({
      SpecReporter,
      PlatformPrepender,
      WorkerAssignReporter,
    });
  }
}

module.exports = CustomDetoxEnvironment;
