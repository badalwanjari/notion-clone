import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import {cookies} from "next/headers"
import db from '@/lib/supabase/db';
import { redirect } from 'next/navigation';
import DashboardSetup from '@/components/dashboard-setup/page';
import { getUserSubscriptionStatus } from '@/lib/supabase/queries';

const  DashboardPage = async () => {
    
    const supabase = createServerComponentClient({cookies});
    const {data : {user}} = await supabase.auth.getUser();
    
    if(!user){
        return;
    }

    const {data: subscription, error : subscriptionError} = await getUserSubscriptionStatus(user.id);
    return <h1>Dashboard Page {user.id}</h1>


    try{
        const workspace = await db.query.workspaces.findFirst({
            where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
          });
        return redirect(`/dashboard/${workspace?.id}`)
    }catch(e){
        return (

                <div className='bg-background h-screen w-full flex justify-center items-center'>
                    <DashboardSetup user={user} subscription={subscription}></DashboardSetup>
                </div>
            );
    }

    
}

export default DashboardPage
