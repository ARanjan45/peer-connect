"use client";
import ItemList from '@/components/shared/item-list/ItemList'
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import React from 'react'
import DMConversationItem from './_component/DMConversationItem';
import CreateGroupDialog from './_component/CreateGroupDialog';
import GroupConversationItem from './_component/GroupConversationItem';

interface Props { // FIX: Changed from type Props = React.PropsWithChildren<{}> to interface
    children: React.ReactNode;
}

const ConversationsLayout = ({ children }: Props) => {
    const conversations = useQuery(api.conversations.get)
    return (
        <div className="flex h-full w-full gap-6">
            <ItemList title="Conversations" action={<CreateGroupDialog/>}>
                {conversations ? (
                    conversations.length === 0 ? (
                        <p className="w-full h-full flex items-center justify-center">
                             No Conversations Found
                        </p>
                    ) : (
                         conversations.map(conversation => {
                            return conversation.conversation.isGroup ? <GroupConversationItem 
                                 key={conversation.conversation._id} 
                                 id={conversation.conversation._id}
                                 name={conversation.conversation.name || ""} 
                                 lastMessageContent={conversation.lastMessage?.content} 
                                 lastMessageSender={conversation.lastMessage?.sender}
                                 unseenCount={conversation.unseenCount} // Corrected line
                                 /> : (
                                 <DMConversationItem 
                                     key={conversation.conversation._id} 
                                     id={conversation.conversation._id}
                                     username={conversation.otherMember?.username || ""} 
                                     imageUrl={conversation.otherMember?.imageurl || ""} 
                                     lastMessageContent={conversation.lastMessage?.content} 
                                     lastMessageSender={conversation.lastMessage?.sender}
                                     unseenCount={conversation.unseenCount} // Corrected line
                                 />
                             )
                        })
                     )
            ) : (
                 <div className="w-full h-full flex items-center justify-center">
                     <Loader2 className="h-8 w-8 animate-spin" />
                </div>
             )}
             </ItemList>
             {children}
        </div>
)
}

export default ConversationsLayout