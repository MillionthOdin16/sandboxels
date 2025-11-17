# Quick Reference Guide

> **Fast lookup for common element properties and patterns**

## Element Property Quick Reference

### Essential Properties
```javascript
{
    color: "#RRGGBB",           // Required - Hex color
    behavior: behaviors.TYPE,    // Required - Movement pattern
    category: "category_name",   // Required - UI category
    state: "solid|liquid|gas",   // Recommended
    density: 1000,              // Recommended for movable elements
}
```

### Temperature Properties
```javascript
{
    temp: 20,                   // Default temperature (°C)
    tempHigh: 100,             // Melting/boiling point
    stateHigh: "steam",        // Element when heated
    tempLow: 0,                // Freezing/condensation point
    stateLow: "ice",           // Element when cooled
    heatCapacity: 4.0,         // Heat resistance
}
```

### Physical Properties
```javascript
{
    density: 1000,             // kg/m³ - affects layering
    viscosity: 1.0,            // Liquid flow (higher = slower)
    hardness: 0.5,             // Damage resistance (0-1)
    breakInto: "shards",       // Element when broken
}
```

### Electrical Properties
```javascript
{
    conduct: 0.8,              // Conductivity (0-1)
    colorOn: "#ffff00",        // Color when powered
    behaviorOn: behaviors.GAS, // Behavior when powered
    insulate: true,            // Blocks electricity
}
```

### Burning Properties
```javascript
{
    burn: 50,                  // Burn chance % (0-100)
    burnTime: 300,             // Burn duration (ticks)
    burnInto: "ash",           // Result element
    fireColor: "#ff6600",      // Flame color
    burning: true,             // Start burning
}
```

### Visual Properties
```javascript
{
    alpha: 0.7,                // Transparency (0-1)
    opacity: 0.7,              // Alternative transparency
    colorPattern: textures.X,  // Texture pattern
    renderPreset: renderPresets.X, // Custom render
}
```

## Common Behaviors

| Behavior | Description | Use For |
|----------|-------------|---------|
| `behaviors.POWDER` | Falls down, spreads diagonally | Sand, dirt, powder |
| `behaviors.LIQUID` | Flows down and sideways | Water, oil, lava |
| `behaviors.GAS` | Rises and spreads | Steam, smoke, air |
| `behaviors.WALL` | Stationary | Solid materials |
| `behaviors.SUPERFLUID` | Flows very easily | Helium, special liquids |
| `behaviors.STURDYPOWDER` | Falls straight down | Heavy powder |

## Standard Densities (kg/m³)

| Material | Density | Layer |
|----------|---------|-------|
| Hydrogen | 0.09 | Top (lightest) |
| Steam | 0.6 | ↑ |
| Air | 1.2 | ↑ |
| Oil | 920 | ↑ |
| Water | 997 | Middle |
| Sand | 1602 | ↓ |
| Glass | 2500 | ↓ |
| Iron | 7874 | ↓ |
| Gold | 19300 | ↓ |
| Mercury | 13534 | Bottom (heaviest) |

## Standard Temperatures (°C)

| Transition | Temperature |
|------------|-------------|
| Water freezes | 0 |
| Water boils | 100 |
| Wood burns | ~300-400 |
| Iron melts | 1538 |
| Glass melts | 1400-1600 |
| Lava temp | 700-1200 |

## Categories

| Category | Description |
|----------|-------------|
| `tools` | Interactive tools (heat, cool, etc.) |
| `solids` | Non-moving solid materials |
| `liquids` | Flowing liquids |
| `gases` | Rising gases |
| `powders` | Falling granular materials |
| `special` | Special behavior elements |
| `land` | Terrain elements |
| `life` | Living creatures/plants |
| `food` | Edible items |
| `weapons` | Combat elements |
| `machines` | Mechanical devices |
| `decoration` | Visual elements |

## Reaction Patterns

### Simple Mix
```javascript
"water": { elem1: "wet_sand", elem2: null }
```

### Both Transform
```javascript
"fire": { elem1: "smoke", elem2: "steam" }
```

