# Localization Keys Reference

Complete reference of localization categories and common keys.

## Localization Method

```javascript
loca.GetText(category, key)
```

## Common Categories

### LAB Category

UI labels and buttons:

| Key | Description |
|-----|-------------|
| Close | Close button text |
| Save | Save button text |
| ToggleOptionsPanel | Options panel title |

### RES Category

Resource names:

| Key | Description |
|-----|-------------|
| Coin | Coin resource |
| IronOre | Iron Ore resource |
| Gold | Gold resource |
| Bread | Bread resource |

## Usage Pattern

```javascript
// Get localized text
var closeText = loca.GetText("LAB", "Close");
var coinName = loca.GetText("RES", "Coin");
```

## Related Documentation

- [Localization](../api-reference/ui-helpers/localization.md) - Localization API
- [Resource Localization](../api-reference/resources/resource-localization.md) - Resource localization

