"use client"
import { Card } from '@/components/ui/card';
import { useConversation } from '@/hooks/useConversation';
import { cn } from '@/lib/utils';
import React from 'react'

type Props = React.PropsWithChildren<{
    title: string;
    action?: React.ReactNode;
}>

const ItemList = ({ children, title, action: Action }: Props) => {
    const { isActive } = useConversation();
    
    return (
        <Card className={cn(
            "h-full w-full lg:flex-none lg:w-80 p-2",
            {
                // On mobile: hide when conversation is active, show when not active
                "hidden": isActive,
                "block": !isActive,
                // On desktop: always show
                "lg:block": true
            }
        )}>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h1>
                {Action ? Action : null}
            </div>
            <div className="w-full h-full flex flex-col items-center justify-start gap-2">
                {children}
            </div>
        </Card>
    )
}

// FIX: Removed unused ConversationContainer component (line 40:7)
// This component was assigned but never used and appears to be duplicate code

export default ItemList