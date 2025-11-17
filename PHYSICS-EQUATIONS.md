# Physics Equations Reference - Sandboxels Enhanced Physics

This document details the real-world physics equations implemented in the enhanced physics system.

## 1. Ideal Gas Law (PV = nRT)

**Implementation:** `updatePressureGrid()`

```
P = (n * R * T) / V

Where:
- P = Pressure (atm)
- n = number of gas particles in cell
- R = gas constant (0.08 scaled)
- T = Temperature in Kelvin (°C + 273.15)
- V = Volume of pressure cell (PRESSURE_CELL_SIZE²)
```

**Realistic Behavior:**
- Gases expand when heated (Charles's Law)
- Pressure increases with particle density (Avogadro's Law)
- Hot gases create high-pressure zones
- Cold gases create low-pressure zones

## 2. Fourier's Law of Heat Conduction

**Implementation:** `enhancedHeatTransfer()` - Conduction section

```
q = -k * ∇T

Heat flux is proportional to:
- k = thermal conductivity (material-specific)
- ∇T = temperature gradient
```

**Harmonic Mean for Interfaces:**
```
k_interface = (2 * k₁ * k₂) / (k₁ + k₂)
```

This is more accurate than arithmetic mean for materials with different conductivities.

**Realistic Behavior:**
- Heat flows from hot to cold
- Different materials conduct at different rates
- Metals conduct faster than insulators
- Interface resistance accounted for

## 3. Stefan-Boltzmann Law (Thermal Radiation)

**Implementation:** `enhancedHeatTransfer()` - Radiation section

```
P = σ * ε * A * (T⁴ - T_ambient⁴)

Where:
- P = Radiated power
- σ = Stefan-Boltzmann constant (scaled)
- ε = emissivity (assumed ~1 for simplicity)
- T = Temperature in Kelvin
```

**Realistic Behavior:**
- Objects above 400°C radiate significant heat
- Radiation proportional to T⁴ (very temperature-sensitive)
- Net radiation to ambient temperature
- Glowing hot objects cool faster

## 4. Navier-Stokes Simplification (Fluid Dynamics)

### Pressure Gradient Force

**Implementation:** `applyVelocity()` - Pressure forces section

```
F_pressure = -∇P

Fluids accelerate toward lower pressure:
- vx += (P_left - P_right) * multiplier
- vy += (P_up - P_down) * multiplier
```

### Quadratic Drag

**Implementation:** `applyVelocity()` - Air resistance section

```
F_drag = -k * v²

Drag increases with speed squared (realistic)
```

**Realistic Behavior:**
- Terminal velocity naturally emerges
- Faster particles experience more drag
- Realistic deceleration

## 5. Young-Laplace Equation (Surface Tension)

**Implementation:** `applySurfaceTension()`

```
ΔP = γ * (1/R₁ + 1/R₂)

Simplified for 2D:
- Cohesion forces pull liquid toward center of mass
- Stronger at air-liquid interfaces
- Creates droplets and minimizes surface area
```

**Realistic Behavior:**
- Liquids form spherical droplets
- Surface minimization (soap bubbles)
- Capillary action
- Meniscus formation

## 6. Archimedes' Principle (Buoyancy)

**Implementation:** `enhancedHeatTransfer()` - Convection section

```
F_buoyancy = ρ_fluid * g * V * (ρ_air - ρ_fluid) / ρ_air

Approximated using thermal expansion:
- ΔT causes density change
- Hot fluids less dense → rise
- Cold fluids more dense → sink
```

**Realistic Behavior:**
- Natural convection currents
- Hot air rises
- Lava lamps
- Ocean/atmosphere circulation

## 7. Conservation Laws

### Conservation of Momentum

**Implementation:** `tryMove()` - Collision section

```
m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'

Elastic collision formulas:
v₁' = ((m₁-m₂)/(m₁+m₂)) * v₁ + (2m₂/(m₁+m₂)) * v₂
v₂' = (2m₁/(m₁+m₂)) * v₁ + ((m₂-m₁)/(m₁+m₂)) * v₂
```

**Realistic Behavior:**
- Momentum conserved in collisions
- Heavier particles transfer more momentum
- Realistic billiard ball physics

### Conservation of Energy

**Implementation:** All heat transfer functions

```
Energy_total = constant

Heat lost by one pixel = Heat gained by another
```

## 8. Coefficient of Restitution

**Implementation:** `applyVelocity()` - Collision response

```
v_after = -e * v_before

Where e = 0.3 (realistic for most materials)
```

**Realistic Behavior:**
- Energy lost in collisions
- Balls don't bounce forever
- Realistic settling behavior

## Physical Constants

All constants calibrated for pixel-space simulation:

```javascript
GRAVITY = 0.98              // ~9.8 m/s² scaled
AIR_RESISTANCE = 0.95       // Realistic drag coefficient
MAX_VELOCITY = 15           // Terminal velocity (pixels/tick)
SURFACE_TENSION_STRENGTH = 0.5  // ~72 mN/m for water (scaled)
THERMAL_CONDUCTIVITY_DEFAULT = 0.1
VISCOSITY_FACTOR = 0.8      // Viscous damping
RESTITUTION_COEFFICIENT = 0.3   // Energy loss (30% retained)
GAS_CONSTANT = 0.08         // Scaled R for PV=nRT
PRESSURE_FORCE_MULTIPLIER = 3.0
```

## Validation

These implementations follow standard physics textbook equations:
- Halliday & Resnick - Fundamentals of Physics
- Feynman Lectures on Physics
- Landau & Lifshitz - Fluid Mechanics
- Incropera & DeWitt - Heat Transfer

All equations are properly scaled for pixel-based discrete simulation while maintaining physical realism.
