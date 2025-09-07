"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutationState } from '@/hooks/useMutationState';
import { ConvexError } from 'convex/values';
import React, { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner';

type Props = {
    conversationId:Id<"conversations">;
    open:boolean;
    setOpen:Dispatch<SetStateAction<boolean>>
}


const LeaveGroupDialog = 
({conversationId,open,setOpen}: Props) => {
    const{mutate:leaveGroup,pending}=useMutationState(api.conversation.DeleteGroup)
    const handleLeaveGroup=async()=>{
        leaveGroup({conversationId}).then(()=>{
            toast.success("Group Left")
        })
        .catch((error) => {
            toast.error(error instanceof ConvexError?error.data:"Unexpected error occured")
        });
    }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are You Sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. You will no longer be a member of this group and won&apos;t be able to see, send or receive any messages from this group
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={pending} onClick={handleLeaveGroup}>Leave</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default LeaveGroupDialog