# Forex Signal Scanner - Complete UI/UX Documentation

## Overview
The Forex Signal Scanner is a comprehensive trading analysis tool with a dark-themed interface (navy/dark background with cyan/green and gold accents). It displays real-time forex market data and provides trading signal analysis across multiple timeframes and currency pairs.

---

## Header & Navigation

### Top Header Bar
- **Left Section**: Forex icon (green dot) + "FOREX SIGNAL SCANNER" text
- **Right Section**: 
  - Time display (e.g., "21:05:40:58")
  - Account balance display in green (e.g., "$10,000.00")

### Navigation Tabs (Top of Page)
1. **SCANNER** (Default/Active)
   - Main signal scanning interface
2. **CHART** 
   - Chart viewing functionality with pair and timeframe selection
3. **DEMO**
   - Demo trading account display
4. **OANDA**
   - OANDA practice account integration
   - Badge showing "1" (notification count)
5. **BOT**
   - Automated trading bot interface with multiple strategies
6. **BACKTEST**
   - Historical backtesting functionality
7. **CLOCK**
   - Market session timing visualization

---

## Tab 1: SCANNER (Main Interface)

### Layout Structure
The scanner tab is organized in logical sections with a vertical flow:

### Section 1: Disclaimer Banner
- Red/orange background
- Alert icon (⚠)
- Text: "DISCLAIMER - Real technical indicators from live market data. NOT financial advice. Forex trading involves substantial risk."
- Close button (✕)

### Section 2: TIMEFRAME Selection
- Label: "TIMEFRAME"
- Buttons: 15M, 1H, 4H (selected/highlighted in green), 1D
- Only one can be selected at a time
- Selection persists across actions

### Section 3: HISTORY DEPTH Selection
- Label: "HISTORY DEPTH"
- Buttons: 300, 500 (selected in gold), 1000, 2000, 5000
- Determines historical candles to analyze
- Gold highlight indicates active selection

### Section 4: LOOK-AHEAD Selection
- Label: "LOOK-AHEAD"
- Buttons: 5c, 10c (selected in blue/cyan), 20c, 30c
- "c" = candles
- Cyan border indicates active selection

### Section 5: PAIRS Selection
- Label: "PAIRS (3 selected)" - Shows dynamic count
- Available currency pairs (toggle buttons):
  - EUR/USD (selected)
  - GBP/USD (selected)
  - USD/JPY (selected)
  - USD/CHF
  - AUD/USD
  - USD/CAD
  - NZD/USD
  - EUR/GBP
  - EUR/JPY
  - GBP/JPY
  - XAU/USD
- Multiple pairs can be selected simultaneously
- Selected pairs shown with green/cyan border

### Section 6: MIN CONFLUENCE Slider
- Label: "MIN CONFLUENCE 7/20"
- Range slider with yellow-filled portion
- Yellow circle handle for interaction
- Shows current position and maximum (7 out of 20)
- Controls minimum confluence threshold for signals

### Section 7: SIGNAL WEIGHTS Configuration
- Label: "SIGNAL WEIGHTS max 10.0/20" with dropdown arrow
- Toggle button: "configure" (right-aligned)

#### When Collapsed:
- Shows only the summary line with "▼ configure" 

#### When Expanded (Configure Mode):
**Two-Column Layout of Signal Indicators:**

**Left Column:**
1. **Trend Direction**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x
   
2. **MACD Cross**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x
   
3. **200 SMA Position**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x
   
4. **Support / Resistance**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x
   
5. **Volume Confirmation**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x

**Right Column:**
1. **RSI Momentum**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x
   
2. **50 SMA Position**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x
   
3. **Bollinger Bands**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x
   
4. **Candlestick Pattern**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x
   
5. **Market Session**
   - Options: 0x, 0.5x, 1x (selected), 1.5x, 2x

**Preset Strategy Buttons:**
- Each with full description:
  1. **Swing Trader** - "Balanced — trend, key levels & 200 SMA lead"
  2. **Scalper** - "Fast entries — RSI, MACD, session timing & momentum"
  3. **Trend Follower** - "Ride the trend — both SMAs & trend direction dominate"
  4. **Breakout** - "Level breaks — Bollinger, S/R & volume confirm the move"
  5. **Reversal Hunter** - "Counter-trend — RSI extremes, Bollinger & candlestick patterns"
  6. **Session Trader** - "News & opens — session timing & volume are everything"
  
