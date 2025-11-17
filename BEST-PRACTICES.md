# Sandboxels Best Practices Guide

## Code Organization

### File Structure
The current architecture uses a monolithic `index.html` file. While this has deployment advantages, contributors should be aware of the logical sections:

1. **Configuration** (lines 51-164) - Version info, settings, global variables
2. **Behaviors** (lines 165-643) - Movement patterns for element types
3. **Textures** (lines 644-676) - Visual texture patterns
4. **Render Presets** (lines 677-773) - Custom rendering functions
5. **Element Lists** (lines 774-791) - Grouped element arrays
6. **Elements** (lines 830-~12000) - All element definitions
7. **Core Functions** (lines ~12000-~20000) - Game engine code
8. **UI/HTML** (lines ~20000+) - Interface markup

### When to Add vs Modify

**Add a new element when:**
- Creating truly unique functionality
- Implementing a new material or substance
- Adding requested community features
- No existing element can be repurposed

**Modify an existing element when:**
- Fixing bugs or balance issues
- Improving consistency
- Adding missing properties
- Enhancing realism

## Element Design Principles

### 1. Consistency

**Colors**: Use realistic or intuitive colors
```javascript
// Good - realistic colors
"water": { color: "#2167ff" }  // Blue
"fire": { color: "#ff6600" }   // Orange-red
"gold": { color: "#ffdd00" }   // Yellow-gold

// Avoid - confusing colors
"water": { color: "#ff0000" }  // Red water is confusing
```

**Naming**: Use clear, descriptive names
```javascript
// Good
"salt_water"
"molten_iron"
"wet_sand"

// Avoid
"sw"  // Unclear
"thing"  // Too generic
"super_element_v2"  // Version in name
```

### 2. Balance

Elements should be:
- **Fair**: Not overpowered or trivial
- **Useful**: Have a purpose or interesting behavior
- **Unique**: Distinct from existing elements
- **Predictable**: Behave as users expect

```javascript
// Good - balanced burning
{
    burn: 30,        // Moderate chance
    burnTime: 200,   // Reasonable duration
    burnInto: "ash"  // Appropriate result
}

// Avoid - unbalanced
{
    burn: 100,       // Always burns
    burnTime: 1,     // Burns instantly
    burnInto: "gold" // Unrealistic result
}
```

### 3. Realism

Prioritize realistic properties when possible:
```javascript
// Good - realistic density
"water": { density: 997 }    // Actual water density
"gold": { density: 19300 }   // Actual gold density

// Good - realistic temperatures (Celsius)
"water": { tempHigh: 100, tempLow: 0 }    // Real boiling/freezing
"iron": { tempHigh: 1538 }                // Real melting point
```

### 4. Performance

Optimize for the simulation loop:

```javascript
// Good - efficient reaction checks
reactions: {
    "water": { elem1: "wet_sand", elem2: null, chance: 0.01 }
}

// Avoid - expensive operations
tick: function(pixel) {
    // Don't do this every frame:
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // Expensive nested loops
        }
    }
}

// Better - limit scope
tick: function(pixel) {
    // Only check adjacent pixels
    for (let i = 0; i < adjacentCoords.length; i++) {
        // Smaller scope
    }
}
```

## Reaction Design

### Simple Reactions
```javascript
reactions: {
    // Basic transformation
    "water": { elem1: "wet_sand", elem2: null },
    
    // Mutual transformation
    "fire": { elem1: "smoke", elem2: "steam" },
    
    // With probability
    "acid": { elem1: null, elem2: "dirty_water", chance: 0.1 },
    
    // Temperature-dependent
    "ice": { elem1: "water", elem2: null, tempMin: 0 },
    
    // Requires charge
    "metal": { elem1: "molten_metal", charged: true, temp1: 1500 }
}
```

