import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import React from 'react'

interface Props {} // FIX 1: Changed from type Props = {} to interface Props {}

const ConversationsPage = (_props: Props) => { // FIX 2: Added underscore prefix since props is not used
  return (
    <ConversationFallback/>
  )
}

export default ConversationsPage