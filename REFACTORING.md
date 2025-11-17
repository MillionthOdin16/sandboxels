# Sandboxels Code Structure Guide

## Overview
This document explains the structure of the Sandboxels codebase and best practices for modifying elements and game objects.

## Current Architecture

The game is built as a single-page application with all code embedded in `index.html`. This design choice was made for:
- Easy deployment (single file)
- Simplicity for modders
- No build step required
- Direct browser execution

## Core Components

### 1. Behaviors (lines ~165-643)
Behaviors define how different types of elements move and interact:
- `POWDER` - Falls down with diagonal spread
- `LIQUID` - Flows left/right and down with viscosity
- `GAS` - Rises and spreads in all directions
- `SOLID` - Static, no movement
- Custom behaviors for special elements

**Best Practice**: Reuse existing behaviors when creating new elements. Only create custom behaviors when absolutely necessary.

### 2. Elements Object (starts line ~830)
The main data structure containing all element definitions. Each element has properties like:
- `color` - Visual appearance
- `behavior` - Movement pattern
- `reactions` - Interactions with other elements
- `temp` - Temperature properties
- `category` - UI grouping

**Best Practice**: Follow the existing element structure. Use the element property guide (lines 805-829) as reference.

### 3. Pixel Class (line ~13764)
The Pixel class represents individual particles in the simulation. Properties are initialized from element definitions.

## How to Modify Elements

### Adding a New Element

1. **Choose a category**: tools, solids, liquids, gases, powders, special, land, life, food, weapons
2. **Pick a behavior**: Use existing behaviors when possible
3. **Define reactions**: Specify how it interacts with other elements
4. **Set physical properties**: temp, density, viscosity, etc.

Example:
```javascript
"my_element": {
    color: "#ff0000",
    behavior: behaviors.POWDER,
    category: "powders",
    state: "solid",
    density: 1500,
    tempHigh: 200,
    stateHigh: "my_molten_element",
    reactions: {
        "water": { elem1: "wet_sand", elem2: null }
    }
}
```

### Modifying Element Properties

**Location**: Find your element in the `elements` object (line ~830)

Common properties to modify:
- **Visual**: `color`, `colorPattern`, `alpha`
- **Physical**: `density`, `viscosity`, `temp`, `tempHigh`, `tempLow`
- **Behavioral**: `behavior`, `behaviorOn`, `charge`
- **Interactive**: `reactions`, `conduct`, `burn`, `burnTime`
- **Metadata**: `category`, `name`, `desc`, `hidden`

**Best Practice**: Test changes in small increments. Reload the page to see changes immediately.

### Creating Custom Reactions

Reactions define what happens when two elements touch:
```javascript
reactions: {
    "element_name": {
        elem1: "result_element_1",  // What this element becomes
        elem2: "result_element_2",  // What the other element becomes
        chance: 0.5,                // Optional: probability (0-1)
        temp1: 100,                 // Optional: temperature to set
        tempMin: 50,                // Optional: minimum temp required
        tempMax: 200,               // Optional: maximum temp required
        charged: true,              // Optional: requires electricity
        oneway: true               // Optional: one-way reaction
    }
}
```

### Custom Behaviors

When existing behaviors don't fit your needs:
```javascript
"my_element": {
    color: "#00ff00",
    tick: function(pixel) {
        // Custom per-frame logic
        // Access pixel properties: pixel.x, pixel.y, pixel.temp
        // Use game functions: tryMove, createPixel, deletePixel
    },
    category: "special"
}
```

## Helper Functions

### Common Game Functions

- `createPixel(element, x, y)` - Create a new pixel
- `deletePixel(x, y)` - Remove a pixel
- `changePixel(pixel, newElement)` - Transform a pixel
- `tryMove(pixel, newX, newY)` - Attempt to move a pixel
- `isEmpty(x, y)` - Check if a position is empty
- `pixelMap[x][y]` - Access pixel at position
- `elements[name]` - Access element definition

### Movement Helpers

- `doDefaults(pixel)` - Apply default behaviors (heat, burning)
- `doHeat(pixel)` - Calculate heat transfer
- `doBurning(pixel)` - Handle burning
- `pixelTempCheck(pixel)` - Check for state changes

