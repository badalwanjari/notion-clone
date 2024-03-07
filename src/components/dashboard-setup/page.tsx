import { AuthUser } from '@supabase/supabase-js';
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';

interface dashboardSetupProps {
    user : AuthUser,
    subscription : {} | null
}


const DashboardSetup: React.FC<dashboardSetupProps> = ({user, subscription}) => {

  return (
    <Card className='
        w-[800px] lg:h-screen sm:h-auto  
    '>
        <CardHeader>Create a workspace</CardHeader>
        <CardDescription>Lets create a private workspace to get started. You can add collaborator later from the workspace settings tab</CardDescription>
        <CardContent>
            <form>
                <div className='flex flex-col gap-4'></div>
            </form>
        </CardContent>
    </Card>
  )
}

export default DashboardSetup;
