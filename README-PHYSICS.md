# Sandboxels - Enhanced Physics Branch

This branch adds advanced physics features to Sandboxels to dramatically increase simulation fidelity.

## 🌐 Live Demo

**GitHub Pages URL:** https://millionothin16.github.io/sandboxels/

## 🚀 New Physics Features

### Currently Implemented (Phase 1-2):

1. **Per-Particle Velocity & Momentum**
   - Realistic dynamic motion with gravity and air resistance
   - True collision physics with momentum conservation
   - Realistic splashes, bounces, and chain reactions

2. **Air Pressure Field**
   - Grid-based pressure simulation for gases
   - Compression and expansion mechanics
   - Gases flow from high to low pressure areas
   - Foundation for realistic explosions and wind

3. **Surface Tension**
   - Liquids form droplets and clump together
   - Cohesion forces between liquid particles
   - More realistic fluid behavior

4. **Advanced Heat Transfer**
   - Material-specific thermal conductivity
   - Conduction between adjacent pixels
   - Convection via velocity (hot fluids rise)
   - Black-body radiation for high-temperature objects (>500°C)

### How to Enable

1. Open Sandboxels
2. Click "Settings" button
3. Enable "Advanced Physics" toggle
4. Start experimenting!

## 🎮 Usage

The enhanced physics system is **disabled by default** for performance. Enable it in Settings > Advanced Physics.

When enabled:
- Water flows more realistically with surface tension
- Gases expand and compress based on pressure
- Hot materials radiate heat
- Particles have true velocity and momentum
- Collisions transfer momentum realistically

## 🔧 Technical Details

### Performance
- Physics calculations are optimized with grid-based pressure (4x4 pixel cells)
- Toggle-able system means no performance impact when disabled
- Graceful degradation for compatibility

### Implementation
- ~300 lines of new physics code
- Backward compatible with existing saves and mods
- Non-breaking changes to core simulation

## 📝 Future Enhancements

- Material deformation and fracture
- Variable resistivity and capacitance
- GPU acceleration with WebGPU
- Ray-traced lighting
- Stoichiometric chemistry
- Pseudo-3D layered grids

## 🤝 Contributing

This is a demonstration branch. Original Sandboxels by R74n.

## 📜 License

Same as original Sandboxels - see license.txt
