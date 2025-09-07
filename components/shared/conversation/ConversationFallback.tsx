import { Card } from '@/components/ui/card'
import React from 'react'

type Props = {}

const ConversationFallback = () => {
  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
        Select/Start a conversation
    </Card>
  )
}

export default ConversationFallback