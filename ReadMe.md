# ⚔️ Somnia Realm Wars - Real-Time On-Chain Territory Control

A groundbreaking Web3 strategy game built with Next.js, integrating real-time multiplayer battles, Somnia Data Streams (SDS), and dynamic territory control mechanics.

This game delivers **true real-time multiplayer experiences** with instant territory updates, live leaderboards, and dynamic power systems — all powered by Somnia SDS's high-performance streaming architecture.

## 🌟 Key Features

### ⚡ Real-Time Multiplayer Battles
- **Instant territory control updates** across all players
- **Live attack animations** with visual feedback
- **Dynamic power systems** that update in real-time
- **No polling, no delays** - pure push-based updates

### 🛡️ On-Chain Gameplay Integrity
All crucial game data is stored on-chain via Somnia SDS:
- Player wallet addresses
- Realm power levels
- Attack histories
- Leaderboard rankings
- Activity streams

### 🎮 Dynamic Territory Control
- **8 unique realms** with strategic positions
- **Power-based territory dominance**
- **Real-time attack animations**
- **Live activity feeds** showing all player actions

### 📊 Live Data Streaming
Somnia SDS enables:
- **Sub-second data propagation**
- **Live leaderboard updates**
- **Real-time activity feeds**
- **Instant visual feedback**
- **Multiplayer synchronization**

## 🏗️ Architecture Overview
Next.js Frontend (React + TypeScript)
↓ (Custom Events)
Real-time UI Updates
↓ (Web3 Actions)
Somnia Data Stream SDK
↓
Somnia Dream Chain (On-chain storage)

- **Frontend** → Real-time visualizations and user interactions
- **Somnia SDS** → Instant data streaming and synchronization
- **Blockchain** → Secure, transparent game state storage

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend Framework | Next.js 14 + TypeScript |
| Web3 Integration | Viem + WalletConnect |
| Real-time Data | Somnia Data Stream SDK |
| Blockchain | Somnia Dream Chain (Testnet) |
| Styling | Tailwind CSS + Custom Cyberpunk Theme |
| Animations | Framer Motion + Canvas API |

## 🎮 Gameplay Mechanics

### Realm Control System
- **Enter Realms** → Establish presence and gain power
- **Attack Other Realms** → Steal power from opponents  
- **Complete Quests** → Earn bonus power and rewards
- **Strategic Positioning** → Control key territory connections

### Power Dynamics
- **Base Power**: 100 per realm
- **Attack Gains**: +75 power for attacker
- **Defense Losses**: -50 power for defender
- **Quest Rewards**: +25-50 power bonuses

### Multiplayer Features
- **Live leaderboard** with real-time rankings
- **Activity feed** showing all player actions
- **Bot simulation** for active demo experience
- **Wallet integration** for true Web3 gameplay

## 🔗 Smart Contract Integration

### Game Actions Published via SDS:
- `ENTER_REALM` - Player joins a territory
- `ATTACK_REALM` - Player attacks another territory  
- `QUEST_COMPLETE` - Player completes objectives
- All actions are **signed and verified** on-chain

### Data Schema:
```solidity
address user
string activityType  
string activityContext
uint256 activityValue
uint256 realm
uint256 targetRealm
uint256 timestamp
bytes32 sourceId

## 🚀 Why Somnia SDS?
### 🎯 Perfect Gaming Infrastructure
Real-time capabilities essential for multiplayer games

Database-level performance with blockchain security

No central servers required for game state

Horizontal scalability for thousands of concurrent players

🔒 Anti-Cheat Protection
All actions signed and verified on-chain

No client-side spoofing of power or rankings

Transparent game history immutable on blockchain

Server-validated writes through SDS

⚡ Performance Advantages
<100ms update latency for real-time feel

Push-based architecture eliminates polling

Efficient data streams optimized for gaming

Cross-player synchronization out of the box

🎯 Demo Features
Live War Map
Interactive canvas with realm visualization

Real-time attack animations with particle effects

Dynamic power indicators with color coding

Constellation connections between realms

War Intelligence Dashboard
Live activity feed with transaction history

Real-time leaderboard with player rankings

Power tracker with realm status monitoring

Network statistics showing blockchain activity

Bot Simulation
AI opponents for dynamic demo experience

Automatic realm interactions when no players online

Seamless transition to real multiplayer when users connect

🚀 Getting Started
Prerequisites
MetaMask wallet installed

Somnia Testnet (Shannon) configured

STT testnet tokens for gas fees

Quick Start
Connect your wallet to Somnia Testnet

Select your realm and target for attacks

Execute game actions (Enter, Attack, Quest)

Watch real-time updates across all players

Climb the leaderboard through strategic gameplay

🎮 How to Play
Connect & Prepare

Connect MetaMask wallet

Switch to Somnia Testnet

Ensure STT tokens for gas

Establish Presence

Enter a realm to start earning power

Build your territory strength

Strategic Warfare

Attack other realms to steal power

Complete quests for bonus rewards

Monitor the war map for opportunities

Dominate the Leaderboard

Accumulate power through strategic actions

Climb the real-time rankings

Become the ultimate realm champion

🔧 Development
