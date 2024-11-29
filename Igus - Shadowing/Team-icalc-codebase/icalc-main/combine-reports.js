const { execSync } = require('child_process');
const fs = require('fs-extra');

const run = (commands) => {
  commands.forEach((command) => execSync(command, { stdio: 'inherit' }));
};

const UNIT_OUTPUT_FOLDER = './coverage/unit';
const E2E_OUTPUT_FOLDER = './coverage/e2e';
const REPORTS_FOLDER = './coverage';

// Will be used later maybe to combine e2e and unit tests in one report
const E2E_REPORT = {
  dir: `./apps/calculator-e2e/coverage/coverage-final.json`,
  destination: `${REPORTS_FOLDER}/calculator-e2e.coverage.json`,
};

const REPORT_DIRECTORIES = [
  {
    dir: `${REPORTS_FOLDER}/apps/calculator/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/calculator.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/apps/data-service/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/data-service.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/auth/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/auth.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/auth/infrastructure/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/auth-infrastructure.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/calculations/application/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/calculations-application.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/calculations/infrastructure/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/calculations-infrastructure.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/calculations/presentation/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/calculations-presentation.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/common/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/common.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/configurations/application/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/configurations-application.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/configurations/infrastructure/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/configurations-infrastructure.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/configurations/presentation/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/configurations-presentation.coverage.json`,
  },
  {
    dir: `${REPORTS_FOLDER}/libs/domain/coverage-final.json`,
    destination: `${REPORTS_FOLDER}/domain.coverage.json`,
  },
  //E2E_REPORT,
];

const cleanUpSingleUnitTestCoverageFiles = () => {
  REPORT_DIRECTORIES.forEach((report) => {
    fs.rm(report.destination);
  });

  //fs.rmdir(`./apps/calculator-e2e/coverage`, { recursive: true, force: true });
  fs.rmdir(`${REPORTS_FOLDER}/apps`, { recursive: true, force: true });
  fs.rmdir(`${REPORTS_FOLDER}/libs`, { recursive: true, force: true });
};

REPORT_DIRECTORIES.forEach((report) => {
  fs.copyFileSync(report.dir, report.destination);
});

run([
  `nyc merge ${REPORTS_FOLDER} ./coverage/unit/merged-coverage.json`,
  `nyc report --reporter html --report-dir ${UNIT_OUTPUT_FOLDER} --temp-dir ${UNIT_OUTPUT_FOLDER}`,
]);
cleanUpSingleUnitTestCoverageFiles();

fs.copyFileSync(E2E_REPORT.dir, E2E_REPORT.destination);

run([`nyc report --reporter html --report-dir ${E2E_OUTPUT_FOLDER} --temp-dir ${REPORTS_FOLDER}`]);
fs.rm(`${REPORTS_FOLDER}/calculator-e2e.coverage.json`);
fs.rmdir(`./apps/calculator-e2e/coverage`, { recursive: true, force: true });
fs.rmdir(`./apps/calculator-e2e/.nyc_output`, { recursive: true, force: true });
