# Sandboxels Source Utilities

This directory contains helper utilities and examples to make element development easier and more consistent.

## Directory Structure

```
src/
├── utils/
│   ├── elementHelpers.js   - Helper functions for creating elements
│   └── elementExamples.js  - Practical usage examples
├── elements/               - (Future) Organized element definitions
└── core/                   - (Future) Core game functions
```

## Available Utilities

### Element Helper Functions (`utils/elementHelpers.js`)

Factory functions for creating consistent element definitions:

#### Element Factories
- **`createPowderElement(config)`** - Create powder elements (sand, dirt, etc.)
- **`createLiquidElement(config)`** - Create liquid elements (water, oil, etc.)
- **`createGasElement(config)`** - Create gas elements (steam, smoke, etc.)
- **`createSolidElement(config)`** - Create solid elements (metal, wood, etc.)

#### Property Mixins
- **`createBurnable(chance, time, into, color)`** - Add burning properties
- **`createConductive(conductivity, colorOn, behaviorOn)`** - Add electrical properties
- **`createTemperatureReactive(high, stateHigh, low, stateLow)`** - Add temperature reactions
- **`createReaction(elem1, elem2, options)`** - Create reaction definitions

#### Utilities
- **`validateElement(element, name)`** - Validate element definition
- **`addReactions(existing, new)`** - Merge reaction objects

### Usage Examples (`utils/elementExamples.js`)

Complete examples showing how to use the helper functions:

- Simple powder element
- Liquid with state changes
- Rising gas element
- Solid with melting point
- Burnable wood
- Complex acid reactions
- Custom behavior element
- Conductive metal
- Multi-state material (ice/water/steam)
- Validation example

## How to Use

### Option 1: Direct Use in Mods

Copy the helper functions into your mod file:

```javascript
// In your mod file
// [Paste helper functions here]

// Then use them
elements.my_powder = createPowderElement({
    color: "#d4b896",
    category: "land",
    density: 1600
});
```

### Option 2: Reference for Manual Creation

Use the helpers as a guide for what properties to include:

```javascript
// See what createPowderElement() includes
// Then manually create similar elements
elements.my_powder = {
    color: "#d4b896",
    behavior: behaviors.POWDER,
    category: "land",
    state: "solid",
    density: 1600,
    // etc.
};
```

### Option 3: Copy Patterns

Copy and modify the examples:

```javascript
// Start with an example from elementExamples.js
// Modify colors, densities, reactions, etc.
// Test and refine
```

## Benefits

### Consistency
Helper functions ensure all elements have the required properties and follow the same patterns.

### Documentation
Functions include JSDoc comments explaining all parameters and options.

### Validation
Built-in validation catches common mistakes before they cause problems.

### Maintainability
Centralized patterns make it easier to update elements consistently.

### Learning
Examples show proper usage and best practices.

## Examples

### Creating a Basic Sand Element

```javascript
const mySand = createPowderElement({
    color: "#e6d577",
    category: "land",
    density: 1602,
    tempHigh: 1700,
    stateHigh: "molten_glass",
    reactions: {
        "water": createReaction("wet_sand", null)
    }
});

// Validate before adding
const validation = validateElement(mySand, "my_sand");
if (validation.isValid) {
    elements.my_sand = mySand;
} else {
    console.error("Validation errors:", validation.errors);
}
```

### Creating a Burnable Wood

```javascript
const myWood = createSolidElement({
    color: "#8b4513",
    category: "solids",
    density: 700,
    hardness: 0.5,
    tempHigh: 400,
    stateHigh: "charcoal",
    extra: {
        ...createBurnable(50, 300, "ash", "#ff6600")
    }
});

elements.my_wood = myWood;
```

### Creating a Complete Water Cycle

```javascript
// Ice (solid)
const myIce = createSolidElement({
    color: "#b0e0ff",
    category: "solids",
    density: 920,
    extra: {
        ...createTemperatureReactive(0, "my_water"),
        hardness: 0.3
    }
});

// Water (liquid)
const myWater = createLiquidElement({
    color: "#2167ff",
    category: "liquids",
    density: 997,
    viscosity: 1.0,
    tempHigh: 100,
    stateHigh: "my_steam",
    tempLow: 0,
    stateLow: "my_ice",
    extra: {
        heatCapacity: 4.184
    }
});

// Steam (gas)
const mySteam = createGasElement({
    color: "#ffffff",
    category: "gases",
    density: 0.6,
    tempLow: 100,
    stateLow: "my_water",
    extra: {
        alpha: 0.6
    }
});

elements.my_ice = myIce;
elements.my_water = myWater;
elements.my_steam = mySteam;
```

## Future Enhancements

### Planned Additions

1. **Element Categories** (`elements/` directory)
   - Separate files for each category
   - Better organization
   - Easier to find elements

2. **Core Functions** (`core/` directory)
   - Extract game engine functions
   - Better modularization
   - Clearer dependencies

3. **Build System**
   - Combine files into single HTML
   - Minification
   - Source maps

4. **Testing Framework**
   - Automated element tests
   - Reaction verification
   - Performance benchmarks

5. **Validation Tools**
   - CLI validation script
   - Pre-commit hooks
   - Automated checks

## Contributing

When adding new utilities:

1. Follow existing code style
2. Add JSDoc comments
3. Include usage examples
4. Update this README
5. Test thoroughly
6. Document edge cases

## Documentation Links

- **Main Guide**: `../REFACTORING.md`
- **Best Practices**: `../BEST-PRACTICES.md`
- **Element Patterns**: `../ELEMENT-PATTERNS.md`
- **Quick Reference**: `../QUICK-REFERENCE.md`

## Support

- **Questions**: Ask in Discord
- **Issues**: Report on GitHub
- **Examples**: Check `/mods/` directory
- **Wiki**: https://sandboxels.wiki.gg/

## License

Same as main Sandboxels project. See `../license.txt`.
