import React from 'react'
import SidebarWrapper from "@/components/shared/sidebar/SidebarWrapper";

interface Props { // FIX: Changed from type Props = React.PropsWithChildren<{}> to interface
  children: React.ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <SidebarWrapper>
        {children}
    </SidebarWrapper>
  )
}

export default Layout