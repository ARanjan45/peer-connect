import { Card } from '@/components/ui/card'
import React from 'react'

interface Props {} // FIX 1: Changed from type Props = {} to interface Props {}

const ConversationFallback = () => { // FIX 2: Removed unused Props type from parameter (it wasn't being used anyway)
  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
        Select/Start a conversation
    </Card>
  )
}

export default ConversationFallback