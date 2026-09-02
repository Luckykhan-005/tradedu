# Forex Signal Scanner - Screenshots Guide

## Complete Application Overview

### Tab 1: SCANNER (Main Interface) - Overview
![Scanner Tab Overview](./.shogo/screenshots/agent-1788342006694-b2v89c/step-01.png)

**Key Elements Visible:**
- Header with balance display ($10,000.00)
- Navigation tabs with SCANNER active
- Red disclaimer banner
- TIMEFRAME selection (15M, 1H, 4H highlighted, 1D)
- HISTORY DEPTH selection (300, 500 highlighted, 1000, 2000, 5000)
- LOOK-AHEAD selection (5c, 10c highlighted, 20c, 30c)
- PAIRS display showing (3 selected): EUR/USD, GBP/USD, USD/JPY
- 11 total currency pairs available for selection
- MIN CONFLUENCE slider (7/20)
- SIGNAL WEIGHTS configuration panel (collapsed)
- AUTO-SCAN toggle control
- Large green SCAN button

---

### Tab 2: CHART (Chart Loading Interface)
![Chart Tab](./.shogo/screenshots/agent-1788342006694-b2v89c/step-02.png)

**Key Elements:**
- PAIR selection with all 11 currency pairs available
- EUR/USD is pre-selected
- TIMEFRAME selection (15M, 1H, 4H pre-selected, 1D)
- Large green button: "▶ LOAD CHART — EUR/USD 4H"
- Instructions: "Select a pair and click Load Chart — or click the chart button on any signal card."
- Responsive button label that updates based on selections

---

### Tab 3: DEMO (Demo Account Trading)
![Demo Tab](./.shogo/screenshots/agent-1788342006694-b2v89c/step-03.png)

**Key Elements:**
- DEMO ACCOUNT BALANCE: $10,000.00
- Started with $10,000 +$0.00 all time
- Statistics Grid:
  - OPEN TRADES: 0
  - OPEN P&L: +$0.00
  - TOTAL TRADES: 0
  - WIN RATE: 0%
  - WINS / LOSSES: 0 / 0
- "+ TOP UP" button for adding funds
- OPEN TRADES section showing "No open trades. Take a trade from the Scanner tab."

---

### Tab 4: OANDA (Live Account Integration)
![OANDA Tab](./.shogo/screenshots/agent-1788342006694-b2v89c/step-04.png)

**Key Elements:**
- OANDA PRACTICE ACCOUNT balance: $99,967.365
- Statistics Grid:
  - OPEN TRADES: 1
  - OPEN P&L: $-7.50 (loss)
  - REALIZED P&L: $-28.77
  - WIN RATE: 40%
  - WINS / LOSSES: 4 / 6
- "↻ REFRESH" button for updating data
- OPEN POSITIONS - 1 section:
  - GBP/USD LONG position
  - Lot: 0.10
  - P&L: $-7.50 (-7.5 pips)
  - Entry: 1.35541
  - Current: 1.35466
  - Stop Loss: 1.35217
  - Take Profit: 1.36234
  - "Close Position" button
- CLOSED TRADES - 10 section:
  - List of 10 previously closed trades
  - Showing dates, pairs, directions, entry/exit prices, P&L
  - Mix of profitable (+green) and losing (-red) trades

---

### Tab 5: BOT (Automated Trading Strategies)
![BOT Tab](./.shogo/screenshots/agent-1788342006694-b2v89c/step-05.png)

**Key Elements:**
- Blue information banner explaining bot functionality
- Status: "🟢 ACTIVE — all 8 strategies - every 30 min"
- Three control buttons:
  - ■ STOP BOT (red)
  - ↻ Run now (trigger immediate execution)
  - ᐳ Test scan (preview strategy - disabled/grayed)
- "SELECT STRATEGY" label
- 9-Strategy Grid Display (3 columns × 3 rows):
  1. Turtle Trader - Balance $9,977, P&L -$23.05, Win 53.6%
  2. London Breakout - Balance $9,994, P&L -$6.10, Win 44.4%
  3. ICT Kill Zone - Balance $9,973, P&L -$26.94, Win 25%
  4. Wyckoff Reversal - Balance $9,983, P&L -$16.53, Win 25%
  5. Smart Money (SMC) - Balance $10,060, P&L +$59.93, Win 54.8%
  6. Momentum Burst - Balance $10,014, P&L +$13.80, Win 55.9%
  7. Statistical Pairs - Balance $9,952, P&L -$48.21, Win 28.9%
  8. Asian Breakout - Balance $10,009, P&L +$8.88, Win 48.1%
  9. Carry Trade - Balance $9,918, P&L -$81.62, Win 0%