### Complex Reactions
```javascript
reactions: {
    "element_name": {
        elem1: "result1",           // What this pixel becomes
        elem2: "result2",           // What the other becomes
        chance: 0.5,                // 50% probability
        temp1: 100,                 // Set temperature of result1
        temp2: 50,                  // Set temperature of result2
        tempMin: 20,                // Only react if >= 20°C
        tempMax: 100,               // Only react if <= 100°C
        charged: true,              // Requires electricity
        oneway: true,               // One-way reaction
        func: function(pixel) {     // Custom logic
            // Additional behavior
        }
    }
}
```

## Behavior Best Practices

### Reuse Standard Behaviors

```javascript
// Good - use existing behaviors
{
    behavior: behaviors.POWDER  // Falling sand-like
}
{
    behavior: behaviors.LIQUID  // Flowing liquid
}
{
    behavior: behaviors.GAS     // Rising gas
}

// Only create custom when necessary
{
    behavior: function(pixel) {
        // Truly unique behavior only
    }
}
```

### Custom Behavior Template

```javascript
{
    behavior: function(pixel) {
        // 1. Check if pixel just spawned
        if (pixel.start === pixelTicks) return;
        
        // 2. Handle powered state
        if (pixel.charge && elements[pixel.element].behaviorOn) {
            pixelTick(pixel);
            return;
        }
        
        // 3. Custom movement logic
        // ... your code here ...
        
        // 4. Always call defaults at end
        doDefaults(pixel);
    }
}
```

## Common Patterns

### State Changes (Solid/Liquid/Gas)

```javascript
// Water cycle example
"ice": {
    color: "#b0e0ff",
    behavior: behaviors.WALL,
    tempHigh: 0,
    stateHigh: "water",
    state: "solid",
    category: "solids"
},
"water": {
    color: "#2167ff",
    behavior: behaviors.LIQUID,
    tempHigh: 100,
    stateHigh: "steam",
    tempLow: 0,
    stateLow: "ice",
    state: "liquid",
    category: "liquids"
},
"steam": {
    color: "#ffffff",
    behavior: behaviors.GAS,
    tempLow: 100,
    stateLow: "water",
    state: "gas",
    category: "gases"
}
```

### Fire and Burning

```javascript
// Burnable element
{
    burn: 50,              // 50% burn chance per tick
    burnTime: 300,         // Burns for 300 ticks (5 seconds)
    burnInto: "ash",       // Becomes ash
    fireColor: "#ff6600",  // Orange flame
    burning: false         // Not burning on creation
}

// Auto-burning element
{
    burning: true,         // Starts burning
    burnTime: 100
}
```

### Electricity

```javascript
// Conductor
{
    conduct: 0.9,              // 90% conductivity
    colorOn: "#ffff00",        // Yellow when powered
    behaviorOn: behaviors.GAS  // Floats when charged
}

// Insulator
{
    insulate: true,  // Doesn't conduct
}
```

### Density and Separation

```javascript
// Heavy liquid (sinks in water)
{
    state: "liquid",
    density: 1260,  // Mercury
    behavior: behaviors.LIQUID
}

// Light liquid (floats on water)
{
    state: "liquid",
    density: 920,   // Oil
    behavior: behaviors.LIQUID
}

// Water reference
{
    density: 997    // Water
}
```

## Testing Guidelines

### Manual Testing Checklist

1. **Creation**: Element appears with correct color
2. **Movement**: Behaves as expected (falls, flows, rises)
3. **Temperature**: Changes states at correct temps
4. **Reactions**: Interacts correctly with common elements
5. **Edge Cases**: Test at screen boundaries
6. **Performance**: Doesn't cause lag with many pixels
7. **Saving**: Saves and loads correctly
8. **Modded**: Compatible with common mods

### Test Scenarios

```javascript
// Test temperature changes
// 1. Create element
// 2. Heat with heat tool
// 3. Verify state change at tempHigh
// 4. Cool with cool tool
// 5. Verify state change at tempLow

// Test reactions
// 1. Create element A
// 2. Create element B adjacent
// 3. Verify reaction occurs
// 4. Check result elements
// 5. Verify properties (temp, color)

// Test density
// 1. Create water
// 2. Add your liquid
// 3. Verify separation (heavy sinks, light floats)
```

