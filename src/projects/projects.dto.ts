export type CreateVacantion = {
  title: string
}

export type UpdateProjectVacantion = {
  title: string
  id?: number
  projectId?: number
}

export type CreateProjectDto = {
  title: string
  description: string
  userId: number
  vacantions?: CreateVacantion[]
}

/**
 * TODO: all fields required for updated
 */
export type UpdateProjectDto = {
  title: string
  description: string
  userId: number
  vacantions?: UpdateProjectVacantion[]
}

export type FindProjectDto = {
  id?: number
}