- Each card shows: Status badge, balance, P&L (color-coded), win rate, configuration details

---

### Tab 6: BACKTEST (Historical Testing)
![Backtest Tab](./.shogo/screenshots/agent-1788342006694-b2v89c/step-06.png)

**Key Elements:**
- BACKTEST CONFIGURATION panel
- TIMEFRAME selection (15M, 1H, 4H highlighted, 1D)
- HISTORY DEPTH selection (300, 500 highlighted, 1000, 2000, 5000)
- LOOK-AHEAD selection (5 candles, 10 candles highlighted, 20 candles, 30 candles)
- PAIR selection (EUR/USD highlighted)
- MIN CONFLUENCE slider (7/10)
- Large button: "▶ RUN BACKTEST — EUR/USD 4H"
- Instructions: "Select a pair and run the backtest. Replays up to 5000 candles of history."

---

### Tab 7: CLOCK (Market Session Timing)
![Clock Tab](./.shogo/screenshots/agent-1788342006694-b2v89c/step-07.png)

**Key Elements:**
- COORDINATED UNIVERSAL TIME (UTC) display
- Digital time: 09:41:14
- Date: Wed 2 Sep 2026
- Market status: "London OPEN" (in green)
- 24-HOUR SESSION TIMELINE visualization:
  - Sydney (purple bar): 22:00 - 07:00
  - Tokyo (cyan bar): 00:00 - 09:00
  - London (gold bar): 08:00 - 17:00 (marked LIVE)
  - New York (blue bar): 13:00 - 22:00
  - Current time indicator line
  - Overlap indicator at bottom
- Market Sessions Information Grid:
  - Sydney: CLOSED, Opens in 13h 19m, Pairs: AUD/USD, NZD/USD
  - Tokyo: CLOSED, Opens in 15h 19m, Pairs: USD/JPY, EUR/JPY, GBP/JPY
  - London: OPEN (highlighted)
  - New York: CLOSED

---

### SCANNER Signal Weights Configuration (Expanded)
![Signal Weights Expanded](./.shogo/screenshots/agent-1788342006694-b2v89c/step-08.png)

**Key Elements:**
- SIGNAL WEIGHTS header with max 10.0/20 limit
- "collapse" button to hide panel
- Two-column layout of indicator controls:

**Left Column:**
- Trend Direction: 0x, 0.5x, 1x (selected), 1.5x, 2x
- MACD Cross: 0x, 0.5x, 1x (selected), 1.5x, 2x
- 200 SMA Position: 0x, 0.5x, 1x (selected), 1.5x, 2x
- Support / Resistance: 0x, 0.5x, 1x (selected), 1.5x, 2x
- Volume Confirmation: 0x, 0.5x, 1x (selected), 1.5x, 2x

**Right Column:**
- RSI Momentum: 0x, 0.5x, 1x (selected), 1.5x, 2x
- 50 SMA Position: 0x, 0.5x, 1x (selected), 1.5x, 2x
- Bollinger Bands: 0x, 0.5x, 1x (selected), 1.5x, 2x
- Candlestick Pattern: 0x, 0.5x, 1x (selected), 1.5x, 2x
- Market Session: 0x, 0.5x, 1x (selected), 1.5x, 2x

**Preset Buttons:**
- Swing Trader - "Balanced — trend, key levels & 200 SMA lead"
- Scalper - "Fast entries — RSI, MACD, session timing & momentum"
- Trend Follower - "Ride the trend — both SMAs & trend direction dominate"
- Breakout - "Level breaks — Bollinger, S/R & volume confirm the move"
- Reversal Hunter - "Counter-trend — RSI extremes, Bollinger & candlestick patterns"
- Session Trader - "News & opens — session timing & volume are everything"
- reset (1x all) button

---

### Scan Execution & Results Logging
![Scan Results](./.shogo/screenshots/agent-1788342006694-b2v89c/step-09.png)

**Key Elements:**
- SCAN LOG section showing:
  - "SCAN 1.00" - iteration number
  - "Scanning EUR/USD [4H]..."
  - "✗ EUR/USD: Request failed with status code 429" (error in red)
  - "Scanning GBP/USD [4H]..."
  - "✗ GBP/USD: Request failed with status code 429"
  - "Scanning USD/JPY [4H]..."
  - "✗ USD/JPY: Request failed with status code 429"
- Result message: "No setups met the 7/10 threshold."
- Signal weights configuration still visible in background

---

### Collapsed Signal Weights Configuration
![Collapsed Signal Weights](./.shogo/screenshots/agent-1788342006694-b2v89c/step-12.png)