- **Reset Button**: "reset (1x all)" - Resets all weights to default 1x multiplier
- Collapse option (▲) to hide this panel

### Section 8: AUTO-SCAN Controls
- Label: "AUTO-SCAN"
- Toggle button: "▷ OFF" (play/pause icon)
  - When OFF: Shows pause state
  - When ON: Would show running state
- Time zone display: "London" (top right, in green)

### Section 9: Scan Trigger Button
- Large green button with border
- Text: "▶ SCAN 3 PAIRS" (dynamically shows selected pair count)
- Full width button
- Green highlight color for action CTA

### Section 10: Scan Log Display
- Dark background panel
- Scrollable content area
- Shows scan progress and results:
  - "SCAN 1.00" - Scan iteration number
  - "Scanning EUR/USD [4H]..." - Current scanning status
  - "✗ EUR/USD: Request failed with status code 429" - Error messages in red
  - Shows results for each scanned pair

### Section 11: Results Area
- Displays message when no results: "No setups met the 7/10 threshold."
- When signals found: Would display signal cards with:
  - Currency pair name
  - Direction (LONG/SHORT with color coding)
  - Confluence score
  - Signal indicators that triggered
  - Entry price / levels
  - Chart button
  - Trade action buttons

---

## Tab 2: CHART

### Layout
- **PAIR Selection**: All currency pair buttons (EUR/USD pre-selected)
- **TIMEFRAME Selection**: 15M, 1H, 4H (pre-selected), 1D
- **Action Button**: Large green bordered button
  - Text: "▶ LOAD CHART — EUR/USD 4H" (updates dynamically)
  
### Functionality
- Loads price chart for selected pair and timeframe
- Instructions when no chart loaded: "Select a pair and click Load Chart — or click the chart button on any signal card."

---

## Tab 3: DEMO

### Header
**DEMO ACCOUNT BALANCE**
- Large balance display: "$10,000.00" (in white monospace font)
- Smaller text: "Started with $10,000 +$0.00 all time"

### Statistics Grid (4 columns)
1. **OPEN TRADES**
   - Value: 0
   - Cyan color

2. **OPEN P&L**
   - Value: +$0.00
   - Green for positive

3. **TOTAL TRADES**
   - Value: 0
   - Cyan color

4. **WIN RATE**
   - Value: 0%
   - Red for no trades

5. **WINS / LOSSES**
   - Value: 0 / 0
   - Cyan color

### Top-Right Button
- **+ TOP UP** button (gold/yellow border)
- Allows adding funds to demo account

### Open Trades Section
- Label: "OPEN TRADES"
- Empty state message: "No open trades. Take a trade from the Scanner tab."
- Would display trade cards when trades are open

---

## Tab 4: OANDA

### Account Header
**OANDA PRACTICE ACCOUNT**
- Large balance display: "$99,967.365"

### Statistics Grid
1. **OPEN TRADES**: 1
2. **OPEN P&L**: $-7.50 (in red for loss)
3. **REALIZED P&L**: $-28.77 (in red)
4. **WIN RATE**: 40%
5. **WINS / LOSSES**: 4 / 6

### Top-Right Button
- **↻ REFRESH** - Refreshes account data

### Open Positions Section
- Label: "OPEN POSITIONS — 1"
- **Position Card** (with green left border):
  - Currency pair: GBP/USD
  - Badge: "LONG" (green)
  - Lot size: Lot: 0.10
  - P&L display: $-7.50 (in red)
  - Pips display: -7.5 pips
  - Details rows:
    - ENTRY: 1.35541
    - CURRENT: 1.35466
    - STOP LOSS: 1.35217
    - TAKE PROFIT: 1.36234
  - Metadata: "Opened: 2026-08-28T13:42 - Trade ID: 74"
  - Action button: Red "Close Position" button

### Closed Trades Section
- Label: "CLOSED TRADES — 10" with "hide" toggle
- Scrollable table/list showing:
  - Date/Time stamps
  - Currency pairs
  - Direction (L for Long, S for Short)
  - Entry price
  - Exit price
  - P&L (in green for gains, red for losses)
- Example entries visible with various P&L values

---

## Tab 5: BOT

