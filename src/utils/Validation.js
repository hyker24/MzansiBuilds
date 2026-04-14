// Auth validation
export function validateAuth({ email, password, username, isLogin }) {
  const errors = {}

  if (!email || email.trim() === '') {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!isLogin) {
    if (!username || username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
  }

  return errors
}

// Project validation
export function validateProject({ name, description, stage }) {
  const errors = {}

  if (!name || name.trim() === '') {
    errors.name = 'name is required'
  } else if (name.trim().length < 3) {
    errors.name = 'name must be at least 3 characters'
  } else if (name.trim().length > 100) {
    errors.name = 'name must be less than 100 characters'
  }

  if (!description || description.trim() === '') {
    errors.description = 'Description is required'
  } else if (description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters'
  }

  if (!stage || stage === '') {
    errors.stage = 'Please select a stage'
  }

  return errors
} 