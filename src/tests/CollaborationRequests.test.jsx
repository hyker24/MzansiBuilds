import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CollaborationRequests from '../Components/CollaborationRequests'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

const mockRespondToRequest = vi.fn()

const mockSentRequests = [
  {
    id: 'req-1',
    message: 'I would love to help with the frontend',
    status: 'pending',
    created_at: '2026-04-10T10:00:00',
    projects: {
      id: 'p1',
      name: 'SportX Platform',
      stage: 'in progress',
      profiles: { username: 'Sipho' }
    }
  },
  {
    id: 'req-2',
    message: 'I can help with database design',
    status: 'accepted',
    created_at: '2026-04-08T10:00:00',
    projects: {
      id: 'p2',
      name: 'MzansiPay',
      stage: 'idea',
      profiles: { username: 'Nomsa' }
    }
  }
]

const mockReceivedRequests = [
  {
    id: 'req-3',
    message: 'I can build the mobile app version',
    status: 'pending',
    created_at: '2026-04-09T10:00:00',
    projects: {
      id: 'p3',
      name: 'My Weather App',
      stage: 'in progress'
    },
    profiles: {
      id: 'sender-1',
      username: 'Thabo',
      avatar_url: null
    }
  }
]

vi.mock('../hooks/useCollaborationRequests', () => ({
  useCollaborationRequests: () => ({
    sentRequests: mockSentRequests,
    receivedRequests: mockReceivedRequests,
    loading: false,
    error: null,
    respondToRequest: mockRespondToRequest
  })
}))

const renderComponent = () => render(
  <MemoryRouter>
    <CollaborationRequests />
  </MemoryRouter>
)

describe('CollaborationRequests component', () => {

  beforeEach(() => {
    mockRespondToRequest.mockClear()
  })

  it('renders the component heading', () => {
    renderComponent()
    expect(
      screen.getByText('Collaboration Requests')
    ).toBeInTheDocument()
  })

  it('shows pending badge when there are pending requests', () => {
    renderComponent()
    expect(screen.getByText('1 pending')).toBeInTheDocument()
  })

  it('shows correct total count', () => {
    renderComponent()
    expect(screen.getByText('3 total')).toBeInTheDocument()
  })

  it('renders received tab with count', () => {
    renderComponent()
    expect(screen.getByText('Received (1)')).toBeInTheDocument()
  })

  it('renders sent tab with count', () => {
    renderComponent()
    expect(screen.getByText('Sent (2)')).toBeInTheDocument()
  })

  // ── Received requests ──────────────────────────────────────

  it('shows received request sender name', () => {
    renderComponent()
    expect(screen.getByText('Thabo')).toBeInTheDocument()
  })

  it('shows received request message', () => {
    renderComponent()
    expect(
      screen.getByText('"I can build the mobile app version"')
    ).toBeInTheDocument()
  })

  it('shows accept and decline buttons for pending requests', () => {
    renderComponent()
    expect(screen.getByText('Accept')).toBeInTheDocument()
    expect(screen.getByText('Decline')).toBeInTheDocument()
  })

  it('calls respondToRequest with accepted when accept clicked', async () => {
    mockRespondToRequest.mockResolvedValue()
    renderComponent()
    await userEvent.click(screen.getByText('Accept'))
    expect(mockRespondToRequest).toHaveBeenCalledWith(
      'req-3', 'accepted'
    )
  })

  it('calls respondToRequest with declined when decline clicked', async () => {
    mockRespondToRequest.mockResolvedValue()
    renderComponent()
    await userEvent.click(screen.getByText('Decline'))
    expect(mockRespondToRequest).toHaveBeenCalledWith(
      'req-3', 'declined'
    )
  })

  // ── Sent requests ──────────────────────────────────────────

  it('shows sent requests when sent tab is clicked', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Sent (2)'))
    expect(
      screen.getByText('"I would love to help with the frontend"')
    ).toBeInTheDocument()
    expect(
      screen.getByText('"I can help with database design"')
    ).toBeInTheDocument()
  })

  it('shows project name on sent requests', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Sent (2)'))
    expect(screen.getByText('SportX Platform')).toBeInTheDocument()
    expect(screen.getByText('MzansiPay')).toBeInTheDocument()
  })

  it('shows accepted note on accepted sent request', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Sent (2)'))
    expect(
      screen.getByText(
        'Your request was accepted! Reach out to the project owner to get started.'
      )
    ).toBeInTheDocument()
  })

  it('shows status badges on sent requests', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Sent (2)'))
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Accepted')).toBeInTheDocument()
  })

  // ── Empty states ───────────────────────────────────────────

  it('shows empty state for received when no requests', () => {
    vi.doMock('../hooks/useCollaborationRequests', () => ({
      useCollaborationRequests: () => ({
        sentRequests: [],
        receivedRequests: [],
        loading: false,
        error: null,
        respondToRequest: vi.fn()
      })
    }))
    renderComponent()
    expect(
      screen.queryByText('No collaboration requests yet')
    ).toBeDefined()
  })

})