**Key Elements:**
- Full scanner interface with collapsed signal weights
- Shows summary line: "SIGNAL WEIGHTS max 10.0/20" with "▼ configure" button
- All main controls visible:
  - Timeframe, History Depth, Look-Ahead selections
  - Pairs selection (3 selected)
  - MIN CONFLUENCE slider
  - AUTO-SCAN control
  - Large SCAN button
- Scan log showing recent scan execution
- Clean, organized layout with all parameters visible at once

---

## Color & Design Reference

### Color Palette
- **Dark Background**: Navy/Black (#1a1a2e region)
- **Accent Green/Cyan**: #00ff88 (active selections, confirmations)
- **Accent Gold/Yellow**: #ffd700 (highlights, selected defaults)
- **Text**: Light gray/white
- **Positive Values**: Green (#00ff00)
- **Negative Values**: Red (#ff3333)
- **Borders**: Cyan for active, Gold for selections

### Font Styles
- Headers: Monospace, bold
- Body: Clean sans-serif
- Large displays (prices, time): Monospace
- Small text (descriptions): Light gray

### Button States
- **Active**: Colored border (cyan, gold, or red)
- **Inactive**: Gray border
- **Hover**: (Implied darker background)
- **Disabled**: Grayed out with strikethrough text

---

## Layout Principles

1. **Vertical Organization**: Top to bottom flow
2. **Grouped Controls**: Related options together
3. **Clear Separation**: Visual spacing between sections
4. **Responsive Labels**: Dynamic text (e.g., "SCAN 3 PAIRS")
5. **Consistent Styling**: Uniform button and text treatment
6. **Grid Systems**: Strategy cards, market info in organized grids
7. **Scrollable Content**: Long lists (trades, scan logs)
8. **Fixed Headers**: Navigation and account info always visible

---

## Key Statistics Displayed

### Account Metrics
- Account Balance (Primary metric)
- Open Trades count
- Open P&L (unrealized profit/loss)
- Realized P&L (closed trades profit/loss)
- Win Rate (percentage)
- Wins / Losses ratio

### Strategy Metrics
- Balance (current account value for strategy)
- P&L (strategy performance)
- Win Rate (success percentage)
- Min Confluence (minimum threshold)
- Max Trades (concurrent positions)
- Time Restrictions (if applicable)

### Market Information
- Current UTC time
- Session status (OPEN/CLOSED)
- Time until next open
- Major pairs per session
- Session duration and overlap times

---

## Interaction Flow Summary

### Primary Workflow (Scanning)
1. Select Timeframe (Scanner Tab)
2. Select History Depth
3. Select Look-Ahead
4. Select Pairs
5. Configure Signal Weights (optional)
6. Adjust MIN CONFLUENCE if needed
7. Click SCAN button
8. View results in log
9. Click chart or trade buttons on signals

### Secondary Workflow (Account Management)
1. View Demo account (paper trading)
2. View OANDA account (live account)
3. Monitor positions and P&L
4. Close positions as needed
5. Review trade history

### Tertiary Workflow (Automation)
1. Select BOT tab
2. View active strategies
3. Click "Run now" for immediate execution
4. Monitor results
5. Adjust settings as needed

### Quaternary Workflow (Analysis)
1. Select BACKTEST tab
2. Configure parameters
3. Run backtest
4. Analyze historical performance
5. View strategy stats

---

## Notable UI Features

### Dynamic Elements
- Time display updates in real-time
- Balance updates from account integration
- P&L changes with open positions
- Button labels change based on selections
- Scan log displays live progress

### Expandable Sections
- Signal Weights configuration panel
- Closed trades list (with "hide" toggle)
- Strategy details on BOT tab

### Status Indicators
- Badges (OPEN, CLOSED, LONG, SHORT, ACTIVE)
- Color coding (green = positive/active, red = negative)
- Text styling (bold = important, small = secondary)

### Help & Guidance
- Disclaimer banner with risk warning
- Informational boxes on BOT tab
- Instructional messages in empty states
- Descriptive preset names

---

## Technical Integration Points

### External Data Sources
- Live market data (forex prices)
- OANDA API (account balances, positions, trades)
- Technical indicators (MACD, RSI, SMA, Bollinger Bands, etc.)
- Market session information

### Execution Points
- Demo account trading (simulated)
- Live trading (OANDA integration)
- Bot automation (server-side runs every 30 min)
- Chart loading (price data visualization)

### Real-time Updates
- Account balances
- Open positions and P&L
- Market time and sessions
- Scan results and logs

