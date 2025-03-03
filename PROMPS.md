This is a React 19 project.
It follow atomic desing and DDD.
`src/components/UI` contains the UI components following atomic desing.
`src/domain/` contains a folder per context. `admin` and `client`.
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
The project conects to an API via a auto-generated code implmentation created with `openapi-generator-cli` in `src/api-generated` all models definitios and Api clients are in ``src/api-generated/api.ts`
Contexts are located in `src/context`
Hooks are located in `srs/hooks`
Pages are in `src/pages`
Utils are in `src/lib`
App defintion alogn with global providers and the rour are in `src/App.tsx`.
This project supports SCSS with Tailwind.
To create UI components use allways `tailwind`, `clsx`, `lucide-react and` `@headlessui/react`.
All icons must be interfaced in `src/components/UI/Icons.tsx`
To create tables we use `react-data-table-component`.
To manage Forms we use `react-hook-form`, Submit Button must be build with `src/components/UI/molecules/ButtonLoder.tsx` so it shows a spinner while sending requests.
Strings displayed to the user are translated with `useTranslation` and always use literals strings - never keys.
Selects are created using `react-select`
Components must have interfaces and related types in the same file as the Component. 
All components documentation and comments must be in English.