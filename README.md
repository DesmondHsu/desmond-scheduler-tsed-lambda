## desmond-scheduler-tsed-lambda

> **Important!** requires Node >= 18, yarn 1.22.19

This is a implementation of the Lambda API endpoints:

```
┌──────────────────┬──────────────────────────────────┬────────────────────────────┐
│ Method           │ Endpoint                         │ Class method               │
│──────────────────│──────────────────────────────────│────────────────────────────│
│ GET              │ /schedules                       │ Schedules.getSchedules()   │
│──────────────────│──────────────────────────────────│────────────────────────────│
│ GET              │ /schedules/:id                   │ Schedules.getSchedule()    │
│──────────────────│──────────────────────────────────│────────────────────────────│
│ POST             │ /schedules                       │ Schedules.createSchedule() │
│──────────────────│──────────────────────────────────│────────────────────────────│
│ PUT              │ /schedules/:id                   │ Schedules.updateSchedule() │
│──────────────────│──────────────────────────────────│────────────────────────────│
│ DELETE           │ /schedules/:id                   │ Schedules.deleteSchedule() │
│──────────────────│──────────────────────────────────│────────────────────────────│
│ GET              │ /schedules/:scheduleId/tasks/:id │ Tasks.getTask()            │
│──────────────────│──────────────────────────────────│────────────────────────────│
│ POST             │ /schedules/:scheduleId/tasks     │ Tasks.createTask()         │
│──────────────────│──────────────────────────────────│────────────────────────────│
│ PUT              │ /schedules/:scheduleId/tasks/:id │ Tasks.updateTask()         │
│──────────────────│──────────────────────────────────│────────────────────────────│
│ DELETE           │ /schedules/:scheduleId/tasks/:id │ Tasks.deleteTask()         │
└──────────────────┴──────────────────────────────────┴────────────────────────────┘
```

## Install

```batch
# install dependencies
$ yarn
```

## Local development

The service can be stand-up like a Node-express application like this: 
```
# Stand-up the PostgreSQL in Docker
$ docker-compose up db -d

# (Optional) PostgreSQL admin tool
$ docker-compose up pgadmin -d

# Migrate Database
$ yarn prisma:migrate

# Genereate Prisma types
$ yarn prisma:generate

# Start server
$ yarn start
```

## Testing

```batch
$ yarn test:unit
```