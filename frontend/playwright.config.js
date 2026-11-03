import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  workers: 1,
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  webServer: [
    { command: 'dotnet run --project ../BackendApi --no-launch-profile --urls http://localhost:5000', url: 'http://localhost:5000/api/products', env: { ConnectionStrings__DefaultConnection: 'Data Source=auth-tests.db', ASPNETCORE_ENVIRONMENT: 'Development' }, timeout: 120000 },
    { command: 'npm run dev', url: 'http://localhost:3000', timeout: 60000 },
  ],
})
