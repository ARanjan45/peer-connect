"use client";
import ConversationContainer from '@/components/shared/conversation/ConversationContainer';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import Header from './_components/Header';
import Body from './_components/body/Body';
import ChatInput from './_components/input/ChatInput';
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog';
import DeleteGroupDialog from './_components/dialogs/DeleteGroupDialog';
import LeaveGroupDialog from './_components/dialogs/LeaveGroupDialog';

type Props = {
  conversationId: string;
};

const ConversationClient = ({ conversationId }: Props) => {
  const conversation = useQuery(api.conversation.get, { id: conversationId as Id<"conversations"> });
  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setdeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setleaveGroupDialogOpen] = useState(false);

  // Handle loading state
  if (conversation === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Handle not-found state
  if (conversation === null) {
    return (
      <p className="w-full h-full flex items-center justify-center">
        Conversation not found
      </p>
    );
  }

  return (
    <ConversationContainer>
      <RemoveFriendDialog conversationId={conversationId as Id<"conversations">} open={removeFriendDialogOpen} setOpen={setRemoveFriendDialogOpen} />
      <DeleteGroupDialog conversationId={conversationId as Id<"conversations">} open={deleteGroupDialogOpen} setOpen={setdeleteGroupDialogOpen} />
      <LeaveGroupDialog conversationId={conversationId as Id<"conversations">} open={leaveGroupDialogOpen} setOpen={setleaveGroupDialogOpen} />
      <div className="h-full flex flex-col">
        <Header
          name={conversation.isGroup ? conversation.name || "Group Chat" : conversation.otherMember?.username || ""}
          imageUrl={conversation.isGroup ? undefined : conversation.otherMember?.imageurl}
          options={conversation.isGroup ? [
            {
              label: "Leave group",
              destructive: false,
              onClick: () => setleaveGroupDialogOpen(true),
            },
            {
              label: "Delete group",
              destructive: true,
              onClick: () => setdeleteGroupDialogOpen(true),
            },
          ] : [
            {
              label: "Remove Friend",
              destructive: true,
              onClick: () => setRemoveFriendDialogOpen(true),
            },
          ]}
        />
        <Body members={conversation.isGroup ? (conversation.otherMembers ? conversation.otherMembers : []) : (conversation.otherMember ? [conversation.otherMember] : [])} />
        <ChatInput />
      </div>
    </ConversationContainer>
  );
};

export default ConversationClient;