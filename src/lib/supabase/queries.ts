'use server';
import { validate } from 'uuid';
import { collaborators, files, folders, users, workspaces } from '../../../migrations/schema';
import db from './db';
import { File, Folder, Subscription, User, workspace } from './supabase.types';
import { and, eq, exists, ilike, notExists } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const getUserSubscriptionStatus = async (userId : string) => {
    try {
        const data = await db.query.subscriptions.findFirst({
            where : (s, {eq})=>eq(s.userId, userId)
        });
        if(data)return {data : data as Subscription, error : null};
        else return {data: null, error : null}
    } catch (error) {
        console.log("EROOR", error)
        return {data: null, error : `Error from queries : ${error}`}
    }
}

export const createWorkspace = async (workspace: workspace) => {
    try {
      const response = await db.insert(workspaces).values(workspace);
      return { data: null, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: 'Error' };
    }
  };

export const getFiles = async (folderId: string) => {
    const isValid = validate(folderId);
    if (!isValid) return { data: null, error: 'Error' };
    try {
      const results = (await db
        .select()
        .from(files)
        .orderBy(files.createdAt)
        .where(eq(files.folderId, folderId))) as File[] | [];
      return { data: results, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: 'Error' };
    }
  };


  export const getPrivateCollaborators = async (fileId : string) => {
    if(fileId == null)return [];
    const collaboratorslist = await db.select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner : workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo
    }).from(workspaces);
    return collaboratorslist;
  }

  export const getFolders = async (workspaceId: string) => {
    const isValid = validate(workspaceId);
    if(!isValid)return {data: null, error: "No folders available"};
    try{
      const folderList = await db.select().from(folders).orderBy(folders.createdAt).where(eq(folders.workspaceId, workspaceId));
      return {data: folderList, error: ""};
    }catch(e){
      return {data: null, error: ""};
    }
  }

  export const getPrivateWorkSpaces = async (userId: string) => {
    if(!userId)return [];
    const privateWorkspaces = (await db.select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner : workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo
    }).from(workspaces).where(and(notExists((db.select().from(collaborators).where(eq(workspaces.id, collaborators.workspaceId)))), eq(workspaces.workspaceOwner, userId)))) as workspace[];
    return privateWorkspaces;
  }

  export const getCollaboratingWorkspaces = async (userId: string) => {
    if(!userId)return [];
    const collaboratingWorkspaces = await 
      db.select({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
        bannerUrl: workspaces.bannerUrl
      }).from(users).innerJoin(collaborators, eq(collaborators.userId, users.id)).innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id)).where(eq(users.id, userId)) as workspace[];
    return collaboratingWorkspaces;
  }


  export const getSharedWorkspaces = async (userId: string) => {
    if(!userId)return [];
    const sharedWorkspaces = await 
      db.select({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
        bannerUrl: workspaces.bannerUrl
      }).from(workspaces).orderBy(workspaces.createdAt).innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId)).where(eq(workspaces.workspaceOwner, userId)) as workspace[];
    return sharedWorkspaces;
  }