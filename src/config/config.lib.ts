export const getConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3100,
  pgUrl: process.env.PG_URL,
})
