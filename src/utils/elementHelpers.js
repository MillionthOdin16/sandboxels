/**
 * Element Definition Helpers
 * Utility functions to make creating and modifying elements easier and more consistent
 */

/**
 * Creates a basic powder element with common properties
 * @param {Object} config - Element configuration
 * @param {string} config.name - Element key name
 * @param {string} config.color - Hex color code
 * @param {string} config.category - Element category
 * @param {number} [config.density=1500] - Density in kg/m³
 * @param {number} [config.tempHigh] - Temperature for state change high
 * @param {string} [config.stateHigh] - Element to transform into when hot
 * @param {number} [config.tempLow] - Temperature for state change low
 * @param {string} [config.stateLow] - Element to transform into when cold
 * @param {Object} [config.reactions={}] - Element reactions
 * @param {Object} [config.extra={}] - Additional properties
 * @returns {Object} Element definition object
 */
function createPowderElement(config) {
    return {
        color: config.color,
        behavior: behaviors.POWDER,
        category: config.category || "powders",
        state: "solid",
        density: config.density || 1500,
        tempHigh: config.tempHigh,
        stateHigh: config.stateHigh,
        tempLow: config.tempLow,
        stateLow: config.stateLow,
        reactions: config.reactions || {},
        ...config.extra
    };
}

/**
 * Creates a basic liquid element with common properties
 * @param {Object} config - Element configuration
 * @param {string} config.name - Element key name
 * @param {string} config.color - Hex color code
 * @param {string} config.category - Element category
 * @param {number} [config.density=1000] - Density in kg/m³
 * @param {number} [config.viscosity=1.0] - Viscosity (higher = slower)
 * @param {number} [config.tempHigh] - Boiling point
 * @param {string} [config.stateHigh] - Gas form
 * @param {number} [config.tempLow] - Freezing point
 * @param {string} [config.stateLow] - Solid form
 * @param {Object} [config.reactions={}] - Element reactions
 * @param {Object} [config.extra={}] - Additional properties
 * @returns {Object} Element definition object
 */
function createLiquidElement(config) {
    return {
        color: config.color,
        behavior: behaviors.LIQUID,
        category: config.category || "liquids",
        state: "liquid",
        density: config.density || 1000,
        viscosity: config.viscosity || 1.0,
        tempHigh: config.tempHigh,
        stateHigh: config.stateHigh,
        tempLow: config.tempLow,
        stateLow: config.stateLow,
        reactions: config.reactions || {},
        ...config.extra
    };
}

/**
 * Creates a basic gas element with common properties
 * @param {Object} config - Element configuration
 * @param {string} config.name - Element key name
 * @param {string} config.color - Hex color code
 * @param {string} config.category - Element category
 * @param {number} [config.density=1.2] - Density in kg/m³
 * @param {number} [config.tempLow] - Condensation point
 * @param {string} [config.stateLow] - Liquid form
 * @param {Object} [config.reactions={}] - Element reactions
 * @param {Object} [config.extra={}] - Additional properties
 * @returns {Object} Element definition object
 */
function createGasElement(config) {
    return {
        color: config.color,
        behavior: behaviors.GAS,
        category: config.category || "gases",
        state: "gas",
        density: config.density || 1.2,
        tempLow: config.tempLow,
        stateLow: config.stateLow,
        reactions: config.reactions || {},
        ...config.extra
    };
}

/**
 * Creates a basic solid element with common properties
 * @param {Object} config - Element configuration
 * @param {string} config.name - Element key name
 * @param {string} config.color - Hex color code
 * @param {string} config.category - Element category
 * @param {number} [config.density=2000] - Density in kg/m³
 * @param {number} [config.hardness=0.5] - Hardness (0-1)
 * @param {number} [config.tempHigh] - Melting point
 * @param {string} [config.stateHigh] - Liquid form
 * @param {Object} [config.reactions={}] - Element reactions
 * @param {Object} [config.extra={}] - Additional properties
 * @returns {Object} Element definition object
 */
function createSolidElement(config) {
    return {
        color: config.color,
        behavior: behaviors.WALL,
        category: config.category || "solids",
        state: "solid",
        density: config.density || 2000,
        hardness: config.hardness || 0.5,
        tempHigh: config.tempHigh,
        stateHigh: config.stateHigh,
        reactions: config.reactions || {},
        ...config.extra
    };
}

/**
 * Creates a reaction definition
 * @param {string} elem1 - Element 1 result (or null)
 * @param {string|null} elem2 - Element 2 result (or null)
 * @param {Object} [options={}] - Additional reaction options
 * @param {number} [options.chance] - Probability of reaction (0-1)
 * @param {number} [options.temp1] - Temperature to set on elem1
 * @param {number} [options.temp2] - Temperature to set on elem2
 * @param {number} [options.tempMin] - Minimum temperature required
 * @param {number} [options.tempMax] - Maximum temperature required
 * @param {boolean} [options.charged] - Requires electric charge
 * @param {boolean} [options.oneway] - One-way reaction
 * @param {Function} [options.func] - Custom reaction function
 * @returns {Object} Reaction definition
 */