### Probability
```javascript
"acid": { elem1: null, elem2: "water", chance: 0.1 }
```

### Temperature Required
```javascript
"metal": { elem1: "oxide", tempMin: 200 }
```

### Electricity Required
```javascript
"water": { elem1: "hydrogen", elem2: "oxygen", charged: true }
```

### One-Way
```javascript
"catalyst": { elem2: "product", oneway: true }
```

## Helper Functions Reference

### Element Creation
```javascript
createPowderElement(config)  // Create powder
createLiquidElement(config)  // Create liquid
createGasElement(config)     // Create gas
createSolidElement(config)   // Create solid
```

### Mixins
```javascript
createBurnable(chance, time, into, color)
createConductive(conductivity, colorOn, behaviorOn)
createTemperatureReactive(high, stateHigh, low, stateLow)
createReaction(elem1, elem2, options)
```

### Utilities
```javascript
validateElement(element, name)  // Validate definition
addReactions(existing, new)     // Merge reactions
```

## Common Element Template

```javascript
"my_element": {
    // Visual
    color: "#rrggbb",
    
    // Behavior
    behavior: behaviors.POWDER,
    category: "powders",
    
    // Physical
    state: "solid",
    density: 1500,
    
    // Temperature
    tempHigh: 100,
    stateHigh: "my_liquid",
    
    // Reactions
    reactions: {
        "water": { elem1: "wet_version", elem2: null }
    },
    
    // Optional
    desc: "Description for UI",
    hidden: false
}
```

## Testing Checklist

- [ ] Element appears in correct category
- [ ] Color displays correctly
- [ ] Moves as expected (falls/flows/rises)
- [ ] Temperature changes work
- [ ] Reactions trigger correctly
- [ ] Density layering is correct
- [ ] Saves and loads properly
- [ ] No performance issues
- [ ] Works with common mods

## Common Gotchas

❌ **Don't:**
- Misspell element names in reactions
- Forget category or color
- Use invalid color format
- Set tempHigh without stateHigh
- Create infinite reaction loops
- Put expensive code in tick functions
- Break existing elements

✅ **Do:**
- Use realistic properties
- Test temperature ranges
- Validate before adding
- Document unusual choices
- Follow naming conventions
- Keep performance in mind
- Maintain compatibility

## Function Quick List

### Game Functions
```javascript
createPixel(element, x, y)      // Create new pixel
deletePixel(x, y)                // Remove pixel
changePixel(pixel, element)      // Transform pixel
tryMove(pixel, x, y)             // Attempt move
isEmpty(x, y)                    // Check empty
pixelTempCheck(pixel)            // Check temp
doDefaults(pixel)                // Apply defaults
```

### Pixel Properties
```javascript
pixel.x, pixel.y                 // Position
pixel.element                    // Element type
pixel.color                      // Current color
pixel.temp                       // Temperature
pixel.charge                     // Electrical charge
pixel.burning                    // Is burning
pixel.del                        // Mark for deletion
```

### Global Variables
```javascript
elements                         // All element definitions
behaviors                        // Behavior functions
pixelMap[x][y]                  // Pixel at position
currentPixels                    // Array of active pixels
pixelTicks                       // Current tick count
settings                         // Game settings
eLists                          // Element lists
```

## Links to Full Documentation

- **Detailed Guide**: See `REFACTORING.md`
- **Best Practices**: See `BEST-PRACTICES.md`
- **Examples**: See `ELEMENT-PATTERNS.md`
- **Helpers**: See `src/utils/elementHelpers.js`
- **Examples Code**: See `src/utils/elementExamples.js`

## Quick Start

1. Choose element type (powder/liquid/gas/solid)
2. Use helper function or copy template
3. Set required properties (color, behavior, category)
4. Add optional properties (temp, density, reactions)
5. Validate with validateElement()
6. Test in game
7. Refine based on testing

## Support

- **Issues**: Report bugs on GitHub
- **Questions**: Ask in Discord
- **Wiki**: Check Sandboxels wiki
- **Mods**: See /mods/ for examples
