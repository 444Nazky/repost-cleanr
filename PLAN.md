# TypeScript Conversion Plan

## Objective
Convert the Chrome extension from JavaScript to TypeScript to make GitHub recognize TypeScript as the primary language.

## Current State Analysis
- Repository contains 3 main JavaScript files:
  - background.js (Chrome extension service worker)
  - script.js (Content script for TikTok)
  - popup.js (Extension popup logic)

## Conversion Plan

### Step 1: Add TypeScript Configuration
- Create `tsconfig.json` with appropriate settings for Chrome extension
- Configure target ES2020+ for modern JavaScript features
- Enable strict type checking
- Set up proper module resolution

### Step 2: Convert JavaScript Files to TypeScript
1. **background.ts**
   - Add Chrome extension types
   - Define interfaces for message requests
   - Add proper async/await typing
   - Define types for tab and scripting APIs

2. **script.ts**
   - Add DOM element type definitions
   - Define interfaces for TikTok page elements
   - Add proper error handling types
   - Define function parameter and return types

3. **popup.ts**
   - Add Chrome extension API types
   - Define interfaces for country/currency mappings
   - Add proper event listener typing
   - Define DOM element types

### Step 3: Update Manifest and Build Process
- Update `manifest.json` to reference compiled .js files (keeps extension working)
- Add build script to compile TypeScript to JavaScript
- Create development workflow for easy compilation

### Step 4: Add Type Definitions
- Install @types/chrome for Chrome extension APIs
- Add proper type declarations for TikTok-specific selectors
- Create custom type definitions where needed

## Expected Result
- GitHub will recognize TypeScript as primary language (>50% of code)
- Better type safety and IDE support
- Maintain full Chrome extension functionality
- Professional development environment

## Files to Create/Modify
- NEW: tsconfig.json
- NEW: package.json (for TypeScript dependencies)
- NEW: background.ts (converted from background.js)
- NEW: script.ts (converted from script.js)
- NEW: popup.ts (converted from popup.js)
- MODIFY: manifest.json (update file references)
- NEW: build scripts for compilation
