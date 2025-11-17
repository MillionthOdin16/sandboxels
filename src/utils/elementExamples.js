/**
 * Example Element Definitions Using Helper Functions
 * 
 * This file demonstrates how to use the element helper functions
 * to create new elements with consistent, maintainable code.
 * 
 * To use these examples:
 * 1. Copy the helper functions from src/utils/elementHelpers.js into your mod
 * 2. Adapt these patterns for your own elements
 * 3. Test thoroughly before submitting
 */

// Example 1: Simple Powder Element
// Creates a basic falling powder like sand
const exampleSand = createPowderElement({
    color: "#d4b896",
    category: "land",
    density: 1600,
    tempHigh: 1500,
    stateHigh: "molten_sand",
    reactions: {
        "water": createReaction("wet_sand", null)
    }
});

// Example 2: Liquid with Temperature Changes
// Creates a liquid that freezes and boils
const exampleLiquid = createLiquidElement({
    color: "#4d85ff",
    category: "liquids",
    density: 1000,
    viscosity: 1.0,
    tempHigh: 100,
    stateHigh: "steam",
    tempLow: 0,
    stateLow: "ice",
    extra: {
        heatCapacity: 4.0,
        conduct: 0.02,
        extinguish: true
    }
});

// Example 3: Rising Gas
// Creates a gas that condenses when cooled
const exampleGas = createGasElement({
    color: "#ffffff",
    category: "gases",
    density: 0.6,
    tempLow: 100,
    stateLow: "water",
    extra: {
        alpha: 0.7,
        opacity: 0.7
    }
});

// Example 4: Solid with Melting Point
// Creates a solid that melts when heated
const exampleMetal = createSolidElement({
    color: "#c0c0c0",
    category: "solids",
    density: 7800,
    hardness: 0.8,
    tempHigh: 1538,
    stateHigh: "molten_iron",
    extra: {
        conduct: 0.9,
        colorOn: "#ffaa00"
    }
});

// Example 5: Burnable Wood
// Creates a solid that can catch fire
const exampleWood = createSolidElement({
    color: "#8b4513",
    category: "solids",
    density: 700,
    hardness: 0.5,
    tempHigh: 400,
    stateHigh: "charcoal",
    extra: {
        ...createBurnable(50, 300, "ash", "#ff6600"),
        state: "solid"
    }
});

// Example 6: Complex Reactions
// Creates an acid that reacts with multiple elements
const exampleAcid = createLiquidElement({
    color: "#88ff00",
    category: "liquids",
    density: 1100,
    viscosity: 2.0,
    reactions: {
        // Simple dissolution
        "dirt": createReaction(null, "dirty_water"),
        
        // Probability-based reaction
        "metal": createReaction(null, "corroded_metal", { 
            chance: 0.1 
        }),
        
        // Temperature-dependent reaction
        "ice": createReaction("water", "water", { 
            tempMin: 0 
        }),
        
        // Charged reaction
        "conductor": createReaction("steam", "metal", { 
            charged: true 
        })
    },
    extra: {
        stain: 0.1
    }
});

// Example 7: Custom Behavior Element
// Creates an element with custom tick function
const exampleCustom = {
    color: "#ff00ff",
    category: "special",
    
    // Custom behavior function
    tick: function(pixel) {
        // Check if pixel just spawned
        if (pixel.start === pixelTicks) return;
        
        // Custom logic - randomly move up or down
        if (Math.random() < 0.1) {
            var dir = Math.random() < 0.5 ? 1 : -1;
            tryMove(pixel, pixel.x, pixel.y + dir);
        }
        
        // Apply defaults (heat, burning, etc.)
        doDefaults(pixel);
    },
    
    state: "solid",
    density: 1000
};

// Example 8: Conductive Element
// Creates a metal that conducts electricity
const exampleConductor = createSolidElement({
    color: "#ffd700",
    category: "solids",
    density: 19300,
    hardness: 0.7,
    extra: {
        ...createConductive(0.95, "#ffff00"),
        ...createTemperatureReactive(1064, "molten_gold")
    }
});

// Example 9: Multi-State Material
// Creates a complete ice → water → steam cycle
const exampleIce = createSolidElement({
    color: "#b0e0ff",
    category: "solids",
    density: 920,
    extra: {
        ...createTemperatureReactive(0, "example_water"),
        hardness: 0.3
    }
});

const exampleWater = createLiquidElement({
    color: "#2167ff",
    category: "liquids",
    density: 997,
    viscosity: 1.0,
    tempHigh: 100,
    stateHigh: "example_steam",
    tempLow: 0,
    stateLow: "example_ice",
    extra: {
        heatCapacity: 4.184,
        extinguish: true
    }
});

const exampleSteam = createGasElement({
    color: "#ffffff",
    category: "gases",
    density: 0.6,
    tempLow: 100,
    stateLow: "example_water",
    extra: {
        alpha: 0.6
    }
});

// Example 10: Validation
// Always validate your elements before adding them
const myElement = createPowderElement({
    color: "#123456",
    category: "powders"
});

const validation = validateElement(myElement, "my_element");
if (!validation.isValid) {
    console.error("Element validation failed:");
    validation.errors.forEach(error => console.error("  -", error));
}

/**
 * How to Add These Elements to the Game:
 * 
 * 1. In index.html, add after the elements object:
 * 
 *    elements.example_sand = exampleSand;
 *    elements.example_liquid = exampleLiquid;
 *    // etc.
 * 
 * 2. Or in a mod file:
 * 
 *    elements["example_sand"] = exampleSand;
 * 
 * 3. Test in the game:
 *    - Reload the page
 *    - Look for your element in its category
 *    - Test temperature changes
 *    - Test reactions
 *    - Verify behavior
 */

/**
 * Best Practices Checklist:
 * 
 * ✓ Use helper functions for consistency
 * ✓ Validate elements before adding
 * ✓ Test temperature ranges
 * ✓ Test all reactions
 * ✓ Use realistic properties when possible
 * ✓ Keep tick functions lightweight
 * ✓ Document unusual properties
 * ✓ Follow naming conventions
 * ✓ Check performance with many pixels
 * ✓ Test save/load functionality
 */

/**
 * Common Patterns Summary:
 * 
 * Powder:   Falls down, spreads diagonally
 * Liquid:   Flows horizontally and down
 * Gas:      Rises and spreads in all directions
 * Solid:    Stationary, can melt/break
 * 
 * Reactions: Define in reactions object
 * Burning:   Use createBurnable() mixin
 * Electric:  Use createConductive() mixin
 * States:    Use createTemperatureReactive() mixin
 */
