/* eslint-disable codeceptjs/no-actor-in-scenario */
import assert from 'assert'
import { colsubsidioCases } from './colsubsidioCases'

Feature('Colsubsidio - inventario y backlog de automatización')

Scenario(
	'Las matrices conservan los 49 casos de Empresas y 41 de Personas',
	() => {
		const companies = colsubsidioCases.filter(
			(testCase) => testCase.portal === 'empresas'
		)
		const people = colsubsidioCases.filter(
			(testCase) => testCase.portal === 'personas'
		)

		assert.equal(companies.length, 49)
		assert.equal(people.length, 41)
		assert.deepEqual(
			companies.map((testCase) => testCase.id),
			Array.from({ length: 49 }, (_, index) => index + 1)
		)
		assert.deepEqual(
			people.map((testCase) => testCase.id),
			Array.from({ length: 41 }, (_, index) => index + 1)
		)
	}
)

Scenario('Cada caso declara el nivel de datos y sistemas que necesita', () => {
	colsubsidioCases.forEach((testCase) => {
		assert.notEqual(testCase.title, '')
		assert.notEqual(testCase.nextAction, '')
		assert.ok(
			[
				'authenticated-read-only',
				'test-data-required',
				'external-system-required',
			].includes(testCase.level)
		)
	})
})

Scenario(
	'El inventario distingue implementación de cobertura ejecutada',
	() => {
		const partial = colsubsidioCases.filter(
			(testCase) => testCase.automation === 'partial-unverified'
		)
		const blocked = colsubsidioCases.filter(
			(testCase) => testCase.automation === 'blocked-prerequisites'
		)

		assert.equal(partial.length, 13)
		assert.equal(blocked.length, 77)
	}
)
