"use client"
import { api } from '@/convex/_generated/api';
import { useMutationState } from '@/hooks/useMutationState';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { ConvexError } from 'convex/values';
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod'
import { Doc, Id } from '@/convex/_generated/dataModel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { CirclePlus, X } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Type for a single friend document from Convex.
type Friend = Doc<"friends"> & {
    user: Doc<"users">;
};

// Define a single, simple schema for the form
const createGroupFormSchema = z.object({
    name: z.string().min(1, { message: "This field can't be empty" }),
    members: z.array(z.string()).min(1, { message: "You must select at least 1 friend" }),
});

const CreateGroupDialog = () => {
    const friends = useQuery(api.friends.get) as Friend[] | null;
    const { mutate: createGroup, pending } = useMutationState(api.conversation.createGroup);

    const form = useForm<z.infer<typeof createGroupFormSchema>>({
        resolver: zodResolver(createGroupFormSchema),
        defaultValues: {
            name: "",
            members: [],
        }
    });

    const members = form.watch("members", []);

    const unselectedFriends = useMemo(() => {
        if (!friends) return [];
        return friends.filter(friend => friend.user).filter(friend => !members.includes(friend.user._id));
    }, [members, friends]);

    const handleSubmit = async (values: z.infer<typeof createGroupFormSchema>) => {
        await createGroup({ name: values.name, members: values.members as Id<"users">[] }).then(() => {
            form.reset();
            toast.success("Group Created");
        })
        .catch((error) => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred");
        });
    }

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="outline">
                            <CirclePlus/>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Create Group</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent className="block">
                <DialogHeader>
                    <DialogTitle>Create Group</DialogTitle>
                    <DialogDescription>Add your friends to get started</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Group Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Group name..." {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="members"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Friends</FormLabel>
                                    <FormControl>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="w-full" variant="outline">Select</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-full">
                                                {!friends ? (
                                                    <div className="w-full flex items-center justify-center py-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    </div>
                                                ) : unselectedFriends.length > 0 ? (
                                                    unselectedFriends.map(friend => {
                                                        return (
                                                            <DropdownMenuCheckboxItem
                                                                key={friend._id}
                                                                className="flex items-center gap-2 w-full p-2"
                                                                checked={false}
                                                                onCheckedChange={() => {
                                                                    field.onChange([...members, friend.user._id]);
                                                                }}
                                                            >
                                                                <Avatar className="w-8 h-8">
                                                                    <AvatarImage src={friend.user.imageurl} />
                                                                    <AvatarFallback>{friend.user.username?.substring(0,1)}</AvatarFallback>
                                                                </Avatar>
                                                                <h4 className="truncate">{friend.user.username}</h4>
                                                            </DropdownMenuCheckboxItem>
                                                        )
                                                    })
                                                ) : friends.length === 0 ? (
                                                    <div className="w-full text-center py-2 text-muted-foreground">No friends found</div>
                                                ) : (
                                                    <div className="w-full text-center py-2 text-muted-foreground">All friends selected</div>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {
                            members && friends && members.length > 0 ? (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-foreground">Selected Members ({members.length})</p>
                                    <Card className="p-4 bg-accent/30 border-dashed border-2 min-h-[5rem] rounded-xl">
                                        <div className="flex flex-row items-center gap-3 overflow-x-auto pb-1">
                                            {friends
                                                .filter(friend => friend.user && members.includes(friend.user._id))
                                                .map(friend => {
                                                    if (!friend.user) return null;
                                                    return (
                                                        <div 
                                                            key={friend._id} 
                                                            className="flex items-center gap-2 bg-background border shadow-sm rounded-full pl-2 pr-3 py-2 flex-shrink-0 hover:shadow-md transition-shadow"
                                                        >
                                                            <Avatar className="w-8 h-8 border-2 border-primary/20">
                                                                <AvatarImage src={friend.user.imageurl} />
                                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                                                    {friend.user.username?.substring(0,1)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <p className="truncate text-sm font-medium whitespace-nowrap">
                                                                {friend.user.username?.split(" ")[0]}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                className="w-5 h-5 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                                                                onClick={() => form.setValue("members", members.filter(id => id !== friend.user._id))}
                                                            >
                                                                <X className="w-3 h-3 text-destructive" />
                                                            </button>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Card>
                                </div>
                            ) : null}
                        <DialogFooter className="pt-6">
                            <Button 
                                disabled={pending} 
                                type="submit" 
                                className="h-12 px-8 text-base font-semibold rounded-lg w-full sm:w-auto min-w-[120px]"
                                size="lg"
                            >
                                {pending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Group'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupDialog;