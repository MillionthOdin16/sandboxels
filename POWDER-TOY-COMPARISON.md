# The Powder Toy vs Sandboxels - Comprehensive Simulation Fidelity Comparison

## Executive Summary

This document provides a thorough analysis of The Powder Toy's simulation features compared to Sandboxels, identifying key capabilities that would significantly improve Sandboxels' simulation fidelity and realism. The analysis focuses on physics accuracy, simulation depth, and features that enable more realistic behaviors.

**Date**: November 2024  
**Repositories Analyzed**:
- The Powder Toy: https://github.com/MillionthOdin16/The-Powder-Toy
- Sandboxels: https://github.com/MillionthOdin16/sandboxels

---

## Table of Contents

1. [Architecture Comparison](#architecture-comparison)
2. [Critical Physics Features Missing in Sandboxels](#critical-physics-features)
3. [Simulation Quality Improvements](#simulation-quality-improvements)
4. [Material Properties and Behaviors](#material-properties)
5. [Advanced Simulation Features](#advanced-features)
6. [Recommended Implementation Priority](#implementation-priority)

---

## 1. Architecture Comparison {#architecture-comparison}

### The Powder Toy Architecture
- **Language**: C++ (compiled, native performance)
- **Element Count**: 194+ unique elements
- **Physics Engine**: Dedicated C++ simulation classes
- **Particle System**: Structured particle data with optimized memory layout
- **Rendering**: Separate rendering pipeline with hardware acceleration support

### Sandboxels Architecture
- **Language**: JavaScript (interpreted, web-based)
- **Element Count**: 500+ elements (many are variations/combinations)
- **Physics Engine**: JavaScript-based pixel manipulation
- **Particle System**: JSON-based pixel objects
- **Rendering**: Canvas 2D rendering

### Performance Implications
The Powder Toy's C++ implementation allows for:
- 10-100x faster physics calculations
- More complex per-particle computations
- Larger simulation spaces (612x384 vs Sandboxels' typical smaller canvas)
- More sophisticated multi-step physics pipelines

---

## 2. Critical Physics Features Missing in Sandboxels {#critical-physics-features}

### 2.1 Air Pressure and Velocity Simulation ⭐⭐⭐⭐⭐

**Impact**: CRITICAL - This is the most significant difference

**The Powder Toy Implementation**:
```cpp
// From Air.h
float ovx[YCELLS][XCELLS];  // Velocity X
float ovy[YCELLS][XCELLS];  // Velocity Y
float opv[YCELLS][XCELLS];  // Pressure
float ohv[YCELLS][XCELLS];  // Ambient Heat
```

**Features**:
- Full 2D pressure and velocity field simulation
- Vorticity calculations for realistic fluid dynamics
- Air drag affects particle movement
- Explosions create pressure waves that propagate
- Pressure affects particle behavior and state transitions
- Wind and air currents influence movement

**Current Sandboxels Status**: ❌ **NOT IMPLEMENTED**
- No pressure simulation
- No velocity field
- Gases rise only due to density/weight, not buoyancy physics
- Explosions don't create shockwaves

**Why This Matters**:
- Realistic explosions with shockwave propagation
- Proper fluid dynamics and turbulence
- Sound wave simulation
- Pneumatic systems
- Weather simulation (wind, pressure systems)
- Smoke and gas dispersion patterns

**Implementation Impact**:
- Would require creating a grid-based velocity/pressure field overlay
- Would need to integrate with existing particle movement
- Moderate computational cost but massive realism improvement

---

### 2.2 Newtonian Gravity System ⭐⭐⭐⭐⭐

**Impact**: CRITICAL - Enables orbital mechanics and realistic gravity

**The Powder Toy Implementation**:
```cpp
// From Element.h
float NewtonianGravity;

// From gravity/Gravity.h
class Gravity {
    void Exchange(GravityOutput &gravOut, GravityInput &gravIn, bool forceRecalc);
};
```

**Features**:
- Particles attract each other based on mass
- FFT-based gravity field calculation for performance
- Enables orbital mechanics
- Black hole simulation
- Gravitational lensing effects
- N-body physics

**Current Sandboxels Status**: ❌ **NOT IMPLEMENTED**
- Only has uniform downward gravity
- No particle-to-particle gravitational attraction
- No orbital mechanics possible

**Why This Matters**:
- Astronomical simulations (planets, stars, black holes)
- Orbital mechanics demonstrations
- Educational value for physics learning
- Gravitational collapse simulations
- More realistic space-themed elements

**Implementation Impact**:
- Requires gravity field calculation (computationally expensive)
- Could use simplified grid-based approximation
- Would enable entirely new categories of simulations

---

### 2.3 Advanced Electrical Conductivity System ⭐⭐⭐⭐

**Impact**: HIGH - Enables complex circuits and electronics

**The Powder Toy Features**:
- `PROP_CONDUCTS` - Binary conductivity flag
- Spark propagation (SPRK element)
- Electrical charge stored in `life` property
- Insulated wires (INWR)
- Transistor-like elements (NTCT, PTCT)
- Logic gates capabilities
- Electrical current flow simulation

**Key Elements**:
- SPRK: Electrical spark that travels through conductors
- INWR: Insulated wire (conducts but doesn't spark neighbors)
- NSCN/PSCN: N-type/P-type semiconductors
- SWCH: Electronic switch
- BTRY: Battery (infinite power source)
- WIFI: Wireless signal transmission

**Current Sandboxels Status**: ⚠️ **PARTIALLY IMPLEMENTED**
- Has `charge` property
- Has `conductivity` property
- Has some conducting elements
- Missing: Sophisticated spark propagation
- Missing: Insulated conductors
- Missing: Semiconductor behavior
- Missing: Logic gate building blocks

**Why This Matters**:
- Build functional computers in-simulation
- Complex circuitry and logic
- Educational demonstrations of electronics
- Signal processing simulations
- Automation and control systems

**Implementation Impact**:
- Moderate - enhance existing electrical system
- Add spark element with proper propagation
- Add insulator/conductor distinction
- Add semiconductor elements

---

### 2.4 Photon and Light Physics ⭐⭐⭐⭐

**Impact**: HIGH - Enables optics and realistic light

**The Powder Toy Implementation**:
```cpp
// From PHOT.cpp
unsigned int PhotonReflectWavelengths;  // Per-element property
DefaultProperties.ctype = 0x3FFFFFFF;    // Wavelength stored in ctype
```

**Features**:
- PHOT (Photon) element travels at high speed
- Wavelength-based color system (30-bit wavelength spectrum)
- Reflection based on material properties
- Refraction through glass (GLAS)
- Wavelength filtering (FILT element)
- Light absorption and emission
- Realistic optical phenomena

**Advanced Behaviors**:
- Photons refract at material boundaries
- Different wavelengths refract differently (dispersion)
- Mirrors reflect photons
- Glass refracts and slows photons
- Filters select specific wavelengths
- Lasers and light sources

**Current Sandboxels Status**: ❌ **NOT IMPLEMENTED**
- No photon element
- No wavelength-based light system
- Light behavior is visual only, not physical

**Why This Matters**:
- Optics demonstrations (prisms, lenses, fiber optics)
- Laser systems
- Color mixing and spectroscopy education
- Realistic light scattering
- Solar energy simulations
- Optical circuits and computing

**Implementation Impact**:
- High complexity - requires fast-moving particle system
- Wavelength color model different from RGB
- Ray tracing or particle-based light
- Could start with simplified particle-based approach

---

### 2.5 Precise State Transition System ⭐⭐⭐⭐

**Impact**: HIGH - More realistic material behavior

**The Powder Toy Implementation**:
```cpp
// From Element.h
float LowPressure;
int LowPressureTransition;    // Element to become at low pressure
float HighPressure;
int HighPressureTransition;   // Element to become at high pressure
float LowTemperature;
int LowTemperatureTransition; // Element to become when cold
float HighTemperature;
int HighTemperatureTransition; // Element to become when hot
```

**Features**:
- Separate transitions for pressure AND temperature
- Precise transition thresholds
- Bi-directional transitions (freeze/melt, compress/decompress)
- Special transition value ST (solidifies to ctype)
- Pressure-dependent phase changes

**Examples**:
- Water: Freezes at 273.15K → ICE, Boils at 373.15K → WTRV (steam)
- CO2: Sublimates under low pressure
- Materials change under high pressure (diamond formation)
- Lava solidifies to original material (stored in ctype)

**Current Sandboxels Status**: ⚠️ **PARTIALLY IMPLEMENTED**
- Has `tempHigh`/`tempLow` with `stateHigh`/`stateLow`
- Missing: Pressure-based transitions
- Missing: Precise Kelvin-based temperatures
- Missing: Bi-directional material memory (ctype system)

**Why This Matters**:
- Realistic material science demonstrations
- Pressure cooking simulation
- Volcanic/geological processes
- Material processing (metalworking, glassblowing)
- Phase diagrams and thermodynamics education

**Implementation Impact**:
- Medium - extend existing temperature system
- Add pressure tracking per pixel
- Add pressure threshold properties
- Implement pressure calculations

---

### 2.6 Particle Property System ⭐⭐⭐⭐

**Impact**: HIGH - Enables complex element behaviors

**The Powder Toy Particle Structure**:
```cpp
struct Particle {
    int type;           // Element type
    int life, ctype;    // Lifetime and color/subtype
    float x, y;         // Position (sub-pixel precision)
    float vx, vy;       // Velocity (continuous values)
    float temp;         // Temperature in Kelvin
    int tmp, tmp2, tmp3, tmp4;  // Multipurpose storage
    int flags;          // Status flags
    unsigned int dcolour; // Display color override
};
```

**Key Features**:
- **Sub-pixel positioning**: Smooth movement, not grid-locked
- **Continuous velocity**: Realistic physics, not discrete steps
- **Multiple tmp variables**: Store complex state
- **ctype (color type)**: Material memory system
  - Molten materials remember what they were
  - Filters remember wavelengths
  - Clones remember what to produce
- **life**: Multi-purpose timer/counter
- **flags**: Particle state bits

**Current Sandboxels Status**: ⚠️ **PARTIALLY IMPLEMENTED**
- Has position, element, temp, color
- Has some custom properties
- Missing: Sub-pixel precision
- Missing: Continuous velocity (has vx, vy but limited use)
- Missing: Standardized tmp1-4 system
- Missing: ctype material memory system

**Why This Matters**:
- **Material Memory**: Lava remembers what it was and solidifies back
- **Complex Behaviors**: Elements can have sophisticated state machines
- **Smooth Motion**: Sub-pixel movement looks more realistic
- **Element Versatility**: Same element type can behave differently based on tmp values
- **Better Physics**: Continuous velocity enables accurate collision and momentum

**Implementation Examples from TPT**:
- LAVA stores original material in ctype, solidifies back when cooled
- FILT stores wavelength in ctype
- CLNE stores element to clone in ctype
- DLAY stores delay time in tmp
- WIFI stores channel in tmp

**Implementation Impact**:
- Medium - extend pixel object structure
- Add standard tmp1-4 properties
- Add ctype system
- Refactor movement for sub-pixel positioning

---

### 2.7 Advanced Heat Transfer ⭐⭐⭐

**Impact**: MEDIUM - Improves thermal realism

**The Powder Toy Implementation**:
```cpp
// From Element.h
unsigned char HeatConduct;    // Thermal conductivity (0-255)
float HeatCapacity;           // Volumetric heat capacity (default 1.0)
```

**Features**:
- Per-element heat conductivity
- Volumetric heat capacity (added in recent versions)
- Harmonic mean for interface conductivity
- Ambient heat (ohv field) - heat in air
- Thermal radiation at high temperatures
- Conduction through solids vs convection in fluids

**Heat Transfer Algorithm**:
```cpp
// Simplified from TPT source
for each neighbor:
    conductivity = harmonic_mean(element1.HeatConduct, element2.HeatConduct)
    energy_transfer = (temp1 - temp2) * conductivity
    temp_change1 = energy_transfer / element1.HeatCapacity
    temp_change2 = -energy_transfer / element2.HeatCapacity
```

**Current Sandboxels Status**: ✅ **IMPLEMENTED** (as of recent improvements)
- Has `heatCapacity` property
- Has `conduct` (conductivity) property
- Has improved `doHeat()` and `enhancedHeatTransfer()` functions
- Has proper energy conservation

**Sandboxels Recent Improvements** (from FIDELITY-IMPROVEMENTS.md):
- ✅ Heat capacity values added to 30+ elements
- ✅ Conductivity values for insulators
- ✅ Energy-conserving heat transfer
- ✅ Respects material properties

**Remaining Gaps**:
- No ambient heat field (heat in air)
- No radiation calculation at very high temps
- Could improve conductivity calculation (harmonic mean)

**Why This Matters**:
- Already significantly improved in Sandboxels!
- Remaining features would add:
  - Heat radiation from very hot objects
  - Heat transfer through air/vacuum
  - More accurate metal-to-metal heat transfer

**Implementation Impact**:
- LOW - Most features already present
- Could add Stefan-Boltzmann radiation
- Could add ambient heat field
- Could refine conductivity calculations

---

## 3. Simulation Quality Improvements {#simulation-quality-improvements}

### 3.1 Particle Update Order System ⭐⭐⭐

**The Powder Toy Approach**:
- Maintains particle array with indices
- Updates particles in semi-random order to avoid artifacts
- "Flatten" operation periodically reorganizes array
- Particles can be efficiently iterated

**Current Sandboxels Approach**:
- Grid-based iteration (row by row, column by column)
- Can create directional bias in simulations
- All pixels updated every frame

**Why This Matters**:
- Eliminates directional artifacts
- More fair simulation (no "first mover advantage")
- Better performance (skip empty cells)
- More realistic chaotic behavior

**Implementation Impact**:
- MEDIUM - Requires restructuring update loop
- Create particle index array
- Shuffle or semi-randomize order
- Skip empty pixels

---

### 3.2 Element Property Ranges ⭐⭐⭐

**The Powder Toy Standards**:
```cpp
Weight: -100 to 100
    Negative = lighter than air (rises)
    Positive = heavier than air (falls)
    100 = very heavy (dense)

Gravity: 0.0 to 1.0+
    0.0 = no gravity effect
    0.1 = typical liquid
    0.15 = heavy liquid
    
AirDrag: 0.0 to 1.0
    How much air resistance affects movement
    
Loss: 0.0 to 1.0
    Velocity retention (1.0 = no loss, 0.9 = 10% loss)
```

**Current Sandboxels**:
- Uses density (0-100+) but not weight
- No standardized property ranges
- Properties mixed (density, weight used inconsistently)

**Why This Matters**:
- Clear, predictable element behaviors
- Easier to create realistic materials
- Better documentation and consistency
- Lighter-than-air elements (helium, hot gases)

**Implementation Impact**:
- LOW - Refactor property names and ranges
- Update all elements to new standard
- Add weight property (-100 to 100)

---

### 3.3 Collision and Momentum ⭐⭐⭐⭐

**The Powder Toy Implementation**:
```cpp
float Collision;  // Energy retained in collisions (0-1)
float Loss;       // Velocity retention per frame
float vx, vy;     // Particle velocity
```

**Features**:
- Particles have continuous velocity
- Momentum conservation in collisions
- Elastic vs inelastic collisions
- Particles can bounce
- Kinetic energy calculations
- Velocity-based interactions (water erosion of rock)

**Example from WATR.cpp**:
```cpp
// Rock erosion by water
if (TYP(r)==PT_ROCK && 
    fabs(parts[i].vx)+fabs(parts[i].vy) >= 0.5 && 
    sim->rng.chance(1, 1000))
{
    // Erode rock to sand/stone
}
```

**Current Sandboxels Status**: ⚠️ **BASIC IMPLEMENTATION**
- Has vx, vy properties
- Advanced physics option enables movement
- Missing: Collision detection and response
- Missing: Momentum conservation
- Missing: Velocity-based reactions
- Missing: Bouncing and ricocheting

**Why This Matters**:
- Projectile physics
- Impact-based reactions (meteorites, bullets)
- Bouncing particles (rubber, pellets)
- Erosion by flowing liquids
- Kinetic weapons and impacts
- More realistic fluid flow

**Implementation Impact**:
- MEDIUM-HIGH - Enhance physics engine
- Add collision detection between particles
- Implement momentum transfer
- Add velocity-based reaction triggers

---

### 3.4 Life and Decay System ⭐⭐⭐

**The Powder Toy Implementation**:
```cpp
int life;  // Multipurpose counter/timer
Properties = PROP_LIFE_DEC;       // Decrements each frame
Properties = PROP_LIFE_KILL_DEC;  // Dies when life reaches 0
```

**Uses**:
- FIRE: Burns for `life` frames
- BOMB: Explodes when life = 0
- FUSE: Propagates when life > 0
- EMBR: Glowing ember that fades
- Animation timing
- Delayed reactions
- Element decay

**Current Sandboxels Status**: ⚠️ **PARTIALLY IMPLEMENTED**
- Some elements use custom timers
- No standardized life system
- No automatic life decrement
- No PROP_LIFE_DEC equivalent

**Why This Matters**:
- Standardized timing mechanism
- Burning and decay
- Timed explosives
- Fuses and delays
- Radioactive decay
- Animation frames

**Implementation Impact**:
- LOW-MEDIUM - Add life property and auto-decrement
- Add LIFE_DEC and LIFE_KILL behaviors
- Update elements to use life system

---

### 3.5 Advanced Reactions and Interactions ⭐⭐⭐⭐

**The Powder Toy Capabilities**:

**Per-Frame Update Functions**:
```cpp
int (*Update) (UPDATE_FUNC_ARGS);
```
- Every element can have custom update code
- Runs every simulation tick
- Full access to simulation state
- Can check neighbors, create particles, etc.

**Complex Interaction Examples**:

1. **DEUT (Deuterium Oxide)**:
   - Absorbs neutrons, heats up
   - Releases more neutrons when hot
   - Can create fusion reactions
   - Chain reaction potential

2. **PIPE System**:
   - Pipes transport particles
   - Complex routing logic
   - Pressure in pipes
   - Junctions and intersections

3. **STKM (Stickman)**:
   - Player-controlled character
   - Collision detection
   - Can jump, walk
   - Dies from damage
   - Interacts with elements

4. **GOL (Game of Life)**:
   - Conway's Game of Life
   - Multiple GOL rule sets
   - Particle-based cellular automata

**Current Sandboxels Status**: ⚠️ **DIFFERENT APPROACH**
- Uses `reactions` object for element interactions
- Has `tick` functions for some elements
- Has behaviors for movement
- Missing: Per-element update functions run every frame
- Missing: Complex multi-step interactions
- Simpler but less flexible system

**Why This Matters**:
- More sophisticated element behaviors
- Multi-step reactions
- Conditional interactions
- Complex machinery
- Realistic chemistry

**Implementation Impact**:
- HIGH - Major architectural change
- Would need per-element update callbacks
- Performance considerations
- Could add alongside existing reaction system

---

## 4. Material Properties and Behaviors {#material-properties}

### 4.1 Property Completeness

**The Powder Toy - Standard Properties**:
- ✅ Temperature (Kelvin scale)
- ✅ Heat Conductivity
- ✅ Heat Capacity (volumetric)
- ✅ Pressure thresholds
- ✅ Weight (-100 to 100)
- ✅ Gravity (0-1+)
- ✅ Air drag
- ✅ Loss (velocity retention)
- ✅ Collision (energy retention)
- ✅ Diffusion
- ✅ Flammability
- ✅ Hardness
- ✅ Photon reflection wavelengths

**Sandboxels - Current Properties**:
- ✅ Temperature (Celsius)
- ✅ Heat Conductivity (conduct)
- ✅ Heat Capacity
- ⚠️ Density (not weight)
- ❌ Pressure
- ❌ Air drag
- ❌ Collision properties
- ⚠️ Viscosity (liquids only)
- ✅ Flammability (burn/burnTime)
- ✅ Hardness
- ❌ Light properties

---

### 4.2 Missing Material Categories

**The Powder Toy Has, Sandboxels Lacks**:

1. **Energy Particles** ⭐⭐⭐⭐
   - PHOT (photon/light)
   - NEUT (neutron)
   - PROT (proton) 
   - ELEC (electron)
   - GRVT (graviton)
   
   **Impact**: Enables nuclear physics, optics, particle physics simulations

2. **Advanced Electronics** ⭐⭐⭐⭐
   - INWR (insulated wire)
   - NSCN/PSCN (semiconductors)
   - NTCT/PTCT (transistors)
   - Logic gate capable elements
   - WIFI (wireless transmitter)
   
   **Impact**: Build computers, complex circuits, automation

3. **Special Walls** ⭐⭐⭐
   - One-way walls
   - Conductive walls
   - Erase walls
   - Directional blocking
   
   **Impact**: Control simulation flow, build machines

4. **Copying/Cloning** ⭐⭐⭐
   - CLNE (clone)
   - BCLN (breaking clone)
   - PCLN (powered clone)
   - CONV (converter)
   
   **Impact**: Factories, element generation, recycling

5. **Sensors and Detectors** ⭐⭐⭐
   - DTEC (detector)
   - TSNS (temperature sensor)
   - PSNS (pressure sensor)
   - LSNS (life sensor)
   
   **Impact**: Feedback loops, automation, smart systems

6. **Ray Emitters** ⭐⭐⭐
   - ARAY (array ray)
   - DRAY (destructive ray)
   - CRAY (clone ray)
   - BRAY (bizarre ray)
   
   **Impact**: Distance effects, beam weapons, scanning

---

### 4.3 Realistic Physics Constants

**The Powder Toy Precision**:
```cpp
// Temperatures in Kelvin
R_TEMP = 22.0f + 273.15f;  // Room temp = 295.15K
Water: LowTemperature = 273.15f;   // 0°C exactly
Water: HighTemperature = 373.0f;    // 100°C exactly
```

**Accurate Constants**:
- Uses Kelvin for absolute accuracy
- Precise melting/boiling points
- Real-world thermal conductivity values
- Scientific heat capacity values

**Sandboxels Current State**:
- Uses Celsius (simpler but less scientific)
- Some approximated values
- Generally accurate but less precise
- User-friendly but less educational

**Why Precision Matters**:
- Educational accuracy
- Predictable behavior
- Real-world alignment
- Scientific demonstrations

---

## 5. Advanced Simulation Features {#advanced-features}

### 5.1 Walls and Barriers ⭐⭐⭐⭐

**The Powder Toy Wall System**:

**Wall Types**:
- Basic wall (indestructible)
- E-Wall (conductible)
- Detector wall (triggers)
- Stream wall (allows flow)
- Fan wall (creates air flow)
- Gravity wall
- One-way walls (4 directions)
- Erase wall (deletes particles)

**Properties**:
- Walls don't take pixel space
- Layer separate from particles
- Transparent to view through
- Can be conducting or insulating

**Current Sandboxels Status**: ❌ **NOT IMPLEMENTED**
- Walls are regular elements
- Take up pixel space
- Can't see through walls
- No special wall types

**Why This Matters**:
- Build containers without filling space
- Control airflow
- Create pressure chambers
- Electrical insulation
- Directional filters

**Implementation Impact**:
- HIGH - Requires separate wall layer
- Rendering changes
- Physics interactions
- Tool system updates

---

### 5.2 Sign and Annotation System ⭐⭐

**The Powder Toy Features**:
- Place text signs on simulation
- Signs don't interact with simulation
- Can annotate saves
- Educational labeling
- Documentation in-sim

**Current Sandboxels Status**: ❌ **NOT IMPLEMENTED**

**Why This Matters**:
- Educational uses
- Save documentation
- Tutorial creation
- Sharing knowledge

**Implementation Impact**:
- LOW - Add text overlay system
- Simple UI for sign creation

---

### 5.3 Brush Shapes and Tools ⭐⭐⭐

**The Powder Toy Tools**:

**Brush Shapes**:
- Circle (default)
- Square
- Triangle
- Line tool
- Rectangle tool
- Flood fill

**Special Tools**:
- Heat tool
- Cool tool
- Vacuum tool
- Air tool
- Pressure tool
- Gravity tool
- Mix tool
- Copy/paste
- Undo/redo

**Current Sandboxels Status**: ⚠️ **PARTIALLY IMPLEMENTED**
- Has heat/cool tools
- Has basic brush sizes
- Missing: Shape variety
- Missing: Advanced tools
- Missing: Copy/paste
- Missing: Undo/redo

**Why This Matters**:
- Precise construction
- Faster building
- Error correction
- Template reuse

**Implementation Impact**:
- MEDIUM - UI and tool system
- Brush shape algorithms
- Copy/paste buffer
- History system for undo

---

### 5.4 View Modes and Visualization ⭐⭐⭐

**The Powder Toy View Modes**:
0. Normal (element colors)
1. Heat gradient
2. Fancy display (glow effects)
3. Blob display (smooth)
4. Heat blob
5. Fire gradient
6. Pressure map (blue/red)
7. Persistent (no fade)
8. Fire simulation
9. Velocity map

**Advanced Visualizations**:
- Debug mode (shows particle IDs)
- Pressure overlay
- Velocity vectors
- Air flow visualization
- Grid display

**Current Sandboxels Status**: ⚠️ **BASIC IMPLEMENTATION**
- Has normal, thermal, velocity views
- Has new Temp+ overlay (good!)
- Missing: Pressure visualization (no pressure system)
- Missing: Blob/fancy rendering
- Missing: Debug views

**Why This Matters**:
- Understand simulation state
- Debug element behaviors
- Educational visualization
- Aesthetic variety
- See invisible forces

**Implementation Impact**:
- LOW-MEDIUM - Add rendering modes
- Some require new physics (pressure viz)
- Shader effects for fancy modes

---

### 5.5 Lua Scripting ⭐⭐⭐⭐⭐

**The Powder Toy Feature**: 
- Full Lua scripting API
- Access all simulation functions
- Create custom elements in Lua
- Automate tasks
- Create mods
- UI scripting

**Capabilities**:
```lua
-- Example: Create custom element
elem.element(elem.allocate("MYMOD", "CUSTOM"), {
    Name = "CUSTOM",
    Color = 0xFF0000,
    Temperature = 300,
    Update = function(i,x,y,s,n)
        -- Custom behavior code
    end
})
```

**Current Sandboxels Status**: ⚠️ **DIFFERENT APPROACH**
- JavaScript mods system
- Can add elements via mods
- Good mod ecosystem
- Web-based advantage

**Why This Matters**:
- Already handled well in Sandboxels!
- JS mods may be more accessible than Lua
- Web platform makes sharing easier
- Both approaches valid

**Implementation Impact**:
- N/A - Sandboxels approach is adequate
- No action needed

---

## 6. Recommended Implementation Priority {#implementation-priority}

### Priority 1: CRITICAL (Highest Impact) ⭐⭐⭐⭐⭐

These features would transform Sandboxels' simulation quality:

1. **Air Pressure and Velocity System**
   - **Effort**: HIGH (3-4 weeks)
   - **Impact**: MASSIVE
   - **Why First**: Foundation for explosions, fluid dynamics, pneumatics
   - **Implementation**: 
     - Create pressure/velocity grid (cell-based, lower resolution than pixels)
     - Add pressure update algorithm
     - Integrate with particle movement
     - Add visualization mode

2. **Newtonian Gravity**
   - **Effort**: HIGH (2-3 weeks)
   - **Impact**: MASSIVE
   - **Why**: Enables entirely new simulation category
   - **Implementation**:
     - Grid-based gravity field
     - Per-element gravity strength property
     - Mass-based calculations
     - Optional feature (performance toggle)

3. **Advanced Electrical System**
   - **Effort**: MEDIUM (1-2 weeks)
   - **Impact**: HIGH
   - **Why**: Complete existing partial implementation
   - **Implementation**:
     - Add SPRK (spark) element
     - Enhance conductivity system
     - Add semiconductor elements
     - Implement proper signal propagation

### Priority 2: HIGH IMPACT ⭐⭐⭐⭐

Features that significantly improve realism:

4. **Photon/Light Physics**
   - **Effort**: HIGH (2-3 weeks)
   - **Impact**: HIGH
   - **Why**: New simulation category, education
   - **Implementation**:
     - Fast-moving particle system
     - Wavelength property
     - Reflection/refraction
     - Filter element

5. **Pressure-Based State Transitions**
   - **Effort**: MEDIUM (1 week)
   - **Impact**: MEDIUM-HIGH
   - **Why**: More realistic materials
   - **Implementation**:
     - Add pressure tracking per pixel
     - Add pressure threshold properties
     - Integrate pressure calculations
     - Update element definitions

6. **Particle Property Enhancement (ctype, tmp system)**
   - **Effort**: MEDIUM (1-2 weeks)
   - **Impact**: HIGH
   - **Why**: Enables complex behaviors
   - **Implementation**:
     - Add tmp1-4 standard properties
     - Add ctype for material memory
     - Update element update functions
     - Refactor lava to remember origin

### Priority 3: QUALITY IMPROVEMENTS ⭐⭐⭐

Features that refine the simulation:

7. **Collision and Momentum System**
   - **Effort**: MEDIUM (1-2 weeks)
   - **Impact**: MEDIUM
   - **Implementation**:
     - Enhance velocity physics
     - Add collision detection
     - Implement momentum transfer
     - Add velocity-based reactions

8. **Life/Decay System**
   - **Effort**: LOW (3-5 days)
   - **Impact**: MEDIUM
   - **Implementation**:
     - Add life property
     - Auto-decrement system
     - LIFE_KILL behavior
     - Update fire/explosives

9. **Wall System**
   - **Effort**: HIGH (2-3 weeks)
   - **Impact**: MEDIUM
   - **Implementation**:
     - Separate wall layer
     - Wall types
     - Rendering updates
     - Physics integration

### Priority 4: POLISH AND FEATURES ⭐⭐

Nice-to-have improvements:

10. **Advanced Tools (Copy/Paste, Undo)**
    - **Effort**: MEDIUM (1 week)
    - **Impact**: MEDIUM (UX improvement)

11. **Additional View Modes**
    - **Effort**: LOW (3-5 days)
    - **Impact**: LOW-MEDIUM

12. **Element Categories** (TPT inspired)
    - **Effort**: LOW (2-3 days)
    - **Impact**: LOW (organization)

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Months 1-2)
- ✅ Heat capacity system (COMPLETED)
- ⏳ Air pressure/velocity grid
- ⏳ Enhanced electrical system
- ⏳ Particle property expansion (ctype, tmp)

### Phase 2: Advanced Physics (Months 3-4)
- ⏳ Newtonian gravity
- ⏳ Photon physics
- ⏳ Pressure state transitions
- ⏳ Collision/momentum

### Phase 3: Systems and Tools (Months 5-6)
- ⏳ Life/decay system
- ⏳ Wall layer
- ⏳ Advanced tools
- ⏳ View modes

### Phase 4: Content and Polish (Month 7+)
- ⏳ New elements using new systems
- ⏳ Documentation
- ⏳ Tutorial content
- ⏳ Performance optimization

---

## 8. Detailed Feature Specifications

### 8.1 Air Pressure System - Detailed Design

**Grid Structure**:
```javascript
// Lower resolution than pixel grid for performance
const CELL_SIZE = 4;  // 4x4 pixels per air cell
const AIR_CELLS_X = Math.ceil(width / CELL_SIZE);
const AIR_CELLS_Y = Math.ceil(height / CELL_SIZE);

airState = {
    vx: new Float32Array(AIR_CELLS_X * AIR_CELLS_Y),  // Velocity X
    vy: new Float32Array(AIR_CELLS_X * AIR_CELLS_Y),  // Velocity Y
    pv: new Float32Array(AIR_CELLS_X * AIR_CELLS_Y),  // Pressure
    hv: new Float32Array(AIR_CELLS_X * AIR_CELLS_Y),  // Ambient heat
};
```

**Update Algorithm** (simplified):
```javascript
function updateAir() {
    // 1. Apply pressure gradient to velocity
    for (let y = 1; y < AIR_CELLS_Y - 1; y++) {
        for (let x = 1; x < AIR_CELLS_X - 1; x++) {
            let index = y * AIR_CELLS_X + x;
            
            // Pressure gradient pushes air
            let dx = (pv[index+1] - pv[index-1]) * 0.5;
            let dy = (pv[index+AIR_CELLS_X] - pv[index-AIR_CELLS_X]) * 0.5;
            
            vx[index] -= dx;
            vy[index] -= dy;
        }
    }
    
    // 2. Apply velocity to pressure (divergence)
    for (let y = 1; y < AIR_CELLS_Y - 1; y++) {
        for (let x = 1; x < AIR_CELLS_X - 1; x++) {
            let index = y * AIR_CELLS_X + x;
            
            let dvx = (vx[index+1] - vx[index-1]) * 0.5;
            let dvy = (vy[index+AIR_CELLS_X] - vy[index-AIR_CELLS_X]) * 0.5;
            
            pv[index] -= (dvx + dvy) * 0.5;
        }
    }
    
    // 3. Dissipation
    for (let i = 0; i < vx.length; i++) {
        vx[i] *= 0.98;
        vy[i] *= 0.98;
        pv[i] *= 0.95;
    }
}
```

**Particle Integration**:
```javascript
// In particle update:
let cellX = Math.floor(pixel.x / CELL_SIZE);
let cellY = Math.floor(pixel.y / CELL_SIZE);
let cellIndex = cellY * AIR_CELLS_X + cellX;

// Air affects particle
if (elements[pixel.element].airDrag) {
    pixel.vx += airState.vx[cellIndex] * elements[pixel.element].airDrag;
    pixel.vy += airState.vy[cellIndex] * elements[pixel.element].airDrag;
}

// Particle affects air (Newton's 3rd law)
if (pixel.vx || pixel.vy) {
    airState.vx[cellIndex] += pixel.vx * 0.001;
    airState.vy[cellIndex] += pixel.vy * 0.001;
}
```

**Explosion Integration**:
```javascript
function explode(x, y, radius, pressure) {
    let cellX = Math.floor(x / CELL_SIZE);
    let cellY = Math.floor(y / CELL_SIZE);
    
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist <= radius) {
                let idx = (cellY + dy) * AIR_CELLS_X + (cellX + dx);
                if (idx >= 0 && idx < airState.pv.length) {
                    // Pressure falls off with distance
                    airState.pv[idx] += pressure * (1 - dist / radius);
                }
            }
        }
    }
}
```

---

### 8.2 Newtonian Gravity - Detailed Design

**Grid-Based Approximation** (for performance):
```javascript
const GRAV_CELL_SIZE = 4;
gravityState = {
    field: new Float32Array(GRAV_CELLS_X * GRAV_CELLS_Y * 2),  // X,Y force vectors
    mass: new Float32Array(GRAV_CELLS_X * GRAV_CELLS_Y),       // Mass per cell
};

function updateGravityField() {
    // 1. Calculate mass per cell
    gravityState.mass.fill(0);
    
    for (let pixel of activePixels) {
        if (elements[pixel.element].newtonianGravity) {
            let cellIdx = getCellIndex(pixel.x, pixel.y);
            gravityState.mass[cellIdx] += elements[pixel.element].weight;
        }
    }
    
    // 2. Calculate gravitational force at each cell
    for (let y = 0; y < GRAV_CELLS_Y; y++) {
        for (let x = 0; x < GRAV_CELLS_X; x++) {
            let idx = y * GRAV_CELLS_X + x;
            let fx = 0, fy = 0;
            
            // Sum forces from nearby massive cells
            for (let dy = -GRAV_RANGE; dy <= GRAV_RANGE; dy++) {
                for (let dx = -GRAV_RANGE; dx <= GRAV_RANGE; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    
                    let otherIdx = (y + dy) * GRAV_CELLS_X + (x + dx);
                    if (otherIdx < 0 || otherIdx >= gravityState.mass.length) continue;
                    
                    let mass = gravityState.mass[otherIdx];
                    if (mass > 0) {
                        let distSq = dx*dx + dy*dy;
                        let dist = Math.sqrt(distSq);
                        let force = (G * mass) / distSq;
                        
                        fx += force * (dx / dist);
                        fy += force * (dy / dist);
                    }
                }
            }
            
            gravityState.field[idx*2] = fx;
            gravityState.field[idx*2 + 1] = fy;
        }
    }
}

// Apply to particles
function applyGravity(pixel) {
    if (!elements[pixel.element].newtonianGravity) return;
    
    let cellIdx = getCellIndex(pixel.x, pixel.y);
    pixel.vx += gravityState.field[cellIdx*2];
    pixel.vy += gravityState.field[cellIdx*2 + 1];
}
```

---

### 8.3 Material Memory (ctype) System

**Usage Examples**:

```javascript
// LAVA remembers original material
elements.lava = {
    // ... other properties ...
    tick: function(pixel) {
        if (pixel.temp < elements[pixel.element].meltingPoint) {
            // Solidify back to original material
            if (pixel.ctype && elements[pixel.ctype]) {
                changePixel(pixel, pixel.ctype);
            } else {
                changePixel(pixel, "rock");  // Default
            }
        }
    }
};

// When melting something:
function meltPixel(pixel) {
    let originalType = pixel.element;
    changePixel(pixel, "lava");
    pixel.ctype = originalType;  // Remember what it was!
}

// CLNE (clone) remembers what to clone
elements.cloner = {
    tick: function(pixel) {
        if (pixel.ctype) {
            // Create copy of stored element
            createPixel(pixel.ctype, pixel.x, pixel.y + 1);
        }
    },
    onClick: function(pixel) {
        // Let user select what to clone
        pixel.ctype = currentElement;
    }
};

// FILT (filter) stores wavelength
elements.filter = {
    properties: function(photon) {
        if (this.ctype) {
            // Only allow matching wavelengths through
            photon.wavelength = photon.wavelength & this.ctype;
        }
    }
};
```

---

## 9. Performance Considerations

### JavaScript vs C++ Performance Gap

**Reality Check**:
- The Powder Toy (C++): Can simulate 100,000+ particles at 60 FPS
- Sandboxels (JavaScript): Typically handles 10,000-30,000 pixels well

**Strategies for JavaScript**:

1. **Grid-Based Optimizations**
   - Use typed arrays (Float32Array, Uint8Array)
   - Spatial partitioning
   - Skip empty regions
   - Chunk-based updates

2. **Selective Complexity**
   - Make advanced features optional (toggles)
   - Lower resolution for expensive simulations (air, gravity)
   - Limit particle counts for physics-heavy elements
   - Frame-skipping for expensive calculations

3. **Web Workers**
   - Offload pressure calculations
   - Parallel gravity field computation
   - Background autosave

4. **WebGL/WebAssembly** (future)
   - GPU-based physics for pressure/gravity
   - Compiled core simulation loop
   - Shader-based rendering

**Recommended Approach**:
- Start with optimized JavaScript
- Profile and identify bottlenecks
- Use typed arrays everywhere
- Make expensive features optional
- Consider WebAssembly for critical paths later

---

## 10. Educational and Scientific Value

### What Sandboxels Would Gain

**Current Strengths**:
- ✅ Accessible chemistry
- ✅ Biological elements
- ✅ Intuitive interface
- ✅ Creative freedom

**The Powder Toy Additions Would Enable**:

1. **Physics Education** ⭐⭐⭐⭐⭐
   - Pressure and fluid dynamics demonstrations
   - Thermodynamics with accurate constants
   - Optics (refraction, reflection, dispersion)
   - Newtonian mechanics and orbital motion
   - Electrical circuits and logic gates
   - Nuclear physics (fission, fusion)

2. **Engineering Applications** ⭐⭐⭐⭐
   - Pneumatic systems
   - Hydraulics
   - Electronic circuit design
   - Structural engineering (pressure on buildings)
   - Heat management in systems
   - Mechanical systems

3. **Scientific Demonstrations** ⭐⭐⭐⭐⭐
   - Ideal gas law (PV = nRT) visualization
   - Heat engine demonstrations
   - Wave propagation
   - Particle physics
   - Astronomy and astrophysics
   - Material science

**Specific Classroom Use Cases**:

```
Example 1: Pressure Demonstration
- Build sealed container
- Heat contents
- Watch pressure increase
- Observe: PV=nRT relationship

Example 2: Circuit Building
- Construct AND/OR gates
- Build half-adder
- Create binary counter
- Demonstrate: Digital logic

Example 3: Orbital Mechanics
- Place massive central body
- Add orbiting particles
- Adjust velocities
- Observe: Kepler's laws

Example 4: Optics
- Create prism from glass
- Shine white light
- Observe: Dispersion spectrum
- Demonstrate: Refraction
```

---

## 11. Comparison Summary Table

| Feature Category | The Powder Toy | Sandboxels | Gap Impact |
|-----------------|----------------|------------|------------|
| **Core Physics** |
| Air Pressure | ✅ Full simulation | ❌ None | ⭐⭐⭐⭐⭐ CRITICAL |
| Newtonian Gravity | ✅ FFT-based | ❌ None | ⭐⭐⭐⭐⭐ CRITICAL |
| Heat Transfer | ✅ Complete | ✅ Recent improvements | ⭐ MINIMAL |
| Electricity | ✅ Advanced | ⚠️ Basic | ⭐⭐⭐⭐ HIGH |
| Light/Optics | ✅ Photons | ❌ None | ⭐⭐⭐⭐ HIGH |
| **Material Properties** |
| Temperature | ✅ Kelvin | ⚠️ Celsius | ⭐⭐ MEDIUM |
| Pressure Effects | ✅ Yes | ❌ No | ⭐⭐⭐⭐ HIGH |
| Heat Capacity | ✅ Yes | ✅ Yes | ✅ MATCHED |
| Conductivity | ✅ Yes | ✅ Yes | ✅ MATCHED |
| Material Memory | ✅ ctype system | ❌ None | ⭐⭐⭐⭐ HIGH |
| **Particle System** |
| Sub-pixel Position | ✅ Yes | ❌ Grid-locked | ⭐⭐⭐ MEDIUM |
| Velocity | ✅ Continuous | ⚠️ Limited | ⭐⭐⭐ MEDIUM |
| Collision | ✅ Yes | ❌ No | ⭐⭐⭐⭐ HIGH |
| Life/Decay | ✅ Standardized | ⚠️ Ad-hoc | ⭐⭐⭐ MEDIUM |
| **Simulation Features** |
| Wall System | ✅ Separate layer | ❌ None | ⭐⭐⭐⭐ HIGH |
| Clone/Copy | ✅ Multiple types | ❌ None | ⭐⭐⭐ MEDIUM |
| Sensors | ✅ Many types | ❌ None | ⭐⭐⭐ MEDIUM |
| Ray Systems | ✅ 4+ types | ❌ None | ⭐⭐⭐ MEDIUM |
| **Elements** |
| Energy Particles | ✅ 5+ types | ❌ None | ⭐⭐⭐⭐ HIGH |
| Electronics | ✅ Complete | ⚠️ Basic | ⭐⭐⭐⭐ HIGH |
| Total Count | 194 focused | 500+ variety | Different goals |
| **Tools & UI** |
| Brush Shapes | ✅ 3+ shapes | ⚠️ Circle only | ⭐⭐ LOW |
| Special Tools | ✅ 10+ tools | ⚠️ Few | ⭐⭐⭐ MEDIUM |
| Undo/Redo | ✅ Yes | ❌ No | ⭐⭐ LOW |
| Copy/Paste | ✅ Yes | ❌ No | ⭐⭐⭐ MEDIUM |
| **Visualization** |
| View Modes | ✅ 10 modes | ⚠️ 4 modes | ⭐⭐ LOW |
| Debug Tools | ✅ Extensive | ⚠️ Basic | ⭐⭐ LOW |
| **Scripting** |
| Modding API | ✅ Lua | ✅ JavaScript | ✅ MATCHED |
| Community | ✅ Large | ✅ Growing | Both good |

**Legend**:
- ✅ = Fully implemented
- ⚠️ = Partially implemented or different approach
- ❌ = Not implemented
- ⭐⭐⭐⭐⭐ = Critical gap
- ⭐⭐⭐⭐ = High priority
- ⭐⭐⭐ = Medium priority
- ⭐⭐ = Low priority
- ⭐ = Minimal gap

---

## 12. Unique Sandboxels Strengths

**What Sandboxels Does Better**:

1. **Accessibility** ⭐⭐⭐⭐⭐
   - Web-based (no installation)
   - Works on mobile
   - Instant sharing via URL
   - Lower barrier to entry

2. **Mod Distribution** ⭐⭐⭐⭐
   - JavaScript mods easier than Lua for many
   - Mod loader built-in
   - Easy mod sharing

3. **Biological Elements** ⭐⭐⭐⭐
   - More life/organism variety
   - Animals and plants
   - Food and cooking
   - Organic chemistry focus

4. **Whimsy and Creativity** ⭐⭐⭐⭐
   - More playful elements
   - Creative combinations
   - Less serious, more fun
   - Artistic focus

5. **Element Variety** ⭐⭐⭐⭐
   - 500+ elements (vs 194)
   - More specialized variants
   - More combinations
   - Trade-off: Less physics depth, more content breadth

**Recommendation**: Keep these strengths while adding TPT's physics depth!

---

## 13. Conclusion

### Key Takeaways

**The Powder Toy's Core Advantages**:
1. ⭐⭐⭐⭐⭐ **Air pressure/velocity simulation** - Game-changing for realism
2. ⭐⭐⭐⭐⭐ **Newtonian gravity** - Enables astrophysics
3. ⭐⭐⭐⭐ **Advanced electricity** - Functional computers possible
4. ⭐⭐⭐⭐ **Photon physics** - Optics education
5. ⭐⭐⭐⭐ **Material memory (ctype)** - Complex behaviors

**Recommended Focus Areas**:

**Phase 1 - Foundation** (Highest ROI):
- Air pressure & velocity system
- Enhanced electrical system
- Particle properties (ctype, tmp1-4)

**Phase 2 - Advanced Physics**:
- Newtonian gravity
- Photon element
- Pressure state transitions

**Phase 3 - Systems**:
- Collision & momentum
- Life/decay standardization
- Wall layer

**What NOT to Copy**:
- ✅ Keep Sandboxels' biological richness
- ✅ Keep web-based accessibility
- ✅ Keep creative/whimsical elements
- ✅ Keep JavaScript modding (don't switch to Lua)
- ✅ Keep element variety approach

### Final Recommendation

**Hybrid Approach**: 
Implement The Powder Toy's physics foundations while maintaining Sandboxels' unique creative character. The goal should be:

> "Sandboxels: Where The Powder Toy's physics meets creative chemistry and biology"

The pressure system and Newtonian gravity would be transformative additions that maintain Sandboxels' accessibility while dramatically improving simulation fidelity for educational and scientific applications.

**Estimated Total Effort**: 6-12 months of focused development
**Expected Impact**: Transform Sandboxels into the most comprehensive physics sandbox available on the web

---

## Appendix A: Element-by-Element Comparison

### Electronics Elements - Missing in Sandboxels

| TPT Element | Function | Sandboxels Equivalent | Priority |
|-------------|----------|----------------------|----------|
| SPRK | Electrical spark | None | ⭐⭐⭐⭐⭐ |
| INWR | Insulated wire | None | ⭐⭐⭐⭐ |
| NSCN | N-type semiconductor | None | ⭐⭐⭐⭐ |
| PSCN | P-type semiconductor | None | ⭐⭐⭐⭐ |
| NTCT | N-type transistor | None | ⭐⭐⭐⭐ |
| PTCT | P-type transistor | None | ⭐⭐⭐⭐ |
| SWCH | Switch | None | ⭐⭐⭐ |
| HSWC | Solid state switch | None | ⭐⭐⭐ |
| INST | Instant conductor | None | ⭐⭐⭐ |
| WIFI | Wireless transmitter | None | ⭐⭐⭐ |
| BTRY | Battery | None | ⭐⭐⭐ |
| WIRE | Silicon wire | None | ⭐⭐⭐ |

### Energy Particles - Missing in Sandboxels

| TPT Element | Function | Sandboxels Equivalent | Priority |
|-------------|----------|----------------------|----------|
| PHOT | Photon/light | None | ⭐⭐⭐⭐⭐ |
| NEUT | Neutron | None | ⭐⭐⭐⭐ |
| PROT | Proton | None | ⭐⭐⭐ |
| ELEC | Electron | None | ⭐⭐⭐ |
| GRVT | Graviton | None | ⭐⭐ |

### Sensors and Detectors - Missing in Sandboxels

| TPT Element | Function | Sandboxels Equivalent | Priority |
|-------------|----------|----------------------|----------|
| DTEC | Element detector | None | ⭐⭐⭐⭐ |
| TSNS | Temperature sensor | None | ⭐⭐⭐⭐ |
| PSNS | Pressure sensor | None | ⭐⭐⭐⭐ |
| LSNS | Life sensor | None | ⭐⭐⭐ |
| VSNS | Velocity sensor | None | ⭐⭐⭐ |

---

## Appendix B: Physics Formulas Comparison

### Heat Transfer

**The Powder Toy**:
```cpp
// Conduction between particles
float harmonic_mean_conductivity = (2 * k1 * k2) / (k1 + k2);
float energy_transfer = (T1 - T2) * harmonic_mean_conductivity * dt;
T1 -= energy_transfer / (m1 * c1);
T2 += energy_transfer / (m2 * c2);
```

**Sandboxels (Current)**:
```javascript
// From enhanced heat transfer
var energyTransfer = tempDiff * avgConduct * 0.15;
pixel.temp += energyTransfer / heatCapacity;
neighbor.temp -= energyTransfer / neighborHeatCapacity;
```

**Gap**: Sandboxels uses arithmetic mean for conductivity; TPT uses harmonic mean (more accurate for interfaces)

---

### Pressure Calculations

**The Powder Toy**:
```cpp
// Air pressure update
for each cell:
    dvx = vx[right] - vx[left]
    dvy = vy[down] - vy[up]
    divergence = dvx + dvy
    pressure -= divergence * 0.5
```

**Sandboxels**: 
```
Not implemented
```

**Gap**: Entire pressure system missing

---

### Gravity

**The Powder Toy**:
```cpp
// Newtonian gravity (simplified)
for each massive particle:
    for each other particle:
        distance = sqrt(dx² + dy²)
        force = G * m1 * m2 / distance²
        acceleration = force / m
        velocity += acceleration * direction
```

**Sandboxels**:
```javascript
// Uniform gravity
if (element.density > 0) {
    pixel.vy += gravity;
}
```

**Gap**: No particle-particle gravity, only uniform downward

---

## Appendix C: Reference Resources

### The Powder Toy Documentation
- Wiki: https://powdertoy.co.uk/Wiki/W/Main_Page.html
- Forum: https://powdertoy.co.uk/Discussions/
- GitHub: https://github.com/The-Powder-Toy/The-Powder-Toy
- Element List: https://powdertoy.co.uk/Wiki/W/Element:Main.html

### Sandboxels Resources
- Main Site: https://sandboxels.r74n.com/
- Modding Wiki: https://sandboxels.wiki.gg/
- Discord: https://discord.com/invite/ejUc6YPQuS

### Physics References
- CRC Handbook of Chemistry and Physics
- Engineering Toolbox: https://www.engineeringtoolbox.com/
- NIST Chemistry WebBook: https://webbook.nist.gov/
- HyperPhysics: http://hyperphysics.phy-astr.gsu.edu/

---

**Document Version**: 1.0  
**Author**: Comparative Analysis AI  
**Date**: November 2024  
**Status**: Complete Analysis  
**Next Steps**: Review and prioritize implementation
