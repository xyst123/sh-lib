const chalk = require('chalk');
const semver = require('semver');
const shell = require('shelljs');
const childProcess = require('child_process');
const packageConfig = require('../package.json');

function exec(cmd) {
  return childProcess.execSync(cmd).toString().trim();
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node,
  },
];

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm,
  });
}

module.exports = function checkVersion() {
  const warnings = [];
  versionRequirements.forEach((module) => {
    if (!semver.satisfies(module.currentVersion, module.versionRequirement)) {
      warnings.push(`${module.name}: ${
        chalk.red(module.currentVersion)} should be ${
        chalk.green(module.versionRequirement)}`);
    }
  });

  if (warnings.length) {
    console.log('');
    console.log(chalk.yellow('您需要更新以下模块：'));
    warnings.forEach((warning) => {
      console.log(` ${warning}`);
    });
    process.exit(1);
  }
};
