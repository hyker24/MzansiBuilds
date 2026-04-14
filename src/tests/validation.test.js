// We import the function we're about to test
// It doesn't exist yet — that's intentional (RED phase)
import { validateProject } from '../utils/Validation'

// describe groups related tests together
// Think of it as a folder for tests about the same thing
describe('validateProject', () => {

  // it() defines a single test
  // The string describes what SHOULD happen
  it('returns error when name is empty', () => {
    const result = validateProject({
      name: '',
      description: 'A great project',
      stage: 'idea'
    })
    // expect() is how you assert something is true
    // toEqual checks the value matches exactly
    expect(result.name).toEqual('name is required')
  })

  it('returns error when name is less than 3 characters', () => {
    const result = validateProject({
      name: 'AB',
      description: 'A great project',
      stage: 'idea'
    })
    expect(result.name).toEqual('name must be at least 3 characters')
  })

  it('returns no error when name is valid', () => {
    const result = validateProject({
      name: 'MzansiBuilds',
      description: 'A great project',
      stage: 'idea'
    })
    // toBeUndefined means the key doesn't exist — no error
    expect(result.name).toBeUndefined()
  })

  it('returns error when stage is not selected', () => {
    const result = validateProject({
      name: 'MzansiBuilds',
      description: 'A great project',
      stage: ''
    })
    expect(result.stage).toEqual('Please select a stage')
  })

  it('returns empty object when all fields are valid', () => {
    const result = validateProject({
      name: 'MzansiBuilds',
      description: 'A great project',
      stage: 'idea'
    })
    // toEqual({}) checks the result has no errors at all
    expect(result).toEqual({})
  })

})