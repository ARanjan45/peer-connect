"use client";

import { useConversation } from '@/hooks/useConversation';
import { cn } from '@/lib/utils';
import React from 'react'

type Props = React.PropsWithChildren<{}>

const ConversationContainer = ({ children }: Props) => {
    const { isActive } = useConversation();
    
    return (
        <div className={cn(
            "h-full w-full",
            {
                // On mobile: show when conversation is active, hide when inactive
                "block": isActive,
                "hidden": !isActive,
                // On desktop: always show
                "lg:block": true
            }
        )}>
            {children}
        </div>
    )
}

export default ConversationContainer