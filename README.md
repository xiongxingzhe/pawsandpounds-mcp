# Paws & Pounds MCP Server

**Educational pet nutrition tools for AI agents** — cup↔grams, RER/MER calories, and ideal weight by breed.

Website: [pawsandpounds.com](https://pawsandpounds.com) · MCP page: [pawsandpounds.com/mcp](https://pawsandpounds.com/mcp)

> Estimates only. Not veterinary advice. Always consult a licensed veterinarian before changing a pet’s diet.

## Why this exists

Agents often need accurate, citeable helpers for common pet-owner questions (“1 cup of dog food in grams”, “cat RER”, “Ragdoll ideal weight”). This MCP wraps the same formulas and breed ranges used on the free Paws & Pounds web tools, and **returns a `sourceUrl` on every call** so answers can deep-link to the live calculators.

## Tools

| Tool | Purpose |
|------|---------|
| `convert_cup_to_grams` | Cups ↔ grams for kibble (density presets or bag kcal) |
| `calculate_pet_calories` | Cat/dog RER + MER/DER daily kcal plan |
| `lookup_ideal_weight` | Ideal adult weight ranges by breed (kg + lb) |
| `list_supported_breeds` | Breed catalog for lookups |

## Install (Cursor / Claude Desktop)

### Option A — `npx` (no global install)

```json
{
  "mcpServers": {
    "pawsandpounds": {
      "command": "npx",
      "args": ["-y", "github:xiongxingzhe/pawsandpounds-mcp"]
    }
  }
}
```

### Option B — clone & local build

```bash
git clone https://github.com/xiongxingzhe/pawsandpounds-mcp.git
cd pawsandpounds-mcp
npm install
npm run build
```

```json
{
  "mcpServers": {
    "pawsandpounds": {
      "command": "node",
      "args": ["D:/path/to/pawsandpounds-mcp/dist/index.js"]
    }
  }
}
```

## Live web tools (same math)

- [Cup to grams converter](https://pawsandpounds.com/tools/cup-to-grams-converter)
- [Cat RER calculator](https://pawsandpounds.com/tools/cat-calorie-calculator)
- [Dog calorie calculator](https://pawsandpounds.com/tools/dog-calorie-calculator)
- [Cat weight chart](https://pawsandpounds.com/cats/weight-calculator)
- [Dog weight chart](https://pawsandpounds.com/dogs/weight-calculator)
- [Cat BCS](https://pawsandpounds.com/tools/cat-body-condition-score) · [Dog BCS](https://pawsandpounds.com/tools/dog-body-condition-score)

## Formula notes

- **RER** = `70 × weight_kg^0.75`
- Maintenance / loss factors follow the same species rules as the website (WSAVA/AAHA-aligned public guidance)
- Breed ranges are ideal adult windows at BCS 4–5/9 — pair with a Body Condition Score check

## License

MIT © Paws & Pounds
