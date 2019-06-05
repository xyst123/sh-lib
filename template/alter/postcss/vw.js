// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  "plugins": {
    "postcss-px-to-viewport": {
      "viewportWidth": 750,
      "unitPrecision": 3,
      "viewportUnit": "vw",
      "selectorBlackList": [
        ".ignore",
        ".hairlines"
      ],
      "minPixelValue": 1,
      "mediaQuery": false
    }
  }
}
