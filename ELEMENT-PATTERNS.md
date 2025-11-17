# Element Definition Patterns

This guide provides practical examples of common element patterns used in Sandboxels, extracted from the actual codebase.

## Table of Contents
1. [Basic Elements](#basic-elements)
2. [State Changes](#state-changes)
3. [Reactions](#reactions)
4. [Special Behaviors](#special-behaviors)
5. [Advanced Patterns](#advanced-patterns)

## Basic Elements

### Simple Powder
```javascript
"sand": {
    color: "#e6d577",
    behavior: behaviors.POWDER,
    reactions: {
        "water": { elem1: "wet_sand", elem2: null }
    },
    tempHigh: 1700,
    stateHigh: "molten_glass",
    category: "land",
    state: "solid",
    density: 1602,
    heatCapacity: 0.835
}
```

**Key Properties:**
- `behavior: behaviors.POWDER` - Falls down with diagonal spread
- `density: 1602` - Heavier than water, will sink
- `tempHigh/stateHigh` - Melts to molten glass at high temp
- `reactions` - Becomes wet when touching water

### Simple Liquid
```javascript
"water": {
    color: "#2167ff",
    behavior: behaviors.LIQUID,
    tempHigh: 100,
    stateHigh: "steam",
    tempLow: 0,
    stateLow: "ice",
    category: "liquids",
    heatCapacity: 4.184,
    state: "liquid",
    density: 997,
    conduct: 0.02,
    viscosity: 1.0,
    stain: -0.5,
    extinguish: true
}
```

**Key Properties:**
- `behavior: behaviors.LIQUID` - Flows horizontally and down
- `viscosity: 1.0` - Standard flow rate (higher = slower)
- `conduct: 0.02` - Slightly conductive
- `extinguish: true` - Puts out fires
- `stain: -0.5` - Cleans stained pixels

### Simple Gas
```javascript
"steam": {
    color: "#ffffff",
    behavior: behaviors.GAS,
    tempLow: 100,
    stateLow: "water",
    category: "gases",
    state: "gas",
    density: 0.6,
    opacity: 0.3,
    alpha: 0.6
}
```

**Key Properties:**
- `behavior: behaviors.GAS` - Rises and spreads
- `density: 0.6` - Very light, rises quickly
- `alpha: 0.6` - Semi-transparent
- `tempLow/stateLow` - Condenses to water when cooled

### Simple Solid
```javascript
"glass": {
    color: "#dae5f0",
    behavior: behaviors.WALL,
    tempHigh: 1400,
    stateHigh: "molten_glass",
    category: "solids",
    state: "solid",
    density: 2500,
    hardness: 0.6,
    breakInto: "glass_shard",
    colorPattern: textures.GLASS
}
```

**Key Properties:**
- `behavior: behaviors.WALL` - Doesn't move
- `hardness: 0.6` - Somewhat resistant to damage
- `breakInto: "glass_shard"` - Fragments when broken
- `colorPattern` - Uses texture for visual variety

## State Changes

### Three-State Material (Solid → Liquid → Gas)
```javascript
// Solid state
"ice": {
    color: "#b0e0ff",
    behavior: behaviors.WALL,
    tempHigh: 0,
    stateHigh: "water",
    category: "solids",
    state: "solid"
}

// Liquid state
"water": {
    color: "#2167ff",
    behavior: behaviors.LIQUID,
    tempHigh: 100,
    stateHigh: "steam",
    tempLow: 0,
    stateLow: "ice",
    category: "liquids",
    state: "liquid"
}

// Gas state
"steam": {
    color: "#ffffff",
    behavior: behaviors.GAS,
    tempLow: 100,
    stateLow: "water",
    category: "gases",
    state: "gas"
}
```

### Alternative State Names
```javascript
"salt_water": {
    tempLow: -2,
    stateLowName: "salt_ice",  // Different name than "salt_water_ice"
    // ...
}
```

### Multiple Output States
```javascript
"salt_water": {
    tempHigh: 102,
    stateHigh: ["steam", "salt"],  // Separates into two elements
    // ...
}
```

## Reactions

### Simple Mixing
```javascript
reactions: {
    // This element + water → wet version
    "water": { elem1: "wet_sand", elem2: null },
    
    // This element + salt → salt water, nothing
    "salt": { elem1: "salt_water", elem2: null }
}
```

### Mutual Transformation
```javascript
reactions: {
    // Both elements change
    "fire": { elem1: "smoke", elem2: "steam" }
}
```

### Probability-Based
```javascript
reactions: {
    // Only happens 0.5% of the time
    "rock": { elem2: "wet_sand", chance: 0.00035 }
}
```

### Temperature-Dependent
```javascript
reactions: {
    // Only reacts above 60°C
    "methane": {
        elem1: "primordial_soup",
        elem2: "primordial_soup",
        tempMin: 60,
        charged: true
    }
}
```

### Conditional Reactions
```javascript
reactions: {
    "wet_sand": {
        oneway: true,  // Only wet_sand can initiate
        chance: 0.007,
        func: function(pixel) {
            // Custom logic
            if (isEmpty(pixel.x, pixel.y-1) || 
                isEmpty(pixel.x, pixel.y-2) || 
                isEmpty(pixel.x, pixel.y-3)) {
                changePixel(pixel, "foam");
                // ...
            }
        }
    }
}
```

### Electrolysis Pattern
```javascript
reactions: {
    // Split water with electricity
    "aluminum": {
        elem1: ["hydrogen", "hydrogen", "oxygen"],
        charged: true,
        chance: 0.0025
    }
}
```

## Special Behaviors

### Tools (Non-Placeable)
```javascript
"heat": {
    color: "#ff0000",
    behavior: [
        "HT:2|HT:2|HT:2",
        "HT:2|HT:2|HT:2",
        "HT:2|HT:2|HT:2",
    ],
    tool: function(pixel) {
        if (shiftDown) {
            pixel.temp += elements.heat.temp + 
                         (Math.random() * elements.heat.temp * 1.5) * 20;
        } else {
            pixel.temp += elements.heat.temp + 
                         (Math.random() * elements.heat.temp * 1.5);
        }
        pixelTempCheck(pixel);
    },
    temp: 2,
    category: "tools",
    insulate: true,
    canPlace: false,
    desc: "Use on pixels to increase temperature."
}
```

### Burning Elements
```javascript
"wood": {
    color: "#8b4513",
    behavior: behaviors.WALL,
    burn: 50,           // 50% chance to catch fire
    burnTime: 300,      // Burns for 300 ticks
    burnInto: "charcoal",
    fireColor: "#ff6600",
    category: "solids",
    tempHigh: 400,
    stateHigh: "fire",
    state: "solid"
}
```

### Conductive Elements
```javascript
"copper": {
    conduct: 0.98,              // 98% conductivity
    colorOn: "#ffaa00",         // Glows when powered
    reactions: {
        "water": {
            elem1: ["hydrogen", "hydrogen", "oxygen"],
            charged: true,      // Electrolysis when charged
            chance: 0.0075
        }
    }
}
```

### Sticky Elements
```javascript
"sticky": {
    behavior: behaviors.STICKY,  // Grabs adjacent pixels
    // ...
}
```

### Custom Tick Function
```javascript
"moving_object": {
    tick: function(pixel) {
        // Called every frame for every pixel of this type
        if (Math.random() < 0.1) {
            // Custom behavior
        }
    }
}
```

## Advanced Patterns

### Custom Color Selection
```javascript
"paint": {
    color: ["#c27070", "#c29c70", "#c2c270", "#70c270", 
            "#70c2c2", "#7070c2", "#c270c2"],
    tool: function(pixel) {
        if (!shiftDown) {
            pixel.color = pixelColorPick(pixel, currentColorMap.paint);
        } else {
            var rgb = currentColorMap.paint.replace("#", "")
                                           .match(/.{1,2}/g);
            for (var i = 0; i < rgb.length; i++) {
                rgb[i] = parseInt(rgb[i], 16);
            }
            pixel.color = "rgb(" + rgb.join(",") + ")";
        }
        delete pixel.origColor;
    },
    customColor: true,
    category: "tools"
}
```

### Lifecycle Functions
```javascript
"element": {
    onPlace: function(pixel) {
        // Called when pixel is first created
    },
    onChange: function(pixel, newElement) {
        // Called when pixel changes to different element
    },
    onDelete: function(pixel) {
        // Called when pixel is destroyed
    }
}
```

### Properties Object
```javascript
"element": {
    properties: {
        // Set custom properties on creation
        customProp: 100,
        customArray: [1, 2, 3],
        customObject: { key: "value" }
    }
}
```

### Density-Based Behavior
```javascript
// Heavy liquid (mercury) - sinks in most liquids
"mercury": {
    color: "#c0c0c0",
    behavior: behaviors.LIQUID,
    density: 13534,  // Very heavy
    viscosity: 1.5,
    state: "liquid"
}

// Light liquid (oil) - floats on water
"oil": {
    color: "#4d4d1a",
    behavior: behaviors.LIQUID,
    density: 920,    // Lighter than water (997)
    viscosity: 50,
    state: "liquid"
}
```

### Visual Effects

#### Heat Glow
```javascript
"lava": {
    renderPreset: renderPresets.HEATGLOW,
    // Glows based on temperature
}
```

#### Transparency
```javascript
"glass": {
    alpha: 0.7,  // Semi-transparent
    opacity: 0.7
}
```

#### Texture Pattern
```javascript
"brick": {
    colorPattern: textures.BRICK,
    // Uses brick texture instead of solid color
}
```

### Element Groups and Lists
```javascript
// Define in eLists section
eLists.SOIL = ["dirt", "mud", "sand", "wet_sand", "clay_soil"];

// Use in reactions or behaviors
if (eLists.SOIL.includes(pixelMap[x][y].element)) {
    // Do something with soil
}

// Add to list dynamically
eListAdd("SOIL", "new_soil_type");
```

### Rotatable Elements
```javascript
"directional_element": {
    rotatable: true,  // Can be rotated
    r: 0,            // Default rotation (0-3)
    // or
    flippableX: true,  // Can flip horizontally
    flippableY: true   // Can flip vertically
}
```

### Animal/Life Elements
```javascript
"ant": {
    color: "#1a0d00",
    behavior: behaviors.CRAWLER2,
    tick: function(pixel) {
        behaviors.FEEDPIXEL(pixel);
        // Additional behavior
    },
    foodNeed: 30,
    baby: "ant",
    category: "life"
}
```

## Common Property Reference

### Visual Properties
- `color` - Hex string, array of strings, or RGB string
- `colorPattern` - Texture pattern for variety
- `alpha` - Transparency (0-1)
- `opacity` - Alternative transparency
- `renderPreset` - Custom rendering function

### Physical Properties
- `density` - kg/m³ (affects separation in liquids)
- `viscosity` - Flow resistance (higher = slower)
- `temp` - Default temperature (Celsius)
- `tempHigh` - Melting/boiling point
- `tempLow` - Freezing/condensation point
- `stateHigh` - Element when heated
- `stateLow` - Element when cooled
- `heatCapacity` - Resistance to temperature change

### Behavior Properties
- `behavior` - Movement pattern (function or array)
- `behaviorOn` - Alternate behavior when charged
- `tick` - Called every frame
- `movable` - Can be moved by physics

### Interaction Properties
- `reactions` - Object of element interactions
- `conduct` - Electrical conductivity (0-1)
- `colorOn` - Color when electrically charged
- `insulate` - Blocks electricity
- `extinguish` - Puts out fires
- `stain` - Color staining amount

### Burning Properties
- `burn` - Chance to catch fire (0-100)
- `burnTime` - Duration of burning (ticks)
- `burnInto` - Element after burning
- `fireColor` - Flame color when burning
- `burning` - Starts burning on creation

### Structural Properties
- `hardness` - Damage resistance (0-1)
- `breakInto` - Element when broken
- `rotatable` - Can be rotated
- `flippableX/Y` - Can be flipped

### UI Properties
- `category` - Menu category
- `name` - Display name (optional)
- `desc` - Description text
- `hidden` - Hide from menu
- `tool` - Is a tool, not placeable element
- `canPlace` - Can be placed normally

## Tips and Tricks

1. **Start Simple**: Begin with a basic definition and add complexity gradually
2. **Test Frequently**: Reload and test after each change
3. **Use Existing Elements**: Copy similar elements as templates
4. **Check Dependencies**: Ensure referenced elements exist
5. **Balance Performance**: Limit expensive operations in tick functions
6. **Document Unusual Properties**: Add comments for non-obvious choices
7. **Follow Patterns**: Maintain consistency with existing elements
8. **Test Edge Cases**: Boundaries, extreme temperatures, high densities

## Next Steps

- See `BEST-PRACTICES.md` for coding guidelines
- See `REFACTORING.md` for codebase structure
- See `src/utils/elementHelpers.js` for helper functions
- Check existing elements in `index.html` for more examples
