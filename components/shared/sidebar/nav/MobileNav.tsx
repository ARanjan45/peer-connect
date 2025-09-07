"use client"
import { Card } from '@/components/ui/card';
import { useNavigation } from '@/hooks/useNavigation';
import { UserButton } from '@clerk/nextjs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useConversation } from '@/hooks/useConversation';
import { ThemeToggle } from '@/components/ui/theme/theme-toggle';
import { Badge } from '@/components/ui/badge';

type Props = {}

const MobileNav = () => {
    const paths = useNavigation();
    const{isActive}=useConversation();
    if(isActive)
        return null;
    return (
        <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden">
            <nav className="w-full">
                <ul className="flex justify-evenly items-center">
                    {paths.map((path, id) => {
                        return (
                            <li key={id} className="relative">
                                
                                    <Tooltip>
                                        <TooltipTrigger asChild> 
                                            <Link href={path.href}>
                                            <Button
                                                size="icon"
                                                variant={path.active ? "default" : "outline"}
                                            >
                                                {path.icon}
                                            </Button>
                                            {
                                                path.count?<Badge className="absolute left-7 bottom-6">
                                                    {path.count}
                                                </Badge>:null
                                            }
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{path.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                
                            </li>
                        );
                    })}
                    <li>
                        <ThemeToggle/>
                    </li>
                    <li>
                        <UserButton afterSignOutUrl="/" /> 
                    </li>
                </ul>

                
            </nav>
        </Card>
    );
};

export default MobileNav;
