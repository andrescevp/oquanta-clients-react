# React 19 Template

This project contains already support for TS and Tailwind.

# Generating API Clients From API Specs (Swagger)

- Requires JAVA

```bash
node_modules/.bin/openapi-generator-cli generate -i http://localhost/api/doc.json -g typescript-axios -o ./src/api-generated
```

Replace host in `openapi` command defined in [package.json](package.json) scripts.
