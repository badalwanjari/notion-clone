import { z } from "zod";

export const FormSchema = z.object({
    email : z.string().describe("Email").email({message: "Invalid mail"}),
    password : z.string().describe("Password").min(1, {message: "Password is required"})
})

export const CreateWorkspaceFormSchema = z.object({
    workspaceName : z.string().min(6, 'Workspace name must be of minimum 1 char').describe('Workspace name'),
    logo : z.any()
})