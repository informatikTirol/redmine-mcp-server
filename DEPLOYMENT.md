# Deployment & Update Anleitung

## NPM Veröffentlichung

### Vorbereitung

1. **NPM Account benötigt**:
   - Falls noch nicht vorhanden: Account auf [npmjs.com](https://www.npmjs.com) erstellen
   - Organisation `@informatik_tirol` auf npm erstellen oder Zugriff erhalten
   - https://www.npmjs.com/package/@informatik_tirol/redmine-mcp-server

2. **NPM Login**:
   ```bash
   npm login
   ```

3. **Zugriff zur Organisation prüfen**:
   ```bash
   npm access list packages @informatik_tirol
   ```

### Package veröffentlichen

1. **Dependencies installieren**:
   ```bash
   pnpm install
   ```

2. **Build erstellen** (generiert automatisch API-Code und baut das Projekt):
   ```bash
   pnpm build
   ```

3. **Package veröffentlichen**:
   ```bash
   npm publish --access public
   ```

   Hinweis: `--access public` ist notwendig für scoped packages (@informatik_tirol/...)

4. **Veröffentlichung prüfen**:
   ```bash
   npm view @informatik_tirol/redmine-mcp-server
   ```

### Neue Version veröffentlichen

1. **Version erhöhen**:
   ```bash
   # Patch-Version (z.B. 1.1.0 -> 1.1.1)
   npm version patch

   # Minor-Version (z.B. 1.1.0 -> 1.2.0)
   npm version minor

   # Major-Version (z.B. 1.1.0 -> 2.0.0)
   npm version major
   ```

2. **Änderungen pushen**:
   ```bash
   git push && git push --tags
   ```

3. **Neu veröffentlichen**:
   ```bash
   pnpm build
   npm publish --access public
   ```

## Updates vom Original-Repository holen

Das upstream-Repository ist bereits konfiguriert als `upstream`.

### Updates holen und mergen

1. **Upstream-Änderungen abrufen**:
   ```bash
   git fetch upstream
   ```

2. **Auf dem aktuellen Branch mergen** (z.B. main):
   ```bash
   git merge upstream/main
   ```

3. **Konflikte lösen** (falls vorhanden):
   - Konflikte manuell in den betroffenen Dateien bearbeiten
   - Dateien nach der Lösung stagen:
     ```bash
     git add <datei>
     ```
   - Merge abschließen:
     ```bash
     git commit
     ```

4. **Änderungen zu deinem Fork pushen**:
   ```bash
   git push origin main
   ```

### Alternative: Rebase statt Merge

Für eine sauberere History kannst du auch rebasing verwenden:

```bash
git fetch upstream
git rebase upstream/main
git push origin main --force-with-lease
```

⚠️ Vorsicht: `--force-with-lease` überschreibt die Remote-History. Nur verwenden, wenn du alleine am Fork arbeitest!

### Regelmäßige Updates

Es empfiehlt sich, regelmäßig Updates zu prüfen:

```bash
# Status prüfen
git fetch upstream
git log HEAD..upstream/main --oneline

# Wenn Updates vorhanden sind
git merge upstream/main
git push origin main
```

## Automatisierung mit GitHub Actions

Optional kannst du einen GitHub Action Workflow erstellen, der automatisch prüft, ob es Updates vom upstream gibt. Beispiel: `.github/workflows/sync-upstream.yml`

## Package verwenden

Nach der Veröffentlichung können Benutzer das Package installieren mit:

```bash
npm install @informatik_tirol/redmine-mcp-server
```

oder

```bash
pnpm add @informatik_tirol/redmine-mcp-server
```

## Wichtige Dateien

- `package.json`: Name, Version und Metadaten (bereits aktualisiert auf `@informatik_tirol/redmine-mcp-server`)
- `redmine-openapi.yaml`: OpenAPI Spezifikation für Code-Generierung
- `orval.config.ts`: Konfiguration für die Code-Generierung
- `src/__generated__/`: Automatisch generierter Code (nicht manuell bearbeiten!)