function createReaction(elem1, elem2, options = {}) {
    const reaction = {
        elem1: elem1,
        elem2: elem2
    };
    
    // Add optional properties only if defined
    if (options.chance !== undefined) reaction.chance = options.chance;
    if (options.temp1 !== undefined) reaction.temp1 = options.temp1;
    if (options.temp2 !== undefined) reaction.temp2 = options.temp2;
    if (options.tempMin !== undefined) reaction.tempMin = options.tempMin;
    if (options.tempMax !== undefined) reaction.tempMax = options.tempMax;
    if (options.charged !== undefined) reaction.charged = options.charged;
    if (options.oneway !== undefined) reaction.oneway = options.oneway;
    if (options.func !== undefined) reaction.func = options.func;
    
    return reaction;
}

/**
 * Adds multiple reactions to an element's reaction object
 * @param {Object} reactions - Existing reactions object
 * @param {Object} newReactions - Object mapping element names to reaction configs
 * @returns {Object} Combined reactions object
 */
function addReactions(reactions, newReactions) {
    return { ...reactions, ...newReactions };
}

/**
 * Creates a burnable element mixin
 * @param {number} burnChance - Chance to burn per tick (0-100)
 * @param {number} burnTime - Time to burn in ticks
 * @param {string} burnInto - Element to become after burning
 * @param {string} [fireColor="#ff6600"] - Color of fire
 * @returns {Object} Burnable properties
 */
function createBurnable(burnChance, burnTime, burnInto, fireColor = "#ff6600") {
    return {
        burn: burnChance,
        burnTime: burnTime,
        burnInto: burnInto,
        fireColor: fireColor
    };
}

/**
 * Creates a conductive element mixin
 * @param {number} conductivity - Conductivity (0-1)
 * @param {string} [colorOn] - Color when charged
 * @param {*} [behaviorOn] - Behavior when charged
 * @returns {Object} Conductive properties
 */
function createConductive(conductivity, colorOn, behaviorOn) {
    const props = { conduct: conductivity };
    if (colorOn) props.colorOn = colorOn;
    if (behaviorOn) props.behaviorOn = behaviorOn;
    return props;
}

/**
 * Creates temperature-reactive properties
 * @param {number} tempHigh - Temperature for high state change
 * @param {string} stateHigh - Element to become when heated
 * @param {number} [tempLow] - Temperature for low state change
 * @param {string} [stateLow] - Element to become when cooled
 * @returns {Object} Temperature properties
 */
function createTemperatureReactive(tempHigh, stateHigh, tempLow, stateLow) {
    const props = {
        tempHigh: tempHigh,
        stateHigh: stateHigh
    };
    if (tempLow !== undefined) {
        props.tempLow = tempLow;
        props.stateLow = stateLow;
    }
    return props;
}

/**
 * Validates an element definition
 * @param {Object} element - Element definition to validate
 * @param {string} name - Element name
 * @returns {Object} Validation result with isValid and errors array
 */
function validateElement(element, name) {
    const errors = [];
    
    // Required properties
    if (!element.color) errors.push(`${name}: Missing required property 'color'`);
    if (!element.category) errors.push(`${name}: Missing required property 'category'`);
    
    // Validate color format
    if (element.color && typeof element.color === 'string') {
        if (!element.color.match(/^#[0-9a-fA-F]{6}$/) && !element.color.match(/^rgb/)) {
            errors.push(`${name}: Invalid color format '${element.color}'`);
        }
    }
    
    // Validate behavior
    if (element.behavior && typeof element.behavior !== 'function' && !Array.isArray(element.behavior)) {
        errors.push(`${name}: Invalid behavior type`);
    }
    
    // Validate temperature properties
    if (element.tempHigh !== undefined && !element.stateHigh) {
        errors.push(`${name}: tempHigh defined but stateHigh is missing`);
    }
    if (element.tempLow !== undefined && !element.stateLow) {
        errors.push(`${name}: tempLow defined but stateLow is missing`);
    }
    
    // Validate reactions
    if (element.reactions && typeof element.reactions !== 'object') {
        errors.push(`${name}: Reactions must be an object`);
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Example usage:
 * 
 * // Create a simple powder element
 * elements.my_sand = createPowderElement({
 *     color: "#e6d577",
 *     category: "land",
 *     density: 1602,
 *     tempHigh: 1700,
 *     stateHigh: "molten_glass",
 *     reactions: {
 *         "water": createReaction("wet_sand", null)
 *     }
 * });
 * 
 * // Create a liquid with temperature changes
 * elements.my_water = createLiquidElement({
 *     color: "#2167ff",
 *     category: "liquids",
 *     density: 997,
 *     viscosity: 1.0,
 *     tempHigh: 100,
 *     stateHigh: "steam",
 *     tempLow: 0,
 *     stateLow: "ice",
 *     extra: {
 *         heatCapacity: 4.184,
 *         extinguish: true
 *     }
 * });
 * 
 * // Create a burnable wood element
 * elements.my_wood = createSolidElement({
 *     color: "#8b4513",
 *     category: "solids",
 *     extra: {
 *         ...createBurnable(50, 300, "ash", "#ff6600"),
 *         ...createTemperatureReactive(400, "charcoal")
 *     }
 * });
 */
