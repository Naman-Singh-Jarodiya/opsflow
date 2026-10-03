import 'dotenv/config'

import cors from 'cors'
import express from 'express'

import prisma from './config/prisma.js'
import authRoutes from './routes/auth.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import teamRoutes from './routes/team.routes.js'
import workItemRoutes from './routes/work-item.routes.js'

const app = express()

const PORT =
  Number(process.env.PORT) || 4000

const allowedOrigin =
  process.env.FRONTEND_URL ?? 'http://localhost:5173'

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
)

app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      success: true,
      message: 'OpsFlow API is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch {
    res.status(503).json({
      success: false,
      message:
        'OpsFlow API is running but database is unavailable',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/work-items', workItemRoutes)

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

const server = app.listen(
  PORT,
  () => {
    console.log(
      `OpsFlow API running on http://localhost:${PORT}`,
    )
  },
)

const shutdown = async () => {
  console.log(
    'Shutting down OpsFlow API...',
  )

  await prisma.$disconnect()

  server.close(() => {
    process.exit(0)
  })
}

process.on(
  'SIGINT',
  shutdown,
)

process.on(
  'SIGTERM',
  shutdown,
)