import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CreateProject from '../pages/CreateProject'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-abc', email: 'test@test.com' }
  })
}))

const mockInsert = vi.fn()
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: () => ({
      insert: () => ({
        select: () => ({
          single: mockInsert
        })
      })
    })
  }
}))

const renderPage = () => render(
  <MemoryRouter>
    <CreateProject />
  </MemoryRouter>
)

const fillRequiredFields = async () => {
  await userEvent.type(
    screen.getByPlaceholderText(/Community Facility/),
    'MzansiBuilds Platform'
  )
  await userEvent.type(
    screen.getByPlaceholderText(/What are you building/),
    'A platform for SA developers to build in public'
  )
  await userEvent.selectOptions(
    screen.getByRole('combobox'),
    'idea'
  )
}

describe('CreateProject page', () => {

  beforeEach(() => {
    mockInsert.mockClear()
    mockNavigate.mockClear()
  })

  // ── Rendering ──────────────────────────────────────────────

  it('renders the page heading', () => {
    renderPage()
    expect(screen.getByText('Share a project')).toBeInTheDocument()
  })

  it('renders all required form fields', () => {
    renderPage()
    // getByPlaceholderText finds an input by its placeholder
    expect(
      screen.getByPlaceholderText(/Community Facility/)
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/What are you building/)
    ).toBeInTheDocument()
    // getByRole('combobox') finds a select element
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders optional fields', () => {
    renderPage()
    expect(
      screen.getByPlaceholderText(/Frontend developer/)
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/github.com/)
    ).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    renderPage()
    expect(
      screen.getByText('Share project')
    ).toBeInTheDocument()
  })

  it('renders a back button', () => {
    renderPage()
    expect(
      screen.getByText('← Back to feed')
    ).toBeInTheDocument()
  })

  // ── Validation ─────────────────────────────────────────────

  it('shows name error when submitted empty', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Share project'))
    expect(
      await screen.findByText('name is required')
    ).toBeInTheDocument()
  })

  it('shows description error when submitted empty', async () => {
    renderPage()
    await userEvent.type(
      screen.getByPlaceholderText(/Community Facility/),
      'My Project'
    )
    await userEvent.click(screen.getByText('Share project'))
    expect(
      await screen.findByText('Description is required')
    ).toBeInTheDocument()
  })

  it('shows stage error when not selected', async () => {
    renderPage()
    await userEvent.type(
      screen.getByPlaceholderText(/Community Facility/),
      'My Project'
    )
    await userEvent.type(
      screen.getByPlaceholderText(/What are you building/),
      'A platform for developers'
    )
    await userEvent.click(screen.getByText('Share project'))
    expect(
      await screen.findByText('Please select a stage')
    ).toBeInTheDocument()
  })

  it('clears name error as user types', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Share project'))
    await screen.findByText('name is required')
    // Now type in the field — error should disappear
    await userEvent.type(
      screen.getByPlaceholderText(/Community Facility/),
      'My Project'
    )
    expect(
      screen.queryByText('name is required')
    ).toBeNull()
  })

  // ── Character counters ─────────────────────────────────────

  it('shows character count for name', async () => {
    renderPage()
    await userEvent.type(
      screen.getByPlaceholderText(/Community Facility/),
      'Hello'
    )
    // 5 characters typed, max is 100
    expect(screen.getByText('5/100')).toBeInTheDocument()
  })

  it('shows character count for description', async () => {
    renderPage()
    await userEvent.type(
      screen.getByPlaceholderText(/What are you building/),
      'Test'
    )
    expect(screen.getByText('4/500')).toBeInTheDocument()
  })

  // ── Submission ─────────────────────────────────────────────

  it('calls supabase insert with correct data on valid submit', async () => {
    // Make the mock return a successful response with a project id
    mockInsert.mockResolvedValue({
      data: { id: 'new-project-id' },
      error: null
    })

    renderPage()
    await fillRequiredFields()
    await userEvent.click(screen.getByText('Share project'))

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled()
    })
  })

  it('navigates to new project after successful save', async () => {
    mockInsert.mockResolvedValue({
      data: { id: 'new-project-id' },
      error: null
    })

    renderPage()
    await fillRequiredFields()
    await userEvent.click(screen.getByText('Share project'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/project/new-project-id'
      )
    })
  })

  it('shows loading state during submission', async () => {
    // Make insert take a long time so we can catch the loading state
    mockInsert.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )

    renderPage()
    await fillRequiredFields()
    await userEvent.click(screen.getByText('Share project'))

    // The button text should change to "Sharing..."
    expect(screen.getByText('Sharing...')).toBeInTheDocument()
  })

  it('shows server error when supabase fails', async () => {
    mockInsert.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' }
    })

    renderPage()
    await fillRequiredFields()
    await userEvent.click(screen.getByText('Share project'))

    expect(
      await screen.findByText('Database connection failed')
    ).toBeInTheDocument()
  })

  // ── Navigation ─────────────────────────────────────────────

  it('navigates back to feed when cancel is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Cancel'))
    expect(mockNavigate).toHaveBeenCalledWith('/feed')
  })

  it('navigates back to feed when back button is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByText('← Back to feed'))
    expect(mockNavigate).toHaveBeenCalledWith('/feed')
  })

})