## Best Practices

### 1. Element Design
- ✅ Reuse existing behaviors when possible
- ✅ Keep reactions simple and predictable
- ✅ Use appropriate categories for organization
- ✅ Test edge cases (high temp, low temp, density interactions)
- ❌ Avoid creating duplicate elements
- ❌ Don't make elements that break game balance

### 2. Code Style
- Use clear, descriptive names
- Follow existing indentation (tabs)
- Keep color values in hex format (`#RRGGBB`)
- Comment complex behaviors
- Match the style of surrounding code

### 3. Performance
- Minimize random number generation in hot paths
- Use chance-based reactions for expensive operations
- Keep tick functions lightweight
- Reuse behavior functions instead of duplicating code

### 4. Compatibility
- Don't break existing elements
- Test with common mod combinations
- Preserve save file compatibility
- Follow semantic versioning for major changes

## Common Patterns

### Melting/Freezing
```javascript
tempHigh: 100,
stateHigh: "steam",
tempLow: 0,
stateLow: "ice"
```

### Burning
```javascript
burn: 50,          // 50% chance per tick
burnTime: 300,     // Burns for 300 ticks
burnInto: "ash",   // Becomes ash when done
fireColor: "#ff6600"
```

### Electricity
```javascript
conduct: 0.8,      // 80% conductivity
colorOn: "#ffff00", // Glows when powered
behaviorOn: behaviors.SUPERFLUID  // Changes behavior when charged
```

### Density-based Separation
```javascript
state: "liquid",
density: 1000,     // Water = 1000, oil = 920
```

## Modding

For creating mods:
1. Create a new `.js` file in the `/mods/` directory
2. Use the modding API to add elements
3. Test locally before submitting
4. See `/mods/` for examples
5. Read CONTRIBUTING.md for submission guidelines

## Tools and Utilities

### Element Categories
- `tools` - Interactive tools (heat, cool, shock, etc.)
- `solids` - Non-moving solid elements
- `liquids` - Flowing liquids
- `gases` - Rising gases
- `powders` - Falling granular materials
- `special` - Special behavior elements
- `land` - Terrain and ground
- `life` - Living creatures and plants
- `food` - Edible items
- `weapons` - Combat elements
- `machines` - Mechanical devices
- `decoration` - Visual elements

### Element Lists (eLists)
Predefined groups of elements for common checks:
```javascript
eLists.SOIL      // Dirt, sand, mud, clay, etc.
eLists.ANIMAL    // All creature elements
eLists.SEEDS     // All seed types
```

Add to lists using: `eListAdd("LISTNAME", ["element1", "element2"])`

## Debugging

### Console Commands
- `elements` - View all element definitions
- `pixelMap[x][y]` - Inspect pixel at coordinates
- `currentPixels` - Array of all active pixels
- `settings` - View current settings

### Common Issues
1. **Element doesn't appear**: Check category and hidden property
2. **Reactions don't work**: Verify element names match exactly
3. **Performance issues**: Reduce tick function complexity
4. **Save/load problems**: Don't change element IDs

## Advanced Topics

### Enhanced Physics System
The game includes an optional advanced physics system (lines ~13840+):
- Per-particle velocity and momentum
- Air pressure field simulation
- Viscosity and surface tension
- Advanced heat transfer

Enable with: `settings.advancedPhysics = true`

### Color Patterns
Use `colorPattern` for textured elements:
```javascript
colorPattern: textures.BRICK,
```

### Render Presets
Custom rendering for special effects:
```javascript
renderPreset: renderPresets.HEATGLOW,
```

## Further Resources

- Element property reference: Lines 805-829 in index.html
- Behavior examples: Lines 165-643 in index.html
- Existing elements: Lines 830+ in index.html
- Modding wiki: https://sandboxels.wiki.gg/wiki/Modding/Getting_started

## Contributing

When contributing improvements:
1. Make minimal changes to achieve your goal
2. Test thoroughly with existing elements
3. Document new properties or patterns
4. Follow this guide's best practices
5. Submit clear pull requests with descriptions

## Version History

- v1.0 - Initial documentation structure
- Future: Consider extracting behaviors to separate modules
- Future: Create element definition helper functions
- Future: Add automated testing framework
