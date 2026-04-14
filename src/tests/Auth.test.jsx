import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Auth from '../pages/Auth'

// We need to mock the AuthContext because Auth.jsx uses useAuth()
// Without this, the test would try to connect to Supabase
// vi.mock replaces the real module with a fake one for testing
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
  })
}))

// We also mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

const renderAuth = () => render(
  <MemoryRouter>
    <Auth />
  </MemoryRouter>
)

describe('Auth page', () => {

  it('renders the login form by default', () => {
    renderAuth()
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('does not show username field on login mode', () => {
    renderAuth()
    expect(screen.queryByPlaceholderText('Username')).toBeNull()
  })

  it('switches to register mode when Sign up is clicked', async () => {
    renderAuth()
    // userEvent.click simulates a real mouse click
    await userEvent.click(screen.getByText('Sign up'))
    expect(screen.getByText('Join MzansiBuilds')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
  })

  it('shows error when password is less than 6 characters', async () => {
    renderAuth()
    // Type into the email input
    await userEvent.type(
      screen.getByPlaceholderText('Email address'),
      'test@test.com'
    )
    // Type a short password
    await userEvent.type(
      screen.getByPlaceholderText('Password'),
      '123'
    )
    // Click sign in
    await userEvent.click(screen.getByText('Sign in'))
    // Error message should appear
    expect(
      screen.getByText('Password must be at least 6 characters')
    ).toBeInTheDocument()
  })

  it('renders the Google sign in button', () => {
    renderAuth()
    expect(
      screen.getByText('Continue with Google')
    ).toBeInTheDocument()
  })

})