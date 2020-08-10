const { 
  After: after,
  Before: before,
  BeforeAll: beforeAll,
  When: when,
  Then: then
} = require('cucumber');
const { exec } = require("child_process")

beforeAll({timeout: 60 * 1000}, callback => {
  console.log("Building test image, this may take a while the first time.")
  exec("docker build -t aac-test-runner ./features/fixtures/docker",
    (err, stdout, stderr) => {
      callback(err)
    }
  )
});

before((testCase, callback) => {
  exec("docker run -itd --name cucumber-shell-tests aac-test-runner", 
    (err, stdout, stderr) => {
      callback(err)
    }
  )
});

after((tests, callback) => {
  exec("docker rm -f cucumber-shell-tests", 
    (err, stdout, stderr) => {
      callback(err)
    }
  )
});

when(/^I run (.*)$/, (cmd, callback) => {
  exec("docker exec aac-tests " + cmd, 
    (err, stdout, stderr) => {
      this.err = err 
      this.stdout = stdout
      this.stderr = stderr
      callback()
    }
  )
});

then(/^the command should(n't)? fail$/, (shouldFail, callback) => {
  callback(shouldFail === this.err)
})

then(/^stdout should contain (.*)$/, (str, callback) => {
  result = this.stdout.indexOf(str) != -1
  callback(!result && {expected: str, actual: this.stdout})
});

then(/^stderr should contain (.*)$/, (str, callback) => {
  result = this.stderr.indexOf(str) != -1
  callback(!result && {expected: str, actual: this.stderr})
});