## Documentation

### Element Comments

```javascript
// Good - explain unusual properties
"super_cold_ice": {
    color: "#a0d0ff",
    tempLow: -100,  // Stays frozen at normal temps
    stateLow: "dry_ice",
    category: "special"
}

// Add descriptions for UI
{
    desc: "Extremely cold ice that sublimates into dry ice"
}
```

### Property Documentation

Use JSDoc style for custom functions:

```javascript
/**
 * Custom behavior for bouncing balls
 * @param {Object} pixel - The pixel object
 */
behavior: function(pixel) {
    // Implementation
}
```

## Version Control

### Commit Messages

```
Good:
- "Add mercury element with proper density"
- "Fix water boiling temperature"
- "Balance fire spread rate"

Avoid:
- "changes"
- "update"
- "fix bug"
```

### Pull Requests

Include:
1. **Description**: What was added/changed
2. **Reasoning**: Why this change is needed
3. **Testing**: How you verified it works
4. **Screenshots**: Visual demonstration
5. **Breaking Changes**: Any compatibility issues

## Common Mistakes to Avoid

### 1. Missing Properties

```javascript
// Bad - incomplete definition
{
    color: "#ff0000"
    // Missing category, behavior
}

// Good - complete definition
{
    color: "#ff0000",
    behavior: behaviors.POWDER,
    category: "powders",
    state: "solid"
}
```

### 2. Incorrect References

```javascript
// Bad - typo in reaction
reactions: {
    "wter": { elem1: "wet_sand" }  // "wter" doesn't exist
}

// Good - correct spelling
reactions: {
    "water": { elem1: "wet_sand" }
}
```

### 3. Performance Issues

```javascript
// Bad - runs every frame for every pixel
tick: function(pixel) {
    Math.random();  // Expensive when called millions of times
}

// Good - use chance-based approach
tick: function(pixel) {
    if (Math.random() < 0.01) {  // Only 1% of the time
        // Do something
    }
}
```

### 4. Breaking Changes

```javascript
// Bad - changes existing element behavior
elements.water.color = "#ff0000";  // Breaks existing saves

// Good - create new variant
elements.red_water = {
    color: "#ff0000",
    behavior: behaviors.LIQUID,
    // ... based on water
}
```

## Accessibility

### Color Considerations

- Use sufficient contrast
- Avoid relying solely on color for information
- Test with colorblind simulators
- Provide text descriptions

### Performance

- Test on lower-end devices
- Limit particle counts for complex elements
- Optimize tick functions
- Use chance-based updates

## Future-Proofing

### Extensibility

Design elements to be easily modified:

```javascript
// Good - parameterized
{
    tempHigh: 100,
    stateHigh: "steam",
    // Easy to adjust values
}

// Avoid - hardcoded
tick: function(pixel) {
    if (pixel.temp > 100) {  // Hard to change
        changePixel(pixel, "steam");
    }
}
```

### Backwards Compatibility

- Don't remove existing properties
- Don't change element IDs
- Provide migration paths for saves
- Document breaking changes

## Resources

### Reference Materials

- **Chemistry**: Periodic table, material properties
- **Physics**: Density, viscosity, temperature scales
- **Color**: Hex color picker, material colors
- **Similar Games**: Powder Game, The Powder Toy

### Community

- Discord server for questions
- Wiki for documentation
- GitHub issues for bugs
- Reddit for showcase

## Conclusion

Good element design is:
- **Intuitive**: Works as users expect
- **Balanced**: Fair and useful
- **Performant**: Doesn't lag the simulation
- **Documented**: Clear and well-explained
- **Tested**: Verified to work correctly

Follow these practices to create high-quality elements that enhance the game for everyone!
