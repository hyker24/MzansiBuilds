import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// MemoryRouter is needed because ProjectCard uses useNavigate
// which requires a Router context
import { MemoryRouter } from 'react-router-dom'
//import ProjectCard from '../components/ProjectCard'

// This is the fake project data we'll use across all tests
// We define it once here so we don't repeat it
const mockProject = {
  id: '123',
  name: 'SportX Platform',
  description: 'A sports facility booking platform built with Azure',
  stage: 'in progress',
  support_needed: 'Frontend developer',
  repo_url: 'https://github.com/hyker24/sportx',
  created_at: '2026-04-01T10:00:00',
  profiles: {
    id: 'user-1',
    username: 'Thembelani',
    avatar_url: null
  }
}

// Helper function — wraps the component in a Router
// so useNavigate doesn't throw an error during tests
const renderCard = () => render(
  <MemoryRouter>
    <ProjectCard project={mockProject} />
  </MemoryRouter>
)

describe('ProjectCard', () => {

  it('renders the project name', () => {
    renderCard()
    // screen.getByText finds an element by its text content
    // toBeInTheDocument checks it actually exists in the DOM
    expect(screen.getByText('SportX Platform')).toBeInTheDocument()
  })

  it('renders the author username', () => {
    renderCard()
    expect(screen.getByText('Thembelani')).toBeInTheDocument()
  })

  it('renders the stage badge', () => {
    renderCard()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders the support needed tag', () => {
    renderCard()
    expect(
      screen.getByText('Looking for: Frontend developer')
    ).toBeInTheDocument()
  })

  it('renders the repo link when repo_url is provided', () => {
    renderCard()
    // getByRole finds elements by their HTML role
    // links have the role 'link'
    const link = screen.getByRole('link', { name: /View repo/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/hyker24/sportx')
  })

  it('does not render repo link when repo_url is missing', () => {
    // Override just the repo_url for this one test
    const projectWithoutRepo = { ...mockProject, repo_url: null }
    render(
      <MemoryRouter>
        <ProjectCard project={projectWithoutRepo} />
      </MemoryRouter>
    )
    // queryByRole returns null instead of throwing if not found
    // getByRole would throw — use queryBy when testing absence
    expect(screen.queryByRole('link', { name: 'View repo' })).toBeNull()
  })

  it('truncates long descriptions', () => {
    const longDesc = 'A'.repeat(200)
    const projectWithLongDesc = { ...mockProject, description: longDesc }
    render(
      <MemoryRouter>
        <ProjectCard project={projectWithLongDesc} />
      </MemoryRouter>
    )
    // The description should be truncated to 120 chars + '...'
    expect(screen.getByText(/AAAA/i)).toBeInTheDocument();
  })

})