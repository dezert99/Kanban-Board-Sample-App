import { render, screen, userEvent } from '@/test-utils'
import { ConfirmationModal } from '../ConfirmationModal'

describe('ConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Test Title',
    message: 'Test message content',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders nothing when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  test('renders modal when isOpen is true', () => {
    render(<ConfirmationModal {...defaultProps} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test message content')).toBeInTheDocument()
  })

  test('renders default button texts', () => {
    render(<ConfirmationModal {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  test('renders custom button texts', () => {
    render(
      <ConfirmationModal 
        {...defaultProps} 
        confirmText="Delete" 
        cancelText="Keep" 
      />
    )
    
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument()
  })

  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmationModal {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    expect(defaultProps.onConfirm).not.toHaveBeenCalled()
  })

  test('calls onConfirm and onClose when confirm button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmationModal {...defaultProps} />)
    
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    await user.click(confirmButton)
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  test('applies danger variant styling by default', () => {
    const { container } = render(<ConfirmationModal {...defaultProps} />)
    
    const icon = container.querySelector('.text-red-500')
    expect(icon).toBeInTheDocument()
    
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toHaveClass('bg-red-600')
  })

  test('applies warning variant styling', () => {
    const { container } = render(<ConfirmationModal {...defaultProps} variant="warning" />)
    
    const icon = container.querySelector('.text-yellow-500')
    expect(icon).toBeInTheDocument()
    
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toHaveClass('bg-yellow-600')
  })

  test('applies info variant styling', () => {
    const { container } = render(<ConfirmationModal {...defaultProps} variant="info" />)
    
    const icon = container.querySelector('.text-blue-500')
    expect(icon).toBeInTheDocument()
    
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toHaveClass('bg-blue-600')
  })

  test('renders alert triangle icon', () => {
    const { container } = render(<ConfirmationModal {...defaultProps} />)
    
    // Look for the AlertTriangle icon (it's an SVG with specific class)
    const alertIcon = container.querySelector('svg')
    expect(alertIcon).toBeInTheDocument()
    expect(alertIcon).toHaveClass('w-6', 'h-6')
  })

  test('has correct accessibility structure', () => {
    render(<ConfirmationModal {...defaultProps} />)
    
    // Should have proper heading
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent('Test Title')
    
    // Should have proper buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  test('renders with backdrop overlay', () => {
    const { container } = render(<ConfirmationModal {...defaultProps} />)
    
    const backdrop = container.querySelector('.fixed.inset-0.bg-gray-500\\/75')
    expect(backdrop).toBeInTheDocument()
  })

  test('modal is centered and has correct z-index', () => {
    const { container } = render(<ConfirmationModal {...defaultProps} />)
    
    const modalContainer = container.querySelector('.fixed.inset-0')
    expect(modalContainer).toHaveClass('flex', 'items-center', 'justify-center', 'z-50')
  })

  test('modal content has correct max width and styling', () => {
    const { container } = render(<ConfirmationModal {...defaultProps} />)
    
    const modalContent = container.querySelector('.bg-white.rounded-lg')
    expect(modalContent).toHaveClass('w-full', 'max-w-md')
  })

  test('handles long title and message text', () => {
    const longTitle = 'This is a very long title that should still display properly'
    const longMessage = 'This is a very long message that contains a lot of text and should wrap properly within the modal without breaking the layout or causing any visual issues'
    
    render(
      <ConfirmationModal 
        {...defaultProps} 
        title={longTitle}
        message={longMessage}
      />
    )
    
    expect(screen.getByText(longTitle)).toBeInTheDocument()
    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })

  test('cancel button has correct styling', () => {
    render(<ConfirmationModal {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    expect(cancelButton).toHaveClass('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200')
  })

  test('confirm button styling changes based on variant', () => {
    const { rerender } = render(<ConfirmationModal {...defaultProps} variant="danger" />)
    let confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toHaveClass('bg-red-600', 'hover:bg-red-700')
    
    rerender(<ConfirmationModal {...defaultProps} variant="warning" />)
    confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toHaveClass('bg-yellow-600', 'hover:bg-yellow-700')
    
    rerender(<ConfirmationModal {...defaultProps} variant="info" />)
    confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700')
  })
})