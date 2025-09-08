"use client"
import { Card } from '@/components/ui/card';
import { useNavigation } from '@/hooks/useNavigation';
import { UserButton } from '@clerk/nextjs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme/theme-toggle';
import { Badge } from '@/components/ui/badge';

type Props = {}

const DesktopNav = () => {
    const paths = useNavigation();
    return (
        <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
            <nav className="flex flex-col justify-between h-full w-full">
                <ul className="flex flex-col items-center gap-4">
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
                                            {path.count?<Badge className="absolute left-6 bottom-7 px-2">
                                                {path.count}
                                            </Badge>:null}
                                        </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{path.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                            
                            </li>
                        );
                    })}
                </ul>

                <div className="flex flex-col items-center gap-4">
                    <ThemeToggle/>
                    <UserButton afterSignOutUrl="/" /> 
                </div>
            </nav>
        </Card>
    );
};

export default DesktopNav;
