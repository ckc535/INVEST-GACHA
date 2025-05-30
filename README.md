# 🎲 Gacha Pet Investment dApp

A decentralized application for investing in NFT pets through a gacha game contract, built with Next.js, TypeScript, and ethers.js.

## 🏗️ Refactored Architecture

This codebase has been completely refactored from a single 1276-line component into a modular, maintainable architecture:

### 📁 Project Structure

```
├── app/
│   ├── page.tsx                 # Main application component (now clean & focused)
│   ├── layout.tsx              # App layout
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Shadcn/ui components
│   ├── pet-card.tsx           # Individual pet display component
│   ├── pet-house.tsx          # Animated pet house with live pets
│   ├── investment-tab.tsx     # Investment form and level info
│   ├── portfolio-tab.tsx      # Portfolio overview and stats
│   ├── wallet-connect.tsx     # Wallet connection component
│   └── investment-panel.tsx   # Legacy investment panel
├── hooks/
│   ├── use-wallet.ts          # Wallet connection & management
│   ├── use-contract.ts        # Smart contract interactions
│   ├── use-pet-data.ts        # Pet data management & animations
│   ├── use-toast.ts           # Toast notifications
│   └── use-mobile.tsx         # Mobile detection
├── lib/
│   ├── types.ts               # TypeScript interfaces & types
│   ├── constants.ts           # App constants & configuration
│   ├── utils.ts               # Utility functions
│   └── gacha-contract.ts      # Contract-specific utilities
```

## 🔧 Key Refactoring Improvements

### 1. **Separation of Concerns**
- **UI Components**: Each UI section is now a separate, reusable component
- **Business Logic**: Extracted into custom hooks for wallet, contract, and pet data
- **Constants**: Centralized configuration and constants
- **Types**: Proper TypeScript interfaces for type safety

### 2. **Custom Hooks Architecture**

#### `useWallet()`
- Handles MetaMask connection/disconnection
- Manages wallet state (address, balance, connection status)
- Provides error handling and user feedback
- Listens for account/network changes

#### `useContract()`
- Manages all smart contract interactions
- Handles investment transactions
- Manages reward claiming
- Provides contract data fetching

#### `usePetData()`
- Manages pet data loading from blockchain
- Handles pet animations and movement
- Calculates real-time earnings
- Manages portfolio statistics

### 3. **Component Breakdown**

#### `PetHouse`
- Animated pet display area
- Real-time pet movement and mood changes
- Interactive pet tooltips
- Pet statistics grid

#### `InvestmentTab`
- Investment form with validation
- Quick-select buttons for amounts
- Level information display
- Contract configuration status

#### `PortfolioTab`
- Portfolio value overview
- Investment statistics
- Contract information panel
- Progress indicators

#### `PetCard`
- Individual pet information display
- Earnings calculations
- Claim reward functionality
- Pet mood and level indicators

### 4. **Type Safety**
- Comprehensive TypeScript interfaces
- Proper typing for all props and state
- Type-safe contract interactions
- Enum-like constants for better IntelliSense

### 5. **Code Organization**
- **Constants**: All configuration in one place
- **Types**: Centralized interface definitions
- **Utils**: Reusable utility functions
- **Hooks**: Business logic separation
- **Components**: Pure UI components with clear props

## 🚀 Benefits of Refactoring

### **Maintainability**
- Each component has a single responsibility
- Easy to locate and modify specific functionality
- Clear separation between UI and business logic

### **Reusability**
- Components can be easily reused across the app
- Hooks can be shared between components
- Utility functions are centralized

### **Testability**
- Individual components can be tested in isolation
- Hooks can be tested independently
- Clear interfaces make mocking easier

### **Developer Experience**
- Better IntelliSense and autocomplete
- Easier debugging with smaller, focused files
- Clear file structure for new developers

### **Performance**
- Better code splitting opportunities
- Easier to optimize individual components
- Reduced bundle size through tree shaking

## 🔄 Migration from Legacy Code

The original `page.tsx` was **1276 lines** and contained:
- Wallet connection logic
- Contract interaction code
- Pet animation system
- UI rendering for all tabs
- State management
- Utility functions
- Constants and types

**After refactoring:**
- Main `page.tsx`: **~200 lines** (focused on orchestration)
- Logic distributed across **8 focused files**
- **100% functionality preserved**
- **Improved type safety**
- **Better error handling**

## 🛠️ Development Workflow

### Adding New Features
1. **New UI Component**: Add to `components/`
2. **New Business Logic**: Create custom hook in `hooks/`
3. **New Types**: Add to `lib/types.ts`
4. **New Constants**: Add to `lib/constants.ts`

### Modifying Existing Features
1. **UI Changes**: Modify specific component
2. **Logic Changes**: Update relevant hook
3. **Type Changes**: Update interfaces in `types.ts`

## 📦 Dependencies

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **ethers.js**: Ethereum interactions
- **Tailwind CSS**: Styling
- **Shadcn/ui**: UI components
- **Lucide React**: Icons

## 🎯 Next Steps

With this refactored architecture, the codebase is now ready for:
- **Easy feature additions**
- **Component testing**
- **Performance optimizations**
- **Code reviews**
- **Team collaboration**
- **Maintenance and updates**

The modular structure makes it simple to understand, modify, and extend the application while maintaining code quality and developer productivity. 