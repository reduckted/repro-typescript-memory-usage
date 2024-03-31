const { strings } = require("@angular-devkit/core");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const path = require("node:path");

if (process.env.FORCE_COLOR === "1") {
  createRequire(require.resolve("@storybook/angular"))(
    "@storybook/node-logger"
  ).instance.enableColor();
}

/** @type {StorybookConfig} */
module.exports = {};

/**
 * @typedef {import('@schematics/angular/utility/workspace-models').WorkspaceSchema} WorkspaceSchema
 */

/**
 * @typedef {import('@storybook/angular').StorybookConfig} StorybookConfig
 */

/**
 * @typedef {import('@storybook/types').StoriesEntry} StoriesEntry
 */

/**
 * @typedef {import('sass').Options<'sync'>} SassLoaderOptions
 */

/**
 * @typedef {import('webpack').ModuleOptions} ModuleOptions
 * @typedef {import('webpack').RuleSetRule} RuleSetRule
 */
