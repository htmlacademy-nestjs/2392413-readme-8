# Последовательность запуска проекта

```
cd project
npm install
cp apps/account/.env-example apps/account/.env
cp apps/api/.env.example apps/api/.env
cp libs/blog/models/prisma/.env-example libs/blog/models/prisma/.env
cp apps/blog/blog.env.example apps/blog/.env
cp apps/file-vault/file-vault.env.example apps/file-vault/.env
cp apps/notify/notify.env-example apps/notify/.env
docker compose -f "apps/account/docker-compose.dev.yml" up -d
docker compose -f "apps/blog/docker-compose.dev.yml" up -d
docker compose -f "apps/file-vault/docker-compose.dev.yml" up -d
docker compose -f "apps/notify/docker-compose.dev.yml" up -d
npx nx run blog:db:migrate
npx nx run blog:db:seed
npx nx run notify:serve
npx nx run file-vault:serve
npx nx run account:serve
npx nx run blog:serve
npx nx run api:serve
```

Swagger [Readme app API](http://localhost:3000/spec#/)
