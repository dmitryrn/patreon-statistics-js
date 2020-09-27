# Server template/app with TypeScript, unit&functional tests, DDD, IoC container, layered architecture

App itself is patreon statistics service, allow you to watch stats for particular patreon users.

## Local development
```make run-local-watch```

It will run `db migrations`, generate `Prisma TypeScript schema` and run `unit tests`.

VScode debugger with `breakpoints` is available

## Functional tests
```make test-functional-watch```

## Local deps for development

* docker
* node 14
* [modd](https://github.com/cortesi/modd)
* make
