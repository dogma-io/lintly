#! /usr/bin/env node

import {CLIEngine} from 'eslint'
import chalk from 'chalk'
import path from 'path'

/**
 * Get human friendly label for severity
 * @param {Number} severity - sevrity
 * @returns {String} sevrity label
 */
function getSeverityLabel(severity) {
  switch (severity) {
    case 1:
      return 'warning'

    case 2:
      return 'error'

    default:
      return 'unknown'
  }
}

/**
 * Print path to file as part of linting results
 * @param {String} filePath - path to file
 */
function printFilePath(filePath) {
  const relativeFilePath = filePath
    .replace(process.cwd(), '')
    .replace(/^\//, '')

  const underlinedText = chalk.underline(relativeFilePath)
  console.log(underlinedText)
}

/**
 * Print path to file as part of linting results
 * @param {Number} line - line in which linting issue occurs
 * @param {Number} column - column in which linting issue occurs
 * @param {String} severity - severity of linting issue ("error" or "warning")
 * @param {String} message - linting message
 * @param {String} rule - linting rule
 */
function printLintItem(line, column, severity, message, rule) {
  const position = chalk.dim(`${line}:${column}`)
  const severityColor = severity === 'error' ? 'red' : 'yellow'

  rule = chalk.dim(rule)
  severity = chalk[severityColor](severity)

  console.log(`  ${position}  ${severity}  ${message}  ${rule}`)
}

/**
 * Print summary of linting results for a particular linter/file type
 * @param {String} label - label for summary (language being linted)
 * @param {Number} errors - error count
 * @param {Number} warnings - warning count
 */
function printLintSummary(label, errors, warnings) {
  const color =
    errors === 0 ? (warnings === 0 ? 'bgGreen' : 'bgYellow') : 'bgRed'

  let coloredText = chalk[color](
    ` ${label}: ${errors} errors, ${warnings} warnings `,
  )

  if (color === 'bgRed') {
    coloredText = chalk.white(coloredText)
  }

  const boldColoredText = chalk.bold(coloredText)

  console.log(`${boldColoredText}\n`)
}

const cli = new CLIEngine({
  configFile: path.join(__dirname, 'config.js'),
})

const files = process.argv.slice(2)
const {errorCount, results, warningCount} = cli.executeOnFiles(files)

results.forEach(({filePath, messages}) => {
  if (!messages.length) return

  printFilePath(filePath)

  messages.forEach(({column, line, message, ruleId, severity}) => {
    printLintItem(
      line,
      column,
      getSeverityLabel(severity),
      message.replace(/\.$/, ''),
      ruleId,
    )
  })

  console.log('') // logging empty line
})

printLintSummary('Javascript', errorCount, warningCount)

if (errorCount) {
  process.exit(1)
}
