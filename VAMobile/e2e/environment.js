const {
  DetoxCircusEnvironment,
} = require('detox/runners/jest');
const _ = require('lodash');
import { device } from 'detox'

class PlatformPrepender {

  add_test(event, state) {
    const platform = device.getPlatform();
    const currentTest = _.last(state.currentDescribeBlock.children);
    currentTest.name = `[${platform}] ${currentTest.name}`;
  }
}

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config, context) {
    super(config, context);

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    this.registerListeners({
      PlatformPrepender,
    });
  }
}

module.exports = CustomDetoxEnvironment;
