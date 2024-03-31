const { setCompodocJson } = require("@storybook/addon-docs/angular");
const { withThemeByDataAttribute } = require("@storybook/addon-themes");

setCompodocJson(require("../../../../documentation.json"));

/** @type {Preview} */
module.exports = {};

/**
 * @typedef {import('@storybook/types').Preview} Preview
 */
