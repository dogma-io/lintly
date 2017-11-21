#! /usr/bin/env node

/**
 * @flow
 */

import {CLIEngine} from 'eslint'
import chalk from 'chalk'
import path from 'path'

/**
 * Get human friendly label for severity
 * @param severity - sevrity
 * @returns sevrity label
 */
function getSeverityLabel(severity: number): string {
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
 * @param filePath - path to file
 */
function printFilePath(filePath: string): void {
  const relativeFilePath = filePath
    .replace(process.cwd(), '')
    .replace(/^\//, '')

  const underlinedText = chalk.underline(relativeFilePath)
  console.log(underlinedText)
}

/**
 * Print path to file as part of linting results
 * @param line - line in which linting issue occurs
 * @param column - column in which linting issue occurs
 * @param severity - severity of linting issue ("error" or "warning")
 * @param message - linting message
 * @param rule - linting rule
 */
function printLintItem(
  line: number,
  column: number,
  severity: string,
  message: string,
  rule: string,
): void {
  const position = chalk.dim(`${line}:${column}`)
  const severityColor = severity === 'error' ? 'red' : 'yellow'

  rule = chalk.dim(rule)
  severity = chalk[severityColor](severity)

  console.log(`  ${position}  ${severity}  ${message}  ${rule}`)
}

/**
 * Print summary of linting results for a particular linter/file type
 * @param label - label for summary (language being linted)
 * @param errors - error count
 * @param warnings - warning count
 */
function printLintSummary(
  label: string,
  errors: number,
  warnings: number,
): void {
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