### Information Banner
- Blue background informational box
- "HOW IT WORKS" label
- Text: "START BOT runs all 8 strategies simultaneously every 30 min via server cron (zero browser drain). ▶ Test scan previews the selected strategy in your browser — 3 API credits, no trades placed."

### Bot Status Section
- Green border box
- Status text: "🟢 ACTIVE — all 8 strategies - every 30 min"
- Three buttons:
  1. **■ STOP BOT** - Red button to halt bot
  2. **↻ Run now** - Execute immediate run
  3. **ᐳ Test scan** - Preview strategy (disabled/grayed out with note "3 API credits")

### Strategy Selection Section
- Label: "SELECT STRATEGY — click to view stats or run a test scan"

### Strategy Cards Grid (3 columns × 3 rows)
Each card contains:
- **Strategy Name** (white text, bold)
- **Status Badge**: "ACTIVE" (green background)
- **Sub-description** (small gray text)
- **BALANCE**: Current account balance (e.g., $9,977)
- **P&L**: Profit/Loss (green for positive, red for negative)
  - Example: -$23.05, +$59.93
- **WIN RATE**: Percentage (e.g., 53.6%, 44.4%)
- **Configuration Stats** (small text):
  - Min confluence (e.g., "Min 10/20")
  - Max trades (e.g., "Max 3 Trades")
  - Time restrictions (e.g., "08:00-10:00 GMT only")

**Available Strategies:**
1. **Turtle Trader** - Classic trend-following strategy
2. **London Breakout** - Session-based breakout trades
3. **ICT Kill Zone** - Order flow-based entries
4. **Wyckoff Reversal** - Accumulation/distribution patterns
5. **Smart Money (SMC)** - Smart money concepts
6. **Momentum Burst** - Momentum-based entries
7. **Statistical Pairs** - Correlation-based pairs trading
8. **Asian Breakout** - Asian session breakout strategy
9. **Carry Trade** - Interest rate differential trading

---

## Tab 6: BACKTEST

### Configuration Section
- Label: "BACKTEST CONFIGURATION"

### Sub-sections:

**TIMEFRAME**
- Buttons: 15M, 1H, 4H (selected), 1D
- Single selection

**HISTORY DEPTH**
- Buttons: 300, 500 (selected in gold), 1000, 2000, 5000
- Determines how many candles to replay

**LOOK-AHEAD**
- Buttons: 5 candles, 10 candles (selected in cyan), 20 candles, 30 candles
- Sets forward-looking window

**PAIR**
- Currency pair selection buttons
- EUR/USD selected
- 11 pairs available same as Scanner

**MIN CONFLUENCE**
- Slider showing 7/10
- Yellow-filled slider with circle handle

### Action Button
- Large green bordered button
- Text: "▶ RUN BACKTEST — EUR/USD 4H" (updates dynamically)

### Results Area
- Instructions: "Select a pair and run the backtest. Replays up to 5000 candles of history."
- Would display detailed backtest results when executed

---

## Tab 7: CLOCK

### Main Time Display
- Label: "COORDINATED UNIVERSAL TIME (UTC)" (in small gray text)
- Large digital time: "09:41:14" (monospace font)
- Date: "Wed 2 Sep 2026"
- Market status: "London OPEN" (in green)

### 24-Hour Session Timeline
- Label: "24-HOUR SESSION TIMELINE (UTC)"
- Visual chart showing:
  - **Sydney** (Purple bar): 22:00 - 07:00
  - **Tokyo** (Cyan/Teal bar): 00:00 - 09:00
  - **London** (Gold/Yellow bar): 08:00 - 17:00 (marked "LIVE")
  - **New York** (Blue bar): 13:00 - 22:00
  
- Timeline axis at bottom: 00, 04, 08, 12, 16, 20, 00
- Current time marked with vertical white line
- Indicates overlapping sessions (e.g., "LONDON / NEW YORK OVERLAP")

### Market Sessions Info Grid (2 columns × 2 rows)
Each box contains:
- Session name (bold)
- Status badge: "OPEN", "CLOSED"
- UTC time range
- Time until open/close
- Major currency pairs traded in that session

**Sessions:**
1. **Sydney**
   - Status: CLOSED
   - Opens in: 13h 19m
   - Pairs: AUD/USD, NZD/USD

2. **Tokyo**
   - Status: CLOSED
   - Opens in: 15h 19m
   - Pairs: USD/JPY, EUR/JPY, GBP/JPY

