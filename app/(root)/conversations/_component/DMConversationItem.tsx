import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Id } from '@/convex/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'; 
import { User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {
    id: Id<"conversations">;
    imageUrl: string;
    username: string;
    lastMessageSender?:string;
    lastMessageContent?:string;
    unseenCount:number;
};

const DMConversationItem = ({ id, imageUrl, username,lastMessageContent,lastMessageSender,unseenCount }: Props) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
        <Card className="p-2 flex flex-row items-center justify-between gap-4 truncate">
            <div className="flex flex-row items-center gap-4 truncate flex-1 min-w-0">
                <Avatar className="w-10 h-10 flex-shrink-0"> 
                    <AvatarImage src={imageUrl} className="rounded-full object-cover w-full h-full"/>
                    <AvatarFallback className="flex items-center justify-center bg-gray-200 text-gray-700 rounded-full w-full h-full">
                        <User className="w-6 h-6" /> 
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate flex-1 min-w-0">
                    <h4 className="truncate">
                        {username}
                    </h4>
                    {lastMessageSender && lastMessageContent ? (
                        <span className="text-sm text-muted-foreground flex truncate">
                            <p className="font-semibold flex-shrink-0">
                                {lastMessageSender}:&nbsp;
                            </p>
                            <p className="truncate overflow-ellipsis">
                                {lastMessageContent}
                            </p>
                        </span>
                    ) : (
                        <p className="text-sm text-muted-foreground truncate">
                            Start The Conversation
                        </p>
                    )}
                </div> 
            </div>
            {unseenCount > 0 && <Badge className="flex-shrink-0">{unseenCount}</Badge>}
        </Card>
    </Link>
  );
};

export default DMConversationItem;