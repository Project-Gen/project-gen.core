export type CreateProjectDto = {
  title: string
  description: string
  userId: number
}

export type UpdateProjectDto = {
  title?: string
  description?: string
  userId?: number
}

export type FindProjectDto = {
  id?: number
}