3. **London**
   - Status: OPEN (highlighted in gold)
   - Active hours

4. **New York**
   - Status: CLOSED
   - Time until open

---

## Visual Design Elements

### Color Scheme
- **Background**: Dark navy/black (#1a1a2e or similar)
- **Accent Primary**: Cyan/Green (#00ff88 or similar) - active selections, confirmations
- **Accent Secondary**: Gold/Yellow (#ffd700 or similar) - important highlights, selected defaults
- **Text**: Light gray/white for contrast
- **Positive**: Green (#00ff00 or variations)
- **Negative**: Red (#ff3333 or similar)
- **Neutral/Disabled**: Dark gray

### Typography
- Headers: Monospace font (likely Courier New or similar)
- Body text: Sans-serif, clean and readable
- Sizes: Varied for hierarchy
- Font weights: Bold for headers, regular for content

### Layout Principles
- Vertical sectioning with clear visual separation
- Grouped related controls
- Consistent button styling
- Ample padding and margins
- Scrollable areas for dynamic content
- Responsive grid layouts for strategy cards and market info

### Interactive Elements
- **Buttons**: Bordered rectangles with:
  - Border color changes on selection (cyan, gold, red)
  - Text color changes based on state
  - Hover states (implied)
  
- **Sliders**: Yellow filled portion with circle handle
  
- **Badges**: Small pill-shaped indicators for status
  
- **Cards**: Bordered containers with internal structure

---

## Key Features Summary

### Real-time Functionality
- Live market data scanning
- Account balance tracking
- Position monitoring
- Session timing

### Analysis Tools
- Multiple technical indicators (Trend, MACD, SMA, RSI, Bollinger Bands, etc.)
- Customizable signal weights
- Confluence scoring system
- Backtesting capabilities

### Trading Integration
- Demo account with paper trading
- OANDA account connection
- Automated bot with 8+ strategies
- Trade execution (demo and live)

### User Customization
- 6 preset strategies for quick configuration
- Individual indicator weight adjustment
- Multiple timeframes and pairs
- Confluence threshold control

---

## Navigation Flow

1. **Primary**: Tab navigation at top (7 tabs total)
2. **Secondary**: Within each tab, various control groups
3. **Tertiary**: Within control groups, individual selections
4. **Modals**: Expandable panels (Signal Weights configuration)
5. **Actions**: Large button triggers for main actions

---

## User Interaction Patterns

1. **Configuration First**: Select parameters before execution
2. **Scan/Execute**: Click primary action button
3. **Review Results**: View in scrollable log or card display
4. **Drill Down**: Click on specific signals or charts for details
5. **Account Management**: Monitor balances and positions in separate tabs
6. **Automated**: Bot runs without user interaction per settings

---

## Data Display Patterns

- **Numerical**: Account balances, P&L, win rates
- **Tabular**: Trade history, closed positions
- **Graphical**: Charts, timeline, slider values
- **Textual**: Scan logs, status messages, strategy descriptions
- **Visual Indicators**: Colors for status, badges for states, borders for selections

---

## Responsive Behaviors

- Signal count updates dynamically ("PAIRS (3 selected)")
- Button labels update based on selections ("SCAN 3 PAIRS")
- Configuration panel expands/collapses
- Error messages display in scan log
- Real-time values update (time, balances, P&L)

---

## Error & Status States

- **Disclaimer Banner**: Always visible, closable
- **Disabled Buttons**: Grayed out (Test scan during initialization)
- **Error Messages**: Red text in scan log with error codes
- **Empty States**: Helpful messages when no data ("No open trades")
- **Loading States**: Scan progress indication with pair names

---

## Notable UI/UX Decisions

1. **Dark Theme**: Reduces eye strain for traders monitoring markets
2. **High Contrast**: Ensures readability of important data
3. **Monospace Typography**: Professional look, easier price/data reading
4. **Grouping & Separation**: Logical organization prevents overwhelming users
5. **Multiple Timeframes**: Supports different trading styles
6. **Preset Strategies**: Lowers barrier to entry for new users
7. **Paper Trading First**: Demo account reduces risk
8. **Real Account Integration**: OANDA connection for live trading
9. **Automated Bot**: Allows passive trading strategy execution
10. **Market Clock**: Helps traders plan around session activity

