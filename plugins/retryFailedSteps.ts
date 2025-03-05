/* eslint-disable import/no-extraneous-dependencies */
import { event, recorder } from 'codeceptjs/lib'
import { log } from 'codeceptjs/lib/output'

const defaultConfig = {
	retries: 3,
	defaultIgnoredSteps: [
		'amOnPage',
		'wait*',
		'send*',
		'execute*',
		'run*',
		'have*',
	],
	factor: 1.5,
	ignoredSteps: [],
}

module.exports = (config) => {
	const mergedConfig = { ...defaultConfig, ...config }
	mergedConfig.ignoredSteps = mergedConfig.ignoredSteps.concat(
		mergedConfig.defaultIgnoredSteps
	)
	const customWhen = mergedConfig.when

	let enableRetry = false

	const when = (err) => {
		if (!enableRetry) {
			return false
		}
		if (customWhen) {
			return !!customWhen(err)
		}
		return true
	}

	mergedConfig.when = when

	event.dispatcher.on(event.step.started, (step) => {
		if (process.env.TRY_TO === 'true') {
			log('Info: RetryFailedStep plugin is disabled inside tryTo block')
			return
		}

		// if a step is ignored - return
		const isIgnoredStep = mergedConfig.ignoredSteps.some((ignored) => {
			if (step.name === ignored) {
				return true
			}
			if (ignored instanceof RegExp && step.name.match(ignored)) {
				return true
			}
			if (
				typeof ignored === 'string' &&
				ignored.includes('*') &&
				step.name.startsWith(ignored.slice(0, -1))
			) {
				return true
			}
			return false
		})

		if (isIgnoredStep) {
			return
		}

		enableRetry = true // enable retry for a step
	})

	event.dispatcher.on(event.step.finished, () => {
		enableRetry = false
	})

	event.dispatcher.on(event.test.before, (test) => {
		if (test && test.disableRetryFailedStep) {
			return
		} // disable retry when a test is not active
		// this env var is used to set the retries inside _before() block of helpers
		process.env.FAILED_STEP_RETRIES = mergedConfig.retries
		recorder.retry(mergedConfig)
	})
}
