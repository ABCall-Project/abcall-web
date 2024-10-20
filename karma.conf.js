module.exports = function (config) {
    config.set({
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),   // Add the karma-coverage plugin
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      reporters: ['progress', 'coverage'],  // Include the coverage reporter
      coverageReporter: {
        type: 'html',
        dir: require('path').join(__dirname, './coverage'),
        check: {
          global: {
            statements: 50,
            branches: 50,
            functions: 50,
            lines: 50
          }
        }
      },
      browsers: ['Chrome'],
      singleRun: false,
      restartOnFileChange: true
    });
  };