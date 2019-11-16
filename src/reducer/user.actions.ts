export const getUser = (id: number) => ({
  type: 'get-user',
  payload:id
} as const);




