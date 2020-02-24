export const usersMocks = [
  {
    email: 'john@email.com',
    password: 'john',
  },
  {
    email: 'tim@email.com',
    password: 'tim',
  },
]
export const createUserData = (data, { role }: { role: string }) => ({ ...data, role })

export const projectsMocks = [
  {
    title: 'Create caffe',
    description: 'Create caffe',
  },
  {
    title: 'Open gallery',
    description: 'open gallery',
  },
]
export const createProjectData = (data, { userId }: { userId: number }) => ({
  ...data,
  userId,
})
