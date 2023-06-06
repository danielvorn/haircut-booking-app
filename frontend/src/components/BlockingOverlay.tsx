import type React from 'react'

interface BlockingOverlayProps {
  isVisible: boolean
}

const BlockingOverlay: React.FC<BlockingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50 pointer-events-auto" />
  )
}

export default BlockingOverlay
