```
This is a React 19 project. It follow atomic desing and DDD, where `src/components/UI` contains the UI components following atomic desing and `src/domain/` contains a folder per context. `admin` and `client`. 
`admin` domain have de following contexts:
- Users
- Organizations
- LocalBusiness
- Campaigns
- Trackers
`client` have:
- Organization
- LocalBusinesses
- Campaings
- Trackers
The project conects to an API via a auto-generated code implmentation created with `openapi-generator-cli` in `src/api-generated` all models definitios and Api clients are in #file:api.ts. 
Contexts are located in `src/context`
Hooks are located in `srs/hooks`
Pages are in `src/pages`
Utils are in `src/lib`
App defintion alogn with global providers and the rour are in `src/App.tsx`.
To create UI components use allways Tailwind, clsx and `@headlessui/react`.
Components must have interfaces and related types in the same file as the Component. 
```