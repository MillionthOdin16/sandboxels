# Implementation Plan: The Powder Toy Features in Sandboxels

## Executive Summary

This document outlines the implementation plan for adding The Powder Toy's advanced physics features to Sandboxels, ordered by maximum impact. The plan is designed to be executed incrementally, with each feature building on previous work and providing immediate value.

**Target Timeline**: 6-12 months
**Features to Implement**: 5 critical + 7 high-priority features
**Approach**: Iterative implementation with validation at each step

---

## Implementation Order (By Impact)

Based on the analysis in POWDER-TOY-COMPARISON.md, features are ordered by:
1. Impact on simulation quality
2. Foundation for other features
3. Implementation complexity vs. benefit ratio
4. Dependencies between features

---

## Phase 1: Foundation Features (Weeks 1-8)

### Feature 1: Material Memory System (ctype) ⭐⭐⭐⭐
**Priority**: FIRST - Foundation for other features
**Effort**: 1-2 weeks
**Impact**: HIGH - Enables complex behaviors

#### Why First?
- Required by many other features (lava solidification, cloning, filtering)
- Minimal dependencies - can be implemented independently
- Quick win that enables immediate improvements
- Demonstrates visible results

#### Implementation Steps:

**Week 1: Core System**
1. Add `ctype` property to pixel structure
2. Add `tmp`, `tmp2`, `tmp3`, `tmp4` properties for versatile storage
3. Update pixel creation to initialize new properties
4. Test property persistence in saves/loads

**Week 2: Element Updates**
5. Update `lava` element to remember original material
6. Update melting logic to set ctype when creating lava
7. Update solidification logic to restore from ctype
8. Add visual indicator (optional) to show lava's source material

#### Success Criteria:
- [ ] Pixels have ctype and tmp1-4 properties
- [ ] Lava remembers what it melted from
- [ ] Lava solidifies back to original material
- [ ] Properties persist in save/load
- [ ] No performance regression

#### Code Changes:
```javascript
// In pixel creation
function createPixel(element, x, y) {
    pixel = {
        element: element,
        x: x,
        y: y,
        // ... existing properties ...
        ctype: null,      // Material memory
        tmp: 0,           // Multipurpose storage 1
        tmp2: 0,          // Multipurpose storage 2
        tmp3: 0,          // Multipurpose storage 3
        tmp4: 0,          // Multipurpose storage 4
    };
}

// In lava element
elements.lava = {
    // ... existing properties ...
    tick: function(pixel) {
        // Cooling logic
        if (pixel.temp < (pixel.ctype ? elements[pixel.ctype].temp : 500)) {
            if (pixel.ctype && elements[pixel.ctype]) {
                changePixel(pixel, pixel.ctype);
            } else {
                changePixel(pixel, "rock");
            }
        }
    }
};

// In melting logic
function meltElement(pixel) {
    let originalType = pixel.element;
    changePixel(pixel, "lava");
    pixel.ctype = originalType;  // Remember source!
}
```

---

### Feature 2: Life/Decay System ⭐⭐⭐
**Priority**: SECOND - Standardizes timing
**Effort**: 3-5 days
**Impact**: MEDIUM - Better fire, explosives, decay

#### Why Second?
- Simple to implement
- Improves existing elements immediately
- Foundation for timed behaviors
- No major dependencies

#### Implementation Steps:

**Days 1-2: Core System**
1. Add `life` property to pixel structure
2. Add automatic life decrement in pixel update loop
3. Add `LIFE_DEC` and `LIFE_KILL` behaviors

**Days 3-5: Element Updates**
4. Update fire to use life for burn duration
5. Update explosives to use life for fuse timing
6. Update ember/glow elements to fade with life
7. Add radioactive decay using life

#### Success Criteria:
- [ ] Pixels have life property
- [ ] Life auto-decrements each tick
- [ ] LIFE_KILL removes pixel at life=0
- [ ] Fire burns for realistic duration
- [ ] Explosives have consistent fuse timing

#### Code Changes:
```javascript
// Add to behaviors
behaviors.LIFE_DEC = true;  // Flag for auto-decrement
behaviors.LIFE_KILL = true; // Flag for death at 0

// In pixel update loop
function updatePixel(pixel) {
    if (elements[pixel.element].lifeDec) {
        pixel.life--;
        if (pixel.life <= 0) {
            if (elements[pixel.element].lifeKill) {
                deletePixel(pixel);
                return;
            }
            pixel.life = 0;
        }
    }
    // ... rest of update
}

// Update fire element
elements.fire = {
    // ... existing properties ...
    lifeDec: true,
    lifeKill: true,
    onCreate: function(pixel) {
        pixel.life = Math.random() * 50 + 50; // 50-100 ticks
    }
};
```

---

### Feature 3: Enhanced Electrical System ⭐⭐⭐⭐
**Priority**: THIRD - Completes partial implementation
**Effort**: 1-2 weeks
**Impact**: HIGH - Enables circuits

#### Why Third?
- Builds on existing electrical system
- High user demand for circuits
- Foundation for logic gates and automation
- Moderate complexity

#### Implementation Steps:

**Week 1: Spark Propagation**
1. Create SPARK element (visual electrical charge)
2. Implement spark propagation through conductors
3. Add spark lifetime (using life system)
4. Add spark temperature effects

**Week 2: Electronic Components**
5. Create BATTERY element (power source)
6. Create SWITCH element (controllable conductor)
7. Create INSULATED_WIRE (conducts but doesn't spark neighbors)
8. Update existing conductors to work with new system

#### Success Criteria:
- [ ] Spark travels through conductors
- [ ] Battery provides continuous power
- [ ] Switch can break/make connections
- [ ] Insulated wire doesn't spark adjacent pixels
- [ ] Can build simple circuits

#### Code Changes:
```javascript
// New SPARK element
elements.spark = {
    color: "#FFFF00",
    behavior: behaviors.STOPPABLE,
    tick: function(pixel) {
        // Propagate to adjacent conductors
        for (let dir of adjacentCoords(pixel.x, pixel.y)) {
            let neighbor = pixelMap[dir.x]?.[dir.y];
            if (neighbor && elements[neighbor.element].conduct) {
                if (!neighbor.spark) {
                    createPixel("spark", dir.x, dir.y);
                }
            }
        }
    },
    lifeDec: true,
    lifeKill: true,
    onCreate: function(pixel) {
        pixel.life = 2; // Very short-lived
    }
};

// Enhanced conductor property
elements.copper = {
    // ... existing properties ...
    conduct: true,
    sparkable: true,  // Can receive spark
    onSpark: function(pixel) {
        // Heat up when sparked
        pixel.temp += 10;
    }
};
```

---

## Phase 2: Advanced Physics (Weeks 9-16)

### Feature 4: Air Pressure & Velocity System ⭐⭐⭐⭐⭐
**Priority**: FOURTH - Highest physics impact
**Effort**: 3-4 weeks
**Impact**: MASSIVE - Transforms simulation

#### Why Fourth?
- Requires solid foundation (phases 1-3 complete)
- Complex but highest impact on realism
- Enables realistic explosions and fluid dynamics
- Performance-critical - needs optimization

#### Implementation Steps:

**Week 1: Grid Infrastructure**
1. Create air pressure/velocity grid (4x4 pixel cells)
2. Implement grid update algorithm (pressure gradient → velocity)
3. Add divergence calculation (velocity → pressure change)
4. Add dissipation to prevent runaway values

**Week 2: Particle Integration**
5. Add `airDrag` property to elements
6. Make air velocity affect particle movement
7. Make particle movement affect air (Newton's 3rd law)
8. Test with simple particle movements

**Week 3: Explosion Integration**
9. Update bomb/explosive elements to inject pressure
10. Implement pressure wave propagation
11. Add visual pressure indicator (optional view mode)
12. Test explosion shockwaves

**Week 4: Optimization & Polish**
13. Optimize grid calculations (typed arrays)
14. Add performance toggle for air simulation
15. Fine-tune constants for realistic behavior
16. Comprehensive testing

#### Success Criteria:
- [ ] Air grid simulates pressure and velocity
- [ ] Explosions create visible shockwaves
- [ ] Particles affected by air currents
- [ ] Gases disperse realistically
- [ ] Performance remains acceptable (>30 FPS)

#### Code Changes:
```javascript
// Air grid system
const CELL_SIZE = 4;
const AIR_CELLS_X = Math.ceil(width / CELL_SIZE);
const AIR_CELLS_Y = Math.ceil(height / CELL_SIZE);

const airState = {
    vx: new Float32Array(AIR_CELLS_X * AIR_CELLS_Y),
    vy: new Float32Array(AIR_CELLS_X * AIR_CELLS_Y),
    pv: new Float32Array(AIR_CELLS_X * AIR_CELLS_Y),
};

function updateAir() {
    // 1. Pressure gradient affects velocity
    for (let y = 1; y < AIR_CELLS_Y - 1; y++) {
        for (let x = 1; x < AIR_CELLS_X - 1; x++) {
            const idx = y * AIR_CELLS_X + x;
            const dx = (pv[idx+1] - pv[idx-1]) * 0.5;
            const dy = (pv[idx+AIR_CELLS_X] - pv[idx-AIR_CELLS_X]) * 0.5;
            vx[idx] -= dx * 0.5;
            vy[idx] -= dy * 0.5;
        }
    }
    
    // 2. Velocity divergence affects pressure
    for (let y = 1; y < AIR_CELLS_Y - 1; y++) {
        for (let x = 1; x < AIR_CELLS_X - 1; x++) {
            const idx = y * AIR_CELLS_X + x;
            const dvx = (vx[idx+1] - vx[idx-1]) * 0.5;
            const dvy = (vy[idx+AIR_CELLS_X] - vy[idx-AIR_CELLS_X]) * 0.5;
            pv[idx] -= (dvx + dvy) * 0.5;
        }
    }
    
    // 3. Dissipation
    for (let i = 0; i < vx.length; i++) {
        vx[i] *= 0.98;
        vy[i] *= 0.98;
        pv[i] *= 0.95;
    }
}

// Explosion pressure injection
function explode(x, y, radius, pressure) {
    const cellX = Math.floor(x / CELL_SIZE);
    const cellY = Math.floor(y / CELL_SIZE);
    
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist <= radius && dist > 0) {
                const idx = (cellY + dy) * AIR_CELLS_X + (cellX + dx);
                if (idx >= 0 && idx < pv.length) {
                    airState.pv[idx] += pressure * (1 - dist / radius);
                }
            }
        }
    }
}
```

---

### Feature 5: Pressure-Based State Transitions ⭐⭐⭐⭐
**Priority**: FIFTH - Complements air system
**Effort**: 1 week
**Impact**: MEDIUM-HIGH - Realistic materials

#### Why Fifth?
- Natural extension of air pressure system
- Enables realistic material science
- Relatively simple to implement
- Builds on existing temperature transitions

#### Implementation Steps:

**Week 1: Implementation**
1. Add pressure tracking per pixel (from air grid)
2. Add `pressureLow`, `pressureHigh` properties to elements
3. Add `statePressureLow`, `statePressureHigh` transitions
4. Update element definitions with pressure thresholds
5. Test pressure-dependent transitions

#### Success Criteria:
- [ ] Elements can transition based on pressure
- [ ] CO2 sublimates under low pressure
- [ ] Water boils at lower temp under low pressure
- [ ] Materials compress under high pressure

#### Code Changes:
```javascript
// Add to element properties
elements.water = {
    // ... existing properties ...
    pressureLow: 0.1,
    statePressureLow: "ice",  // Freeze under vacuum
    pressureHigh: 10,
    statePressureHigh: "ice_vii",  // High-pressure ice
};

// In pixel update
function checkPressureTransitions(pixel) {
    const cellIdx = getCellIndex(pixel.x, pixel.y);
    const pressure = airState.pv[cellIdx];
    
    const elem = elements[pixel.element];
    
    if (elem.pressureLow && pressure < elem.pressureLow && elem.statePressureLow) {
        changePixel(pixel, elem.statePressureLow);
    } else if (elem.pressureHigh && pressure > elem.pressureHigh && elem.statePressureHigh) {
        changePixel(pixel, elem.statePressureHigh);
    }
}
```

---

### Feature 6: Collision & Momentum System ⭐⭐⭐⭐
**Priority**: SIXTH - Better physics
**Effort**: 1-2 weeks
**Impact**: MEDIUM-HIGH - Realistic motion

#### Implementation Steps:

**Week 1: Core Physics**
1. Add `collision` property (energy retention 0-1)
2. Add `loss` property (velocity decay per frame)
3. Implement collision detection between moving pixels
4. Implement momentum transfer

**Week 2: Advanced Features**
5. Add velocity-based reactions (erosion, impact)
6. Add bouncing particles
7. Add ricochet effects
8. Optimize collision detection

#### Success Criteria:
- [ ] Moving particles collide realistically
- [ ] Momentum conserved in collisions
- [ ] Particles can bounce
- [ ] Fast-moving water erodes rock
- [ ] Projectiles behave correctly

---

## Phase 3: Advanced Features (Weeks 17-24)

### Feature 7: Newtonian Gravity ⭐⭐⭐⭐⭐
**Priority**: SEVENTH - Astrophysics
**Effort**: 2-3 weeks
**Impact**: HIGH - New simulation category

#### Implementation Steps:

**Week 1: Grid System**
1. Create gravity field grid (similar to air)
2. Implement mass calculation per cell
3. Calculate gravitational forces between cells
4. Optimize with limited range or FFT approximation

**Week 2: Integration**
5. Add `newtonianGravity` property to elements
6. Apply gravity field forces to particles
7. Test with simple orbital scenarios
8. Add toggle for Newtonian gravity mode

**Week 3: Elements & Polish**
9. Create black hole element
10. Create gravity well element
11. Add visualization (gravity field view)
12. Performance optimization

#### Success Criteria:
- [ ] Particles attract each other by mass
- [ ] Can create stable orbits
- [ ] Black holes work correctly
- [ ] Optional toggle for performance

---

### Feature 8: Photon Physics ⭐⭐⭐⭐
**Priority**: EIGHTH - Optics education
**Effort**: 2-3 weeks
**Impact**: HIGH - New physics category

#### Implementation Steps:

**Week 1: Photon Element**
1. Create PHOTON element (fast-moving particle)
2. Implement high-speed movement (multiple pixels/tick)
3. Add wavelength property (stored in ctype)
4. Add lifetime (using life system)

**Week 2: Interactions**
5. Implement reflection off surfaces
6. Implement refraction through glass
7. Add wavelength-based color
8. Add absorption by materials

**Week 3: Advanced Features**
9. Create FILTER element (wavelength filtering)
10. Create MIRROR element
11. Create PRISM element
12. Add dispersion (different wavelengths refract differently)

#### Success Criteria:
- [ ] Photons travel at high speed
- [ ] Light reflects off mirrors
- [ ] Light refracts through glass
- [ ] Prisms split white light into spectrum
- [ ] Filters select wavelengths

---

### Feature 9: Wall Layer System ⭐⭐⭐⭐
**Priority**: NINTH - Building blocks
**Effort**: 2-3 weeks
**Impact**: MEDIUM - Better construction

#### Implementation Steps:

**Week 1: Infrastructure**
1. Create separate wall layer (doesn't occupy pixel space)
2. Implement wall rendering (semi-transparent overlay)
3. Add wall placement tool
4. Add wall types (basic, conductive, one-way)

**Week 2: Physics Integration**
5. Make walls block particle movement
6. Make walls block/allow air flow
7. Make walls conduct electricity
8. Add one-way wall physics

**Week 3: Advanced Walls**
9. Add erase wall (deletes particles)
10. Add detector wall (triggers on contact)
11. Add gravity wall
12. Add fan wall (creates air flow)

#### Success Criteria:
- [ ] Walls don't occupy pixel space
- [ ] Can see through walls
- [ ] Different wall types work correctly
- [ ] Can build pressure chambers
- [ ] Can control particle flow

---

### Feature 10: Advanced Electronic Components ⭐⭐⭐
**Priority**: TENTH - Complete electronics
**Effort**: 1-2 weeks
**Impact**: MEDIUM - Logic gates

#### Implementation Steps:

**Week 1: Components**
1. Create NSCN/PSCN (semiconductors)
2. Create NTCT/PTCT (transistors)
3. Implement transistor logic
4. Test AND/OR gates

**Week 2: Advanced**
5. Create WIFI (wireless transmission)
6. Create logic gate helper elements
7. Add example circuits to documentation
8. Tutorial for circuit building

#### Success Criteria:
- [ ] Transistors work correctly
- [ ] Can build AND, OR, NOT gates
- [ ] Can build half-adder
- [ ] WIFI transmits signals

---

### Feature 11: Clone/Copy Systems ⭐⭐⭐
**Priority**: ELEVENTH - Factories
**Effort**: 1 week
**Impact**: MEDIUM - Automation

#### Implementation Steps:

**Days 1-3: Clone Element**
1. Create CLONE element
2. Use ctype to store element to clone
3. Implement cloning logic
4. Add powered clone variant

**Days 4-7: Advanced**
5. Create CONVERTER element (changes element type)
6. Create BREAKER element (destroys and clones)
7. Add particle production rate control
8. Test factory scenarios

#### Success Criteria:
- [ ] Clone creates copies of stored element
- [ ] Converter changes elements
- [ ] Can build factories
- [ ] Production rate controllable

---

### Feature 12: Sensor Elements ⭐⭐⭐
**Priority**: TWELFTH - Automation
**Effort**: 1 week
**Impact**: MEDIUM - Smart systems

#### Implementation Steps:

**Days 1-4: Basic Sensors**
1. Create TEMP_SENSOR (detects temperature)
2. Create PRESSURE_SENSOR (detects pressure)
3. Create DETECTOR (detects specific elements)
4. Implement sensor output (electrical signal)

**Days 5-7: Advanced**
5. Create VELOCITY_SENSOR
6. Create LIFE_SENSOR
7. Add sensor sensitivity control
8. Test automated systems

#### Success Criteria:
- [ ] Sensors detect conditions correctly
- [ ] Sensors output electrical signals
- [ ] Can build feedback loops
- [ ] Can build automated systems

---

## Implementation Tracking

### Progress Checklist

#### Phase 1: Foundation (Weeks 1-8)
- [ ] Feature 1: Material Memory (ctype) - WEEKS 1-2
  - [ ] Core system implemented
  - [ ] Lava uses ctype
  - [ ] Tests passing
  - [ ] Documented
  
- [ ] Feature 2: Life/Decay System - WEEK 3
  - [ ] Core system implemented
  - [ ] Fire uses life
  - [ ] Explosives use life
  - [ ] Tests passing
  
- [ ] Feature 3: Enhanced Electrical - WEEKS 4-5
  - [ ] Spark element created
  - [ ] Battery element created
  - [ ] Switch element created
  - [ ] Simple circuits work

#### Phase 2: Advanced Physics (Weeks 9-16)
- [ ] Feature 4: Air Pressure - WEEKS 6-9
  - [ ] Grid infrastructure complete
  - [ ] Particle integration working
  - [ ] Explosions create shockwaves
  - [ ] Performance acceptable
  
- [ ] Feature 5: Pressure Transitions - WEEK 10
  - [ ] Pressure tracking working
  - [ ] State transitions implemented
  - [ ] Elements updated
  
- [ ] Feature 6: Collision/Momentum - WEEKS 11-12
  - [ ] Collision detection working
  - [ ] Momentum transfer correct
  - [ ] Bouncing implemented

#### Phase 3: Advanced Features (Weeks 17-24)
- [ ] Feature 7: Newtonian Gravity - WEEKS 13-15
  - [ ] Gravity field working
  - [ ] Particles attract
  - [ ] Orbits possible
  
- [ ] Feature 8: Photon Physics - WEEKS 16-18
  - [ ] Photon element created
  - [ ] Reflection working
  - [ ] Refraction working
  
- [ ] Feature 9: Wall Layer - WEEKS 19-21
  - [ ] Wall layer infrastructure
  - [ ] Basic walls working
  - [ ] Advanced wall types
  
- [ ] Feature 10: Electronic Components - WEEKS 22-23
  - [ ] Semiconductors working
  - [ ] Transistors functional
  - [ ] Logic gates buildable
  
- [ ] Feature 11: Clone Systems - WEEK 24
  - [ ] Clone element working
  - [ ] Converter working
  
- [ ] Feature 12: Sensor Elements - WEEK 25
  - [ ] Basic sensors working
  - [ ] Advanced sensors complete

---

## Testing Strategy

### For Each Feature:

1. **Unit Tests**
   - Test individual properties
   - Test element behaviors
   - Test edge cases

2. **Integration Tests**
   - Test interaction with existing features
   - Test performance impact
   - Test save/load compatibility

3. **Visual Validation**
   - Create demo scenarios
   - Verify visual correctness
   - Check for artifacts

4. **Performance Tests**
   - Measure FPS impact
   - Test with many particles
   - Optimize if needed

---

## Risk Mitigation

### Performance Risks
- **Mitigation**: Optional toggles for expensive features
- **Monitoring**: FPS tracking during development
- **Optimization**: Use typed arrays, limit calculations

### Compatibility Risks
- **Mitigation**: Versioned save format
- **Testing**: Load old saves after each change
- **Fallbacks**: Graceful handling of missing properties

### Complexity Risks
- **Mitigation**: Incremental implementation
- **Documentation**: Detailed code comments
- **Review**: Code review at each milestone

---

## Success Metrics

### Technical Metrics
- [ ] All features implemented and tested
- [ ] Performance: >30 FPS with 10,000 active pixels
- [ ] No crashes or critical bugs
- [ ] Backward compatible save loading

### Quality Metrics
- [ ] Code coverage >80%
- [ ] Documentation complete
- [ ] Examples provided for each feature
- [ ] User feedback positive

### Impact Metrics
- [ ] Simulation realism significantly improved
- [ ] Educational value increased
- [ ] User engagement with new features
- [ ] Community creates advanced simulations

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Set up development environment** with TPT source for reference
3. **Begin Feature 1 (Material Memory)** - Foundation for everything
4. **Create feature branch** for each implementation
5. **Document progress** in this file

---

## Resources

### Reference Code
- The Powder Toy source: /tmp/The-Powder-Toy/
- Element examples: src/simulation/elements/
- Physics code: src/simulation/Air.cpp, Simulation.cpp

### Documentation
- POWDER-TOY-COMPARISON.md - Detailed analysis
- PHYSICS-IMPROVEMENTS.md - Physics background
- BEST-PRACTICES.md - Code standards

### Tools
- Performance profiler for JavaScript
- Browser dev tools for debugging
- Git for version control

---

**Last Updated**: November 2024
**Status**: Ready to begin implementation
**Current Phase**: Planning Complete → Feature 1 Ready
