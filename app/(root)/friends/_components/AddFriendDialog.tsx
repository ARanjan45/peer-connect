import React, { useState } from 'react'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { Tooltip } from '@radix-ui/react-tooltip'
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useMutationState } from '@/hooks/useMutationState'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { Id } from '@/convex/_generated/dataModel'

const AddFriendDialog = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState(false)

    const { mutate: createRequest, pending } = useMutationState(api.request.createById)

    const searchResults = useQuery(
        api.user.searchUsers,
        searchTerm.trim().length > 0 ? { searchTerm } : "skip"
    )

    const handleSendRequest = async (receiverId: Id<"users">) => {
        await createRequest({ receiverId })
            .then(() => {
                toast.success("Friend request sent!")
                setSearchTerm("")
                setOpen(false)
            })
            .catch(error => {
                toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred")
            })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="outline">
                            <UserPlus />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add Friend</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                    <DialogDescription>
                        Search by name or email to send a friend request
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />

                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                        {searchTerm.trim().length === 0 ? null
                            : searchResults === undefined ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Searching...
                                </p>
                            ) : searchResults.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No users found
                                </p>
                            ) : (
                                searchResults.map(user => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{user.username}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            disabled={pending}
                                            onClick={() => handleSendRequest(user.id)}
                                        >
                                            Connect
                                        </Button>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddFriendDialog