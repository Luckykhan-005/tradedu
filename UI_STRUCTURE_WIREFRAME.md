# AI Alpha Hunter & Opportunity Radar - UI Structure & Wireframe

## Overall Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ENTIRE APPLICATION                                │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┬───────────────────────────────────────────────────────┐
│              │                                                         │
│   SIDEBAR    │              MAIN CONTENT AREA                         │
│  (250px)     │         (Dynamic based on section)                     │
│              │                                                         │
└──────────────┴───────────────────────────────────────────────────────┘
```

---

## Left Sidebar Structure

```
┌─────────────────────────────────┐
│  LEFT SIDEBAR (250px wide)       │
├─────────────────────────────────┤
│                                 │
│  ┌──────────────────────────┐   │
│  │ Alpha Hunter Logo        │   │  (40px height)
│  │ Opportunity Radar        │   │  (10px font)
│  └──────────────────────────┘   │
│                                 │  HEADER SECTION
│                                 │
├─────────────────────────────────┤
│                                 │
│  NAVIGATION TABS:              │
│  (35px height each)            │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [📡] Opportunity Radar    │  │  ACTIVE (highlighted)
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [⊕] Opportunity Scanner   │  │  INACTIVE
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [◇] Hidden Gems          │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [🔔] Alerts              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [ⓘ] Market Intelligence   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [□] Risk Calculator      │  │
│  └───────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│                                 │
│  STATUS AREA:                  │
│                                 │
│  ● Monitoring 24/7             │  (green indicator)
│    ⟲ 1 scan                    │  (icon + text)
│    📍 last 7:36:05 PM          │  (timestamp)
│                                 │
│  ✓ Capital Protection First    │  (badge)
│  The AI has authority to       │
│  return zero results. Quality  │
│  over quantity — always.       │
│                                 │
└─────────────────────────────────┘
```

---

## Main Content Area - Opportunity Radar Section

```
┌────────────────────────────────────────────────────────────┐
│                    MAIN CONTENT AREA                        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  HEADER SECTION (100px height)                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  [📡] OPPORTUNITY RADAR - LIVE                            │
│                                                             │
│  AI Alpha Hunter & Opportunity Radar                       │
│  24/7 AI opportunity detection across the cryptocurrency   │
│  market. Don't follow the market — detect the opportunity  │
│  before the market does.                                   │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  PRIMARY ALERT CARD (350px height)                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚡ HIGH PRIORITY ALERT • just now                         │
│                                                             │
│  Strong Alpha Opportunity Detected                         │
│  ➤ LONG LISTA — Confidence 65% • Opportunity Strength 78% │
│  • Risk LOW • Trade Probability 72%                        │
│                                                             │
│  AI Recommendation: IMMEDIATE REVIEW RECOMMENDED.          │
│  +7 more active alerts                                     │
│                                                             │
│  ┌─────────────────────────┐      ┌─────────────┐         │
│  │  Trade Setup Details    │      │  ⊙⊙ ⊙ ⊙   │         │
│  │                         │      │  ⊙   ⊙   │  TARGET │
│  │  [Expanded when show    │      │   ⊙⊙   ⊙ │  ACQUIRED│
│  │   setup is clicked]     │      │           │         │
│  │                         │      └─────────────┘         │
│  └─────────────────────────┘                               │
│                                                             │
│  [View Setup ▼]  [Acknowledge ✓]  [✕ Dismiss]            │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  METRICS ROW (120px height)                                │
├──────────────┬──────────────┬──────────────┬──────────────┤
│              │              │              │              │
│ ACTIVE OPP.  │ LAST SCAN    │ SENTIMENT    │ BTC DOMI.   │
│ 0            │ just now     │ Neutral      │ 50%         │
│ Quality      │ 0 candidates │ Score 50/100 │ Consolid.   │
│ over quantity│ scanned      │              │             │
│              │              │              │              │
├──────────────┴──────────────┴──────────────┴──────────────┤
│                                                             │
│  [icon] [icon] [icon] [icon]                              │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  OPPORTUNITY RADAR SECTION (250px height)                  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  📡 Opportunity Radar                [Open Scanner →]      │
│  Highest-probability alpha opportunities detected...       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │          ✓ (Shield Icon)                           │  │
│  │                                                      │  │
│  │   No High Probability Alpha Opportunity Detected    │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  SCAN HISTORY SECTION (Variable height)                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Scan History                                              │
│  [Historical data visible when expanded]                   │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Opportunity Scanner Section

```
┌────────────────────────────────────────────────────────────┐
│  HEADER (60px height)                                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  AI Opportunity Scanner                                    │
│  Filter and rank detected opportunities by type,           │
│  strength, and risk                                        │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  SEARCH & FILTER BAR (60px height)                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Search symbol, name, narrative...  ≡ Opportunity     │
│                                          ▼ Strength       │
│                                                             │
│  ┌──────────┬──────────────┬──────────────┬──────────┐    │
│  │ All      │ Hidden Gems  │ Breakouts    │ ... more │    │
│  │ (Active) │              │              │          │    │
│  └──────────┴──────────────┴──────────────┴──────────┘    │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  RESULTS AREA (Variable height)                            │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ⏱️ (Loading icon)                                         │
│                                                             │
│  No opportunities match your filters                       │
│                                                             │
│  Try widening the filter or check back after the next     │
│  scan cycle. The AI only surfaces high-probability        │
│  setups.                                                   │
│                                                             │
│  [Opportunity Cards appear here when available]           │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Hidden Gems Section

```
┌────────────────────────────────────────────────────────────┐
│  HEADER (60px height)                                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ◇ Hidden Gem Radar                                        │
│  Low and mid-cap opportunities with the highest Hidden     │
│  Gem scores                                                │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  EMPTY STATE / RESULTS AREA (300px minimum)               │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │              ◇ (Diamond Icon)                       │  │
│  │                                                      │  │
│  │        No hidden gems detected                      │  │
│  │                                                      │  │
│  │  The AI scans low and mid-cap projects for early   │  │
│  │  accumulation patterns. When a high-quality hidden │  │
│  │  gem is detected, it will appear here.             │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Alerts Section

```
┌────────────────────────────────────────────────────────────┐
│  HEADER (60px height)                                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  🔔 24/7 AI Alert System                                   │
│  High and very-high priority alerts generated by the       │
│  scanner                                                   │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ALERT CARD #1 (200px height)                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚡ HIGH PRIORITY ALERT • just now                        │
│  ➤ LONG LISTA — Confidence 65% • Strength 78%            │
│  Trade Probability 72% • Risk LOW • Hold 1-3 days         │
│                                                             │
│  AI Recommendation: IMMEDIATE REVIEW RECOMMENDED.         │
│                                                             │
│  BTC:D 23.4% (Consolidating) | Sentiment: Greed (64) |  │
│  OI Stable | Volume Surging                               │
│                                                             │
│  [Acknowledge ✓]                                           │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ALERT CARD #2 (200px height)                             │
├────────────────────────────────────────────────────────────┤
│  ⚡ HIGH PRIORITY ALERT • just now                        │
│  [Similar structure, different symbol: SATS]              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ALERT CARD #3 (200px height)                             │
├────────────────────────────────────────────────────────────┤
│  ⚡ HIGH PRIORITY ALERT • just now                        │
│  [Similar structure, different symbol: IDO]               │
└────────────────────────────────────────────────────────────┘

[Additional cards scroll below...]
```

---

## Market Intelligence Section

```
┌────────────────────────────────────────────────────────────┐
│  HEADER (60px height)                                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ⓘ Market Intelligence                                    │
│  Live macro read of the crypto market — BTC dominance,     │
│  sentiment, funding, narratives                           │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  TOP METRICS ROW (140px height)                            │
├──────────────┬──────────────┬──────────────┬──────────────┤
│              │              │              │              │
│ BTC DOMIN.   │ TOTAL CAP    │ SENTIMENT    │ AVG FUNDING │
│ 23.4%        │ $2.4T        │ Greed        │ 0.0001%     │
│ Consolidating│              │ Score 64/100 │             │
│              │              │              │             │
├──────────────┴──────────────┴──────────────┴──────────────┤
│                                                             │
│  [Icon] [Icon] [Icon] [Icon]                              │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  TWO-COLUMN LAYOUT (400px height)                          │
├──────────────────────────────┬──────────────────────────────┤
│  LEFT: MARKET STRUCTURE      │  RIGHT: NARRATIVE STRENGTH  │
├──────────────────────────────┼──────────────────────────────┤
│                              │                              │
│ ↔ Open Interest Trend        │  Privacy           ████ 100  │
│   Stable                     │  Meme Coin         ███  91   │
│                              │  Oracle            ██   83   │
│ 📊 Volume Trend              │  Bitcoin Ecosystem ██   83   │
│   Surging                    │  Gaming            █    67   │
│                              │  Exchange          █    67   │
│ ▲ BTC Trend                  │  DeFi              █    64   │
│   Consolidating              │  Interoperability  █    63   │
│                              │  AI                █    62   │
│ 😊 Sentiment                 │  Storage           █    59   │
│   Greed                      │  Layer 1           █    56   │
│                              │                              │
│                              │  [More narratives below...] │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘
```

---

## Risk Calculator Section

```
┌────────────────────────────────────────────────────────────┐
│  HEADER (60px height)                                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  □ Risk Manager Calculator                                │
│  Calculate position size, P&L, liquidation price, and      │
│  slippage impact for perpetual futures trades             │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────────┐
│  LEFT PANEL                  │  RIGHT PANEL                 │
│  TRADE PARAMETERS            │  RESULTS & ANALYSIS          │
├──────────────────────────────┼──────────────────────────────┤
│                              │                              │
│ 📊 TRADE PARAMETERS          │ 💰 NET PROFIT / LOSS         │
│                              │                              │
│ Portfolio Size (USD)         │  -0.20 USDT                 │
│ ┌──────────────────┐         │  -2.00% on margin           │
│ │ 1000             │         │                              │
│ └──────────────────┘         │ 📋 POSITION BREAKDOWN       │
│ 1.0% allocated to trade      │                              │
│                              │  Position Size: 200.00 USDT │
│ Margin (USD)                 │  Quantity: —                │
│ ┌──────────────────┐         │                              │
│ │ 10               │         │  Gross P&L:    +0.00 USDT  │
│ └──────────────────┘         │  Slippage Cost: -0.20 USDT  │
│ Max loss = 10 USDT           │                              │
│                              │  Liquidation Price: —        │
│ Leverage                     │  Max Loss:      -10.00 USDT │
│ ┌──────────────────┐         │                              │
│ │ 20            [x]│         │ ⚠️ RISK ANALYSIS            │
│ └──────────────────┘         │                              │
│ Position size = 200.00 USDT  │  Portfolio Allocation       │
│                              │  ● (gauge)                   │
│ Direction                    │                              │
│ [✓ Long  ] [  Short  ]       │  Risk to Portfolio: 0.0%    │
│                              │                              │
│ Entry Price (USD)            │                              │
│ ┌──────────────────┐         │                              │
│ │                  │         │                              │
│ └──────────────────┘         │                              │
│                              │                              │
│ Exit Price (USD)             │                              │
│ ┌──────────────────┐         │                              │
│ │                  │         │                              │
│ └──────────────────┘         │                              │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘
```

---

## Alert Card Detail Structure

```
┌────────────────────────────────────────────────────────────┐
│  ALERT CARD - DETAILED BREAKDOWN                           │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚡ Badge Area                                       │   │
│  │ HIGH PRIORITY ALERT • timestamp                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ➤ LONG SYMBOL                                       │   │
│  │ Strong Alpha Opportunity Detected                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Metrics Line:                                       │   │
│  │ Confidence XX% • Strength XX% • Trade Prob XX%    │   │
│  │ Risk [LEVEL] • Hold [X-Y] days                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ AI Recommendation: IMMEDIATE REVIEW RECOMMENDED.   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Market Context:                                     │   │
│  │ BTC:D XX% (Status) | Sentiment: X (XX) |           │   │
│  │ OI [Status] | Volume [Status]                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Acknowledge ✓] or [Other Actions]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└────────────────────────────────────────────────────────────┘

WHEN EXPANDED (Show Trade Setup):

┌────────────────────────────────────────────────────────────┐
│                                                             │
│  AI TRADE SETUP - [SYMBOL]                                 │
│                                                             │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │ ENTRY PRICE  │ EXIT PRICE   │ RISK / REWARD       │    │
│  │ 0.0699       │ 0.1083       │ 4.8:1               │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
│                                                             │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │ TP1          │ TP2          │ TP3                 │    │
│  │ 0.0843       │ 0.0939       │ 0.1083              │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
│                                                             │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │ STOP LOSS    │ TRAILING STOP│ TIMEFRAME           │    │
│  │ 0.0619       │ 0.0795       │ 1H-4H               │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
│                                                             │
│  Hold: 1-3 days ⏱️  Type: breakout 📈                      │
│                                                             │
│  [View Full Analysis →]                                    │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Trade Setup Expansion Component

```
When User Clicks "View Setup":

┌────────────────────────────────────────────────────────────┐
│                   EXPANDED SECTION                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  AI TRADE SETUP - SYMBOL                                  │
│                                                             │
│  Entry/Exit Framework:                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ENTRY PRICE:    0.XXXX                             │   │
│  │ EXIT PRICE:     0.XXXX                             │   │
│  │ RISK/REWARD:    X.X:1                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Take Profit Levels:                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ TP1: 0.XXXX   TP2: 0.XXXX   TP3: 0.XXXX           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Risk Management:                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ STOP LOSS:      0.XXXX                             │   │
│  │ TRAILING STOP:  0.XXXX                             │   │
│  │ TIMEFRAME:      XH-XH                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ⏱️ Hold: 1-3 days   📈 Type: breakout                     │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  [View Full Analysis]  [Hide Setup]  [Acknowledge] │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Color & Visual Hierarchy

### Background Colors
- **Primary Background**: Dark Navy (#0F1419)
- **Card Background**: Slightly lighter navy/dark gray
- **Hover/Active**: Medium dark gray with transparency

### Text Colors
- **Headers**: White (#FFFFFF)
- **Primary Text**: Light gray
- **Secondary Text**: Medium gray
- **Accents**: Cyan/Turquoise (#00D9FF)

### Status Colors
- **Bullish/LONG**: Bright Green (#00FF00)
- **Bearish/SHORT**: Red (#FF4444)
- **Alerts**: Yellow/Gold (#FFD700)
- **Positive Metrics**: Green
- **Negative Metrics**: Red
- **Neutral/Consolidating**: Gray/White

### Visual Elements
- **Borders**: Subtle 1px borders, usually colored accent
- **Shadows**: Minimal, subtle shadows for depth
- **Spacing**: Clean, generous padding (16-32px)
- **Icons**: Simple, monochromatic, 20-24px sizing

---

## Responsive Behavior

### Desktop (1920px+)
- Full sidebar visible
- Main content spans remainder
- Cards in full width
- Metrics in single row

### Tablet (1024px)
- Sidebar may collapse to icons
- Content adjusts
- Some cards stack

### Mobile (< 768px)
- Sidebar becomes drawer/hamburger
- Full-width content
- Cards stack vertically
- Scrolling required for all sections

---

## Animation & Interaction States

### Button States
- **Normal**: Default styling
- **Hover**: Slightly brighter, opacity change
- **Active**: Full highlight color
- **Disabled**: Grayed out, no cursor

### Loading States
- **Spinner**: Rotating icon animation
- **Placeholder**: Skeleton content or shimmer
- **Updates**: Subtle fade-in for new data

### Alert Notifications
- **Toast**: Slide in from top/bottom
- **Persistent**: Card-based display
- **Auto-dismiss**: After 5-10 seconds (if configured)

---

## Data Flow Pattern

```
1. SIDEBAR NAVIGATION
   ↓
2. SECTION LOADED
   ↓
3. FETCH DATA (Real-time updates)
   ↓
4. RENDER CONTENT
   ├─ Header
   ├─ Metrics
   ├─ Main Cards/Components
   └─ Footer/Actions
   ↓
5. USER INTERACTION
   ├─ View Details (expand)
   ├─ Search/Filter
   ├─ Acknowledge
   └─ Navigate
   ↓
6. UPDATE STATE
   ↓
7. RE-RENDER (if data changed)
   ↓
8. REPEAT (Real-time monitoring)
```

---

## Summary

The UI follows a **consistent, professional layout** with:
- ✓ Left navigation for section selection
- ✓ Header with section title and description
- ✓ Dynamic main content area
- ✓ Real-time data updates
- ✓ Card-based component system
- ✓ Clear action buttons
- ✓ Color-coded status indicators
- ✓ Professional dark theme
- ✓ Responsive design
- ✓ Accessible typography and spacing
