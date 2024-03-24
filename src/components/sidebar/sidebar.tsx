import React from 'react'
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { getUserSubscriptionStatus, getFolders, getPrivateWorkSpaces, getCollaboratingWorkspaces, getSharedWorkspaces } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import WorkspaceDropdown from './workspace-dropdown';

interface sidebarProps {
  params: any;
  className?:string;
}

const Sidebar:React.FC<sidebarProps> = async ({params, className}) => {
  const supabase = await createServerComponentClient({cookies})
  //user
  const {data : {user}} = await supabase.auth.getUser();
  if(!user)return;

  //sub status
  const {data: subscriptionData, error: subscriptionError} = await getUserSubscriptionStatus(user.id);

  //folders
  const {data: workspaceFoldersData, error: folderError} = await getFolders(params?.workspaceId);

  // errors -> homepage
  if(subscriptionError || folderError){
    return redirect('/dashboard');
  }

  //get all diff workspaces
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] = await 
    Promise.all([getPrivateWorkSpaces(user.id), getCollaboratingWorkspaces(user.id), getSharedWorkspaces(user.id)]);

  return (
    <aside
      className={twMerge("hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md-gap-4 !justify-between", className)}
    >
      <WorkspaceDropdown 
        privateWorkspaces={privateWorkspaces} 
        collaboratingWorkspaces={collaboratingWorkspaces}
        sharedWorkspaces={sharedWorkspaces}
        defaultValue={[
          ...privateWorkspaces,
          ...collaboratingWorkspaces,
          ...sharedWorkspaces,
        ].find((workspace) => workspace.id === params.workspaceId)}  />
    </aside>
  )
}

export default Sidebar